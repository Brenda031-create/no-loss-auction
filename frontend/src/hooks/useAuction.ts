import { useState } from "react";

export function useAuction() {
  const [auction, setAuction] =
    useState<any>(null);

  const [status, setStatus] =
    useState("");

  const [pendingRefund, setPendingRefund] =
    useState("0");

  return {
    auction,
    setAuction,

    status,
    setStatus,

    pendingRefund,
    setPendingRefund,
  };
}