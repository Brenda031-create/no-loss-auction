import { useState } from "react";

interface Props {
  onCreate: (
    seller: string,
    itemName: string,
    startPrice: bigint,
    endLedger: number
  ) => Promise<void>;
}

export default function CreateAuctionForm({
  onCreate,
}: Props) {
  const [seller, setSeller] = useState("");
  const [itemName, setItemName] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endLedger, setEndLedger] = useState("");

  return (
    <section className="form-card">
      <h3>Create Auction</h3>

      <input
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
        placeholder="Seller"
      />

      <input
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Item"
      />

      <input
        value={startPrice}
        onChange={(e) => setStartPrice(e.target.value)}
        placeholder="Start Price"
      />

      <input
        value={endLedger}
        onChange={(e) => setEndLedger(e.target.value)}
        placeholder="End Ledger"
      />

      <button onClick={() => onCreate(seller, itemName, BigInt(startPrice), Number(endLedger))}>
        Create
      </button>
    </section>
  );
}