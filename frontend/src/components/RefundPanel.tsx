import { useState } from "react";

interface RefundPanelProps {
  onCheckRefund: (
    auctionId: bigint,
    bidder: string
  ) => Promise<void>;

  onClaimRefund: (
    auctionId: bigint,
    bidder: string
  ) => Promise<void>;

  pendingRefund: string;
}

export default function RefundPanel({
  onCheckRefund,
  onClaimRefund,
  pendingRefund,
}: RefundPanelProps) {
  const [auctionId, setAuctionId] = useState("");
  const [bidder, setBidder] = useState("");

  return (
    <section className="form-card compact-card">
      <h3>Refunds</h3>

      <input
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />

      <input
        placeholder="Bidder Address"
        value={bidder}
        onChange={(e) => setBidder(e.target.value)}
      />

      <div className="button-row">
        <button onClick={() => onCheckRefund(BigInt(auctionId), bidder)}>
          Check Refund
        </button>

        <button onClick={() => onClaimRefund(BigInt(auctionId), bidder)} className="secondary-button">
          Claim Refund
        </button>
      </div>

      <p className="refund-value">
        Pending Refund: {pendingRefund}
      </p>
    </section>
  );
}