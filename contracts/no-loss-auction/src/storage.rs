use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Token,
    NextAuctionId,
    Auction(u64),
    PendingRefund(u64, Address),
}

#[contracttype]
#[derive(Clone)]
pub enum AuctionStatus {
    Active,
    Finalized,
    Cancelled,
}

#[contracttype]
#[derive(Clone)]
pub struct Auction {
    pub auction_id: u64,
    pub seller: Address,
    pub item_name: String,
    pub start_price: i128,
    pub highest_bid: i128,
    pub highest_bidder: Option<Address>,
    pub end_ledger: u32,
    pub status: AuctionStatus,
    pub bid_count: u32,
}