import { contract } from "../lib/contract";

export async function createAuction(
  seller: string,
  itemName: string,
  startPrice: bigint,
  endLedger: number
) {
  return contract.create_auction({
    seller,
    item_name: itemName,
    start_price: startPrice,
    end_ledger: endLedger,
  });
}

export async function getAuction(
  auctionId: bigint
) {
  return contract.get_auction({
    auction_id: auctionId,
  });
}

export async function placeBid(
  auctionId: bigint,
  bidder: string,
  amount: bigint
) {
  return contract.bid({
    auction_id: auctionId,
    bidder,
    amount,
  });
}

export async function getPendingRefund(
  auctionId: bigint,
  bidder: string
) {
  return contract.get_pending_refund({
    auction_id: auctionId,
    bidder,
  });
}

export async function claimRefund(
  auctionId: bigint,
  bidder: string
) {
  return contract.claim_refund({
    auction_id: auctionId,
    bidder,
  });
}

export async function finalizeAuction(
  auctionId: bigint
) {
  return contract.finalize_auction({
    auction_id: auctionId,
  });
}

export async function cancelAuction(
  auctionId: bigint
) {
  return contract.cancel_auction({
    auction_id: auctionId,
  });
}