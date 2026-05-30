#![cfg(test)]

use soroban_sdk::{
    testutils::Address as _,
    testutils::Ledger as _,
    Address,
    Env,
    String,
    token,
};

use crate::{
    NoLossAuction, NoLossAuctionClient,
    storage::{AuctionStatus},
};

fn create_token_contract<'a>(
    env: &Env,
    admin: Address,
) -> (Address, token::StellarAssetClient<'a>) {
    // Registering a Stellar Asset Contract that behaves like a SEP-41 token.
    let contract_id = env.register_stellar_asset_contract_v2(admin.clone());
    (
        contract_id.address(),
        token::StellarAssetClient::new(env, &contract_id.address()),
    )
}

struct SetUpResult<'a> {
    env: Env,
    client: NoLossAuctionClient<'a>,
    token_client: token::StellarAssetClient<'a>,
    admin: Address,
    seller: Address,
    bidder1: Address,
    bidder2: Address,
    token_address: Address,
    auction_contract_address: Address,
}

fn setup<'a>() -> SetUpResult<'a> {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let seller = Address::generate(&env);
    let bidder1 = Address::generate(&env);
    let bidder2 = Address::generate(&env);

    // Creating the token contract used for bidding.
    let (token_address, token_client) = create_token_contract(&env, admin.clone());

    //registering the auction contract.
    let contract_id = env.register(NoLossAuction, (&admin, &token_address));
    let client = NoLossAuctionClient::new(&env, &contract_id);

    SetUpResult {
        env,
        client,
        token_client,
        admin,
        seller,
        bidder1,
        bidder2,
        token_address,
        auction_contract_address: contract_id,
    }
}

fn create_active_auction(setup_result: &SetUpResult, start_price: i128, end_ledger: u32) -> u64 {
    let item_name = String::from_str(&setup_result.env, "Rare Painting");

    setup_result.client.create_auction(
        &setup_result.seller,
        &item_name,
        &start_price,
        &end_ledger,
    )
}

fn approve_for_bid(setup_result: &SetUpResult, bidder: &Address, amount: i128) {
    // Bidder allows the auction contract to pull tokens during `transfer_from`.
    setup_result
        .token_client
        .approve(bidder, &setup_result.auction_contract_address, &amount, &1000u32);
}

#[test]
fn test_create_auction() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);
    let auction = setup_result.client.get_auction(&auction_id);

    assert_eq!(auction.auction_id, 1);
    assert_eq!(auction.seller, setup_result.seller);
    assert_eq!(auction.start_price, 100);
    assert_eq!(auction.highest_bid, 100);
    assert_eq!(auction.highest_bidder, None);
    assert_eq!(auction.end_ledger, 50);
    assert_eq!(auction.bid_count, 0);
    assert_eq!(auction.status, AuctionStatus::Active);
}

#[test]
fn test_place_first_bid() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    let bid_amount = 150i128;
    setup_result
        .token_client
        .mint(&setup_result.bidder1, &bid_amount);
    approve_for_bid(&setup_result, &setup_result.bidder1, bid_amount);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &bid_amount);

    let auction = setup_result.client.get_auction(&auction_id);
    let pending_refund = setup_result
        .client
        .get_pending_refund(&auction_id, &setup_result.bidder1);

    assert_eq!(auction.highest_bid, bid_amount);
    assert_eq!(auction.highest_bidder, Some(setup_result.bidder1.clone()));
    assert_eq!(auction.bid_count, 1);
    assert_eq!(pending_refund, 0);
}

#[test]
fn test_outbid_creates_pending_refund() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    let first_bid = 150i128;
    let second_bid = 220i128;

    setup_result.token_client.mint(&setup_result.bidder1, &first_bid);
    setup_result.token_client.mint(&setup_result.bidder2, &second_bid);

    approve_for_bid(&setup_result, &setup_result.bidder1, first_bid);
    approve_for_bid(&setup_result, &setup_result.bidder2, second_bid);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &first_bid);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder2, &second_bid);

    let auction = setup_result.client.get_auction(&auction_id);
    let refund_for_bidder1 = setup_result
        .client
        .get_pending_refund(&auction_id, &setup_result.bidder1);

    assert_eq!(auction.highest_bid, second_bid);
    assert_eq!(auction.highest_bidder, Some(setup_result.bidder2.clone()));
    assert_eq!(auction.bid_count, 2);
    assert_eq!(refund_for_bidder1, first_bid);
}
//test for claiming refunds.
#[test]
fn test_claim_refund() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    let first_bid = 150i128;
    let second_bid = 220i128;

    setup_result.token_client.mint(&setup_result.bidder1, &first_bid);
    setup_result.token_client.mint(&setup_result.bidder2, &second_bid);

    approve_for_bid(&setup_result, &setup_result.bidder1, first_bid);
    approve_for_bid(&setup_result, &setup_result.bidder2, second_bid);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &first_bid);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder2, &second_bid);

    let bidder1_balance_before = setup_result
        .token_client
        .balance(&setup_result.bidder1);

    assert_eq!(bidder1_balance_before, 0);

    setup_result
        .client
        .claim_refund(&auction_id, &setup_result.bidder1);

    let bidder1_balance_after = setup_result
        .token_client
        .balance(&setup_result.bidder1);
    let pending_refund_after = setup_result
        .client
        .get_pending_refund(&auction_id, &setup_result.bidder1);

    assert_eq!(bidder1_balance_after, first_bid);
    assert_eq!(pending_refund_after, 0);
}
//test for finalizing an auction after the deadline has passed.
#[test]
fn test_finalize_auction_after_deadline() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 10);

    let bid_amount = 250i128;
    setup_result.token_client.mint(&setup_result.bidder1, &bid_amount);
    approve_for_bid(&setup_result, &setup_result.bidder1, bid_amount);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &bid_amount);

    // Advance the ledger after the bid so the auction can be finalized.
    setup_result.env.ledger().with_mut(|li| {
        li.sequence_number = 20;
    });

    setup_result.client.finalize_auction(&auction_id);

    let auction = setup_result.client.get_auction(&auction_id);
    let seller_balance = setup_result.token_client.balance(&setup_result.seller);
    let contract_balance = setup_result
        .token_client
        .balance(&setup_result.auction_contract_address);

    assert_eq!(auction.status, AuctionStatus::Finalized);
    assert_eq!(auction.highest_bid, bid_amount);
    assert_eq!(auction.highest_bidder, Some(setup_result.bidder1.clone()));
    assert_eq!(seller_balance, bid_amount);
    assert_eq!(contract_balance, 0);
}
//test for canceling an auction with no bids.
#[test]
fn test_cancel_auction_with_no_bids() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    setup_result.client.cancel_auction(&auction_id);

    let auction = setup_result.client.get_auction(&auction_id);
    assert_eq!(auction.status, AuctionStatus::Cancelled);
}
//test for canceling an auction that already has bids, which should fail.
#[test]
fn test_cancel_auction_with_bids_fails() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    let bid_amount = 150i128;
    setup_result.token_client.mint(&setup_result.bidder1, &bid_amount);
    approve_for_bid(&setup_result, &setup_result.bidder1, bid_amount);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &bid_amount);

    let result = setup_result.client.try_cancel_auction(&auction_id);

    assert!(result.is_err());
}
//test for placing a bid lower than the current highest bid, which should fail.
#[test]
fn test_bid_lower_than_highest_fails() {
    let setup_result = setup();

    let auction_id = create_active_auction(&setup_result, 100, 50);

    let first_bid = 150i128;
    let lower_bid = 120i128;

    setup_result.token_client.mint(&setup_result.bidder1, &first_bid);
    setup_result.token_client.mint(&setup_result.bidder2, &lower_bid);

    approve_for_bid(&setup_result, &setup_result.bidder1, first_bid);
    approve_for_bid(&setup_result, &setup_result.bidder2, lower_bid);

    setup_result
        .client
        .bid(&auction_id, &setup_result.bidder1, &first_bid);

    let result = setup_result
        .client
        .try_bid(&auction_id, &setup_result.bidder2, &lower_bid);

    assert!(result.is_err());
}
//test for placing a bid after the auction deadline has passed, which should fail.
#[test]
fn test_bid_after_deadline_fails() {
    let setup_result = setup();

    // Advancing the ledger past the deadline before bidding.
    setup_result.env.ledger().with_mut(|li| {
        li.sequence_number = 100;
    });

    let auction_id = create_active_auction(&setup_result, 100, 10);

    let bid_amount = 150i128;
    setup_result.token_client.mint(&setup_result.bidder1, &bid_amount);
    approve_for_bid(&setup_result, &setup_result.bidder1, bid_amount);

    let result = setup_result
        .client
        .try_bid(&auction_id, &setup_result.bidder1, &bid_amount);

    assert!(result.is_err());
}
