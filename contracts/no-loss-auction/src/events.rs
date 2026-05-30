use soroban_sdk::{contractevent, Address, String};

#[contractevent]
pub struct AuctionCreatedEvent {
    pub auction_id: u64,
    pub seller: Address,
    pub item_name: String,
    pub start_price: i128,
    pub end_ledger: u32,
}

#[contractevent]
pub struct BidPlacedEvent {
    pub auction_id: u64,
    pub bidder: Address,
    pub amount: i128,
}

#[contractevent]
pub struct RefundCreditedEvent {
    pub auction_id: u64,
    pub bidder: Address,
    pub amount: i128,
}

#[contractevent]
pub struct RefundClaimedEvent {
    pub auction_id: u64,
    pub bidder: Address,
    pub amount: i128,
}

#[contractevent]
pub struct AuctionFinalizedEvent {
    pub auction_id: u64,
    pub winner: Option<Address>,
    pub winning_bid: i128,
}

#[contractevent]
pub struct AuctionCancelledEvent {
    pub auction_id: u64,
}