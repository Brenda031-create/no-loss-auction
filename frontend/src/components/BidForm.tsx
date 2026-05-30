import { useState } from "react";

interface Props {
  onBid: (
    auctionId: bigint,
    bidder: string,
    amount: bigint
  ) => Promise<void>;
}

export default function BidForm({ onBid }: Props) {
  const [auctionId, setAuctionId] = useState("");
  const [bidder, setBidder] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <section className="form-card">
      <h3>Place Bid</h3>

      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />

      <input
        placeholder="Bidder"
        value={bidder}
        onChange={(e) => setBidder(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={() => onBid(BigInt(auctionId), bidder, BigInt(amount))}>
        Place Bid
      </button>
    </section>
  );
}