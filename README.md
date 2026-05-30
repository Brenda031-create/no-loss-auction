# No-Loss Auction Protocol

A decentralized no-loss auction protocol built on **Soroban Smart Contracts** on the **Stellar Network**.

The protocol allows users to create auctions, place bids using a SEP-41 token, automatically track the highest bidder, securely handle refunds for outbid participants, finalize auctions after a deadline, and cancel auctions when no bids have been placed.

## Features

### Auction Creation

* Create a new auction.
* Set the auction item name.
* Define a starting bid amount.
* Define an auction deadline.

### Bidding System

* Place bids using a SEP-41 token.
* Automatically updates the highest bid.
* Automatically tracks the highest bidder.
* Prevents bids lower than the current highest bid.

### No-Loss Refund Mechanism

* When a bidder is outbid, their bid amount is stored as a pending refund.
* Outbid users can claim their refund at any time.
* Funds remain secure within the contract until claimed.

### Auction Finalization

* Auctions can be finalized only after the deadline has passed.
* Winning bid amount is transferred to the seller.
* Auction status changes to Finalized.

### Auction Cancellation

* Seller can cancel an auction only if no bids have been placed.
* Prevents cancellation of active auctions with participants.

### Event Emission

The contract emits events for:

* Auction creation
* New bids
* Refund claims
* Auction finalization
* Auction cancellation

### Frontend Integration

The project includes a React frontend integrated with generated Soroban TypeScript bindings.

Users can:

* Create auctions
* Place bids
* View auction information
* Check refunds
* Claim refunds
* Finalize auctions
* Cancel auctions


## Smart Contract Architecture

### Storage Keys

```rust
AuctionCount
Auction(u64)
PendingRefund(RefundKey)
Token
Admin
```

### Auction Structure

rust
Auction {
    auction_id,
    seller,
    item_name,
    start_price,
    highest_bid,
    highest_bidder,
    end_ledger,
    bid_count,
    status
}


### Refund Structure

```rust
RefundKey {
    auction_id,
    bidder
}

### Auction Status

```rust
Active
Finalized
Cancelled


## Contract Functions

### Constructor

```rust
__constructor(admin, token)


Initializes the contract.


### Create Auction

```rust
create_auction(
    seller,
    item_name,
    start_price,
    end_ledger
)


Creates a new auction.

Returns:

```rust
auction_id




### Get Auction

```rust
get_auction(auction_id)
```

Returns auction details.

### Place Bid

```rust
bid(
    auction_id,
    bidder,
    amount
)

Places a bid on an active auction.

Requirements:

* Auction must be active.
* Bid must be greater than current highest bid.
* Bidder must approve token spending.


### Get Pending Refund

```rust
get_pending_refund(
    auction_id,
    bidder
)

Returns the refund amount available for a bidder.


### Claim Refund

```rust
claim_refund(
    auction_id,
    bidder
)


Transfers refundable tokens back to the bidder.



### Finalize Auction

```rust
finalize_auction(
    auction_id
)

Finalizes an auction after its deadline.

Effects:

* Transfers winning bid to seller.
* Updates auction status.



### Cancel Auction

```rust
cancel_auction(
    auction_id
)


Cancels an auction when no bids exist.



## Testing

Unit tests were implemented for the following scenarios:

### Auction Creation

```rust
test_create_auction()


Verifies:

* Auction is created successfully.
* Auction data is stored correctly.



### First Bid

```rust
test_place_first_bid()
```

Verifies:

* First bid becomes highest bid.
* Highest bidder is updated.


### Outbid Refund Creation

```rust
test_outbid_creates_pending_refund()
```

Verifies:

* Previous highest bidder receives a pending refund.

---

### Refund Claim

```rust
test_claim_refund()


Verifies:

* Refund is transferred successfully.
* Refund balance is cleared.

---

### Auction Finalization

```rust
test_finalize_auction_after_deadline()
```

Verifies:

* Auction finalizes correctly.
* Seller receives winning bid.

---

### Auction Cancellation

```rust
test_cancel_auction_with_no_bids()
```

Verifies:

* Auction can be cancelled when no bids exist.

---

### Failed Cancellation

```rust
test_cancel_auction_with_bids_fails()
```

Verifies:

* Auction cannot be cancelled after bidding begins.

---

### Invalid Bid

```rust
test_bid_lower_than_highest_fails()
```

Verifies:

* Lower bids are rejected.

---

### Expired Auction Bid

```rust
test_bid_after_deadline_fails()
```

Verifies:

* Bids cannot be placed after the deadline.

---

## Frontend

Built using:

* React
* TypeScript
* Vite
* Soroban TypeScript Bindings

### Frontend Features

* Create Auction
* Load Auction
* Place Bid
* View Auction Details
* Check Refunds
* Claim Refunds
* Finalize Auction
* Cancel Auction

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd no-loss-auction
```

---

### Build Contract

```bash
stellar contract build
```

---

### Run Tests

```bash
cargo test
```

---

### Deploy Contract

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/no_loss_auction.wasm \
  --source-account default \
  --network testnet
```

---

### Generate Frontend Bindings

```bash
stellar contract bindings typescript \
  --network testnet \
  --id <CONTRACT_ID> \
  --output-dir ./packages/no_loss_auction \
  --overwrite
```

---

### Install Frontend Dependencies

```bash
cd frontend

npm install

npm install ../packages/no_loss_auction
```

### Run Frontend

```bash
npm run dev
```

## Testnet Deployment

### Contract ID

```text
CCOBLO6EAK2FMYZBKGWI7YMKPF7V47AIBTSI2IABRYBBEGREQ5VZV5FU
```

### Network

```text
Stellar Testnet

