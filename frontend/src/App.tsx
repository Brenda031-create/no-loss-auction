import CreateAuctionForm from "./components/CreateAuctionForm";
import LoadAuctionForm from "./components/LoadAuctionForm";
import BidForm from "./components/BidForm";
import RefundPanel from "./components/RefundPanel";
import AuctionDetails from "./components/AuctionDetails";
import AdminActions from "./components/AdminActions";
import StatusMessage from "./components/StatusMessage";

import { useAuction } from "./hooks/useAuction";

import {
  createAuction,
  getAuction,
  placeBid,
  getPendingRefund,
  claimRefund,
  finalizeAuction,
  cancelAuction,
} from "./services/auctionService";

import { useState } from "react";

export default function App() {
  const [showAdminActions, setShowAdminActions] = useState(false);

  const { auction, setAuction, status, setStatus, pendingRefund, setPendingRefund } = useAuction();

  async function handleCreate(
    seller: string,
    itemName: string,
    startPrice: bigint,
    endLedger: number
  ) {
    try {
      setStatus("Creating auction...");
      const result = await createAuction(seller, itemName, startPrice, endLedger);

      const createdAuctionId =
        typeof result === "object" && result !== null && "result" in result
          ? (result as { result: bigint }).result
          : (result as bigint);

      setStatus(`Auction created with ID ${createdAuctionId}`);
      await handleLoadAuction(createdAuctionId);
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to create auction");
    }
  }

  async function handleLoadAuction(auctionId: bigint) {
    try {
      setStatus("Loading auction...");
      const result = await getAuction(auctionId);
      setAuction(result);
      setStatus("Auction loaded");
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to load auction");
    }
  }

  async function handleBid(auctionId: bigint, bidder: string, amount: bigint) {
    try {
      setStatus("Placing bid...");
      await placeBid(auctionId, bidder, amount);
      setStatus("Bid successful");
      await handleLoadAuction(auctionId);
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to place bid");
    }
  }

  async function handleCheckRefund(auctionId: bigint, bidder: string) {
    try {
      const refund = await getPendingRefund(auctionId, bidder);
      setPendingRefund(refund.toString());
      setStatus("Refund loaded");
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to get refund");
    }
  }

  async function handleClaimRefund(auctionId: bigint, bidder: string) {
    try {
      setStatus("Claiming refund...");
      await claimRefund(auctionId, bidder);
      setPendingRefund("0");
      setStatus("Refund claimed");
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to claim refund");
    }
  }

  async function handleFinalize() {
    try {
      if (!auction) return;

      setStatus("Finalizing auction...");
      await finalizeAuction(auction.auction_id);
      await handleLoadAuction(auction.auction_id);
      setStatus("Auction finalized");
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to finalize auction");
    }
  }

  async function handleCancel() {
    try {
      if (!auction) return;

      setStatus("Cancelling auction...");
      await cancelAuction(auction.auction_id);
      await handleLoadAuction(auction.auction_id);
      setStatus("Auction cancelled");
    } catch (error: any) {
      setStatus(error?.message ?? "Failed to cancel auction");
    }
  }

  return (
    <div className="app-shell">
      <main className="page-shell">
        <header className="hero">
          <div>
            <p className="eyebrow">Soroban frontend</p>
            <h1>No-Loss Auction Protocol</h1>
            <p className="hero-copy">
              The seller actions are the main view. Admin controls stay behind a button when needed.
            </p>
          </div>

          <div className="hero-actions">
            <StatusMessage status={status} />

            <button
              type="button"
              className="hero-button"
              onClick={() => setShowAdminActions((current) => !current)}
            >
              {showAdminActions ? "View seller actions" : "View admin actions"}
            </button>
          </div>
        </header>

        <section className="panel panel-seller panel-primary">
          <div className="panel-header">
            <p className="panel-label">Seller actions</p>
            <h2>Bid and manage refunds</h2>
            <p className="panel-copy">
              Place bids, check pending refunds, and claim returned funds.
            </p>
          </div>

          <LoadAuctionForm onLoad={handleLoadAuction} />
          <BidForm onBid={handleBid} />
          <RefundPanel
            onCheckRefund={handleCheckRefund}
            onClaimRefund={handleClaimRefund}
            pendingRefund={pendingRefund}
          />
        </section>

        {showAdminActions ? (
          <section className="panel panel-admin admin-panel">
            <div className="panel-header">
              <p className="panel-label">Admin actions</p>
              <h2>Create and govern auctions</h2>
              <p className="panel-copy">
                Create auctions, then finalize or cancel them from one place.
              </p>
            </div>

            <CreateAuctionForm onCreate={handleCreate} />
            <AdminActions onFinalize={handleFinalize} onCancel={handleCancel} />
          </section>
        ) : null}

        <section className="panel details-panel">
          <div className="panel-header">
            <p className="panel-label">Live data</p>
            <h2>Auction details</h2>
            <p className="panel-copy">
              Inspect the currently loaded auction state below.
            </p>
          </div>

          <AuctionDetails auction={auction} />
        </section>
      </main>
    </div>
  );
}
