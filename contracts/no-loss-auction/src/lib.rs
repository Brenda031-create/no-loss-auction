#![no_std]

use core::panic;

use soroban_sdk::{contract, contractimpl, token, Address, Env, String};

mod events;
mod storage;

use crate::events::{
    AuctionCancelledEvent, AuctionCreatedEvent, AuctionFinalizedEvent, BidPlacedEvent,
    RefundClaimedEvent, RefundCreditedEvent,
};
use crate::storage::{Auction, AuctionStatus, DataKey};

#[contract]
pub struct NoLossAuction;

#[contractimpl]
impl NoLossAuction {
    pub fn __constructor(env: &Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("contract already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::NextAuctionId, &0u64);
    }

    fn require_admin(env: &Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
    }

    fn read_auction(env: &Env, auction_id: u64) -> Auction {
        env.storage()
            .persistent()
            .get(&DataKey::Auction(auction_id))
            .unwrap()
    }

    fn write_auction(env: &Env, auction: &Auction) {
        env.storage()
            .persistent()
            .set(&DataKey::Auction(auction.auction_id), auction);
    }

    pub fn create_auction(
        env: &Env,
        seller: Address,
        item_name: String,
        start_price: i128,
        end_ledger: u32,
    ) -> u64 {
        seller.require_auth();

        if start_price < 0 {
            panic!("start price cannot be negative");
        }

        let mut next_id: u64 = env.storage().instance().get(&DataKey::NextAuctionId).unwrap();
        next_id += 1;

        let auction = Auction {
            auction_id: next_id,
            seller: seller.clone(),
            item_name: item_name.clone(),
            start_price,
            highest_bid: start_price,
            highest_bidder: None,
            end_ledger,
            status: AuctionStatus::Active,
            bid_count: 0,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Auction(next_id), &auction);

        env.storage().instance().set(&DataKey::NextAuctionId, &next_id);

        AuctionCreatedEvent {
            auction_id: next_id,
            seller,
            item_name,
            start_price,
            end_ledger,
        }
        .publish(env);

        next_id
    }

    pub fn bid(env: &Env, auction_id: u64, bidder: Address, amount: i128) {
        bidder.require_auth();

        if amount <= 0 {
            panic!("bid amount must be positive");
        }

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(env, &token_address);

        let mut auction = Self::read_auction(env, auction_id);

        if !matches!(auction.status, AuctionStatus::Active) {
            panic!("auction is not active");
        }

        if env.ledger().sequence() >= auction.end_ledger {
            panic!("auction deadline has passed");
        }

        if amount <= auction.highest_bid {
            panic!("bid must be higher than current highest bid");
        }

        // Bid funds are escrowed in the contract.
        // The bidder must approve the contract first so transfer_from can succeed.
        token_client.transfer_from(&contract_address, &bidder, &contract_address, &amount);

        // Claimable-refund design:
        // we store the previous highest bid as refundable balance instead of forcing
        // an immediate refund that could fail and revert the bid update.
        if let Some(previous_bidder) = auction.highest_bidder.clone() {
            let previous_amount = auction.highest_bid;

            let pending_key = DataKey::PendingRefund(auction_id, previous_bidder.clone());
            let current_refund: i128 = env
                .storage()
                .persistent()
                .get(&pending_key)
                .unwrap_or(0);

            env.storage()
                .persistent()
                .set(&pending_key, &(current_refund + previous_amount));

            RefundCreditedEvent {
                auction_id,
                bidder: previous_bidder,
                amount: previous_amount,
            }
            .publish(env);
        }

        auction.highest_bid = amount;
        auction.highest_bidder = Some(bidder.clone());
        auction.bid_count += 1;

        Self::write_auction(env, &auction);

        BidPlacedEvent {
            auction_id,
            bidder,
            amount,
        }
        .publish(env);
    }

    pub fn claim_refund(env: &Env, auction_id: u64, bidder: Address) {
        bidder.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(env, &token_address);
        let contract_address = env.current_contract_address();

        let pending_key = DataKey::PendingRefund(auction_id, bidder.clone());
        let refund_amount: i128 = env
            .storage()
            .persistent()
            .get(&pending_key)
            .unwrap_or(0);

        if refund_amount <= 0 {
            panic!("no refund available");
        }

        env.storage().persistent().set(&pending_key, &0i128);

        // Send the refundable amount back to the bidder.
        token_client.transfer(&contract_address, &bidder, &refund_amount);

        RefundClaimedEvent {
            auction_id,
            bidder,
            amount: refund_amount,
        }
        .publish(env);
    }

    pub fn finalize_auction(env: &Env, auction_id: u64) {
        let mut auction = Self::read_auction(env, auction_id);

        if !matches!(auction.status, AuctionStatus::Active) {
            panic!("auction is not active");
        }

        if env.ledger().sequence() < auction.end_ledger {
            panic!("auction has not ended yet");
        }

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(env, &token_address);
        let contract_address = env.current_contract_address();

        if let Some(winner) = auction.highest_bidder.clone() {
            // Move the winning bid from escrow to the seller.
            token_client.transfer(&contract_address, &auction.seller, &auction.highest_bid);

            AuctionFinalizedEvent {
                auction_id,
                winner: Some(winner),
                winning_bid: auction.highest_bid,
            }
            .publish(env);
        } else {
            // No bids means no winner and no payout.
            AuctionFinalizedEvent {
                auction_id,
                winner: None,
                winning_bid: 0,
            }
            .publish(env);
        }

        auction.status = AuctionStatus::Finalized;
        Self::write_auction(env, &auction);
    }

    pub fn cancel_auction(env: &Env, auction_id: u64) {
        let mut auction = Self::read_auction(env, auction_id);

        if !matches!(auction.status, AuctionStatus::Active) {
            panic!("auction is not active");
        }

        if auction.bid_count > 0 {
            panic!("cannot cancel an auction that already has bids");
        }

        auction.status = AuctionStatus::Cancelled;
        Self::write_auction(env, &auction);

        AuctionCancelledEvent { auction_id }.publish(env);
    }

    pub fn get_auction(env: &Env, auction_id: u64) -> Auction {
        Self::read_auction(env, auction_id)
    }

    pub fn get_pending_refund(env: &Env, auction_id: u64, bidder: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::PendingRefund(auction_id, bidder))
            .unwrap_or(0)
    }

    pub fn next_auction_id(env: &Env) -> u64 {
        env.storage().instance().get(&DataKey::NextAuctionId).unwrap()
    }
}