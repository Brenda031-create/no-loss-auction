import { useState } from "react";

interface Props {
  onLoad: (auctionId: bigint) => Promise<void>;
}

export default function LoadAuctionForm({
  onLoad,
}: Props) {
  const [auctionId, setAuctionId] = useState("");

  return (
    <section className="form-card">
      <h3>Load Auction</h3>

      <input
        value={auctionId}
        onChange={(e) =>
          setAuctionId(e.target.value)
        }
        placeholder="Auction ID"
      />

      <button onClick={() => onLoad(BigInt(auctionId))}>
        Load
      </button>
    </section>
  );
}