import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCOBLO6EAK2FMYZBKGWI7YMKPF7V47AIBTSI2IABRYBBEGREQ5VZV5FU",
  }
} as const








export interface Auction {
  auction_id: u64;
  bid_count: u32;
  end_ledger: u32;
  highest_bid: i128;
  highest_bidder: Option<string>;
  item_name: string;
  seller: string;
  start_price: i128;
  status: AuctionStatus;
}

export type DataKey = {tag: "Admin", values: void} | {tag: "Token", values: void} | {tag: "NextAuctionId", values: void} | {tag: "Auction", values: readonly [u64]} | {tag: "PendingRefund", values: readonly [u64, string]};

export type AuctionStatus = {tag: "Active", values: void} | {tag: "Finalized", values: void} | {tag: "Cancelled", values: void};

export interface Client {
  /**
   * Construct and simulate a bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bid: ({auction_id, bidder, amount}: {auction_id: u64, bidder: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_auction: ({auction_id}: {auction_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Auction>>

  /**
   * Construct and simulate a claim_refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_refund: ({auction_id, bidder}: {auction_id: u64, bidder: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a cancel_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel_auction: ({auction_id}: {auction_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_auction: ({seller, item_name, start_price, end_ledger}: {seller: string, item_name: string, start_price: i128, end_ledger: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a next_auction_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  next_auction_id: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a finalize_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  finalize_auction: ({auction_id}: {auction_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_pending_refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pending_refund: ({auction_id, bidder}: {auction_id: u64, bidder: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, token}: {admin: string, token: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin, token}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAADYmlkAAAAAAMAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAAAAAAABmJpZGRlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAALZ2V0X2F1Y3Rpb24AAAAAAQAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAEAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAAAAAAAAMY2xhaW1fcmVmdW5kAAAAAgAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAGYmlkZGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAOY2FuY2VsX2F1Y3Rpb24AAAAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAAA",
        "AAAAAAAAAAAAAAAOY3JlYXRlX2F1Y3Rpb24AAAAAAAQAAAAAAAAABnNlbGxlcgAAAAAAEwAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAALc3RhcnRfcHJpY2UAAAAACwAAAAAAAAAKZW5kX2xlZGdlcgAAAAAABAAAAAEAAAAG",
        "AAAAAAAAAAAAAAAPbmV4dF9hdWN0aW9uX2lkAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAQZmluYWxpemVfYXVjdGlvbgAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAAA",
        "AAAAAAAAAAAAAAASZ2V0X3BlbmRpbmdfcmVmdW5kAAAAAAACAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAZiaWRkZXIAAAAAABMAAAABAAAACw==",
        "AAAABQAAAAAAAAAAAAAADkJpZFBsYWNlZEV2ZW50AAAAAAABAAAAEGJpZF9wbGFjZWRfZXZlbnQAAAADAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAAAAAAGYmlkZGVyAAAAAAATAAAAAAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAElJlZnVuZENsYWltZWRFdmVudAAAAAAAAQAAABRyZWZ1bmRfY2xhaW1lZF9ldmVudAAAAAMAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAAAAAAAAAAAAAZiaWRkZXIAAAAAABMAAAAAAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAE0F1Y3Rpb25DcmVhdGVkRXZlbnQAAAAAAQAAABVhdWN0aW9uX2NyZWF0ZWRfZXZlbnQAAAAAAAAFAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAAAAAAGc2VsbGVyAAAAAAATAAAAAAAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAAAAAAAC3N0YXJ0X3ByaWNlAAAAAAsAAAAAAAAAAAAAAAplbmRfbGVkZ2VyAAAAAAAEAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAE1JlZnVuZENyZWRpdGVkRXZlbnQAAAAAAQAAABVyZWZ1bmRfY3JlZGl0ZWRfZXZlbnQAAAAAAAADAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAAAAAAGYmlkZGVyAAAAAAATAAAAAAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFUF1Y3Rpb25DYW5jZWxsZWRFdmVudAAAAAAAAAEAAAAXYXVjdGlvbl9jYW5jZWxsZWRfZXZlbnQAAAAAAQAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAFUF1Y3Rpb25GaW5hbGl6ZWRFdmVudAAAAAAAAAEAAAAXYXVjdGlvbl9maW5hbGl6ZWRfZXZlbnQAAAAAAwAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAAAAAABndpbm5lcgAAAAAD6AAAABMAAAAAAAAAAAAAAAt3aW5uaW5nX2JpZAAAAAALAAAAAAAAAAI=",
        "AAAAAQAAAAAAAAAAAAAAB0F1Y3Rpb24AAAAACQAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAJYmlkX2NvdW50AAAAAAAABAAAAAAAAAAKZW5kX2xlZGdlcgAAAAAABAAAAAAAAAALaGlnaGVzdF9iaWQAAAAACwAAAAAAAAAOaGlnaGVzdF9iaWRkZXIAAAAAA+gAAAATAAAAAAAAAAlpdGVtX25hbWUAAAAAAAAQAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAAC3N0YXJ0X3ByaWNlAAAAAAsAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA1BdWN0aW9uU3RhdHVzAAAA",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFVG9rZW4AAAAAAAAAAAAAAAAAAA1OZXh0QXVjdGlvbklkAAAAAAAAAQAAAAAAAAAHQXVjdGlvbgAAAAABAAAABgAAAAEAAAAAAAAADVBlbmRpbmdSZWZ1bmQAAAAAAAACAAAABgAAABM=",
        "AAAAAgAAAAAAAAAAAAAADUF1Y3Rpb25TdGF0dXMAAAAAAAADAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAlGaW5hbGl6ZWQAAAAAAAAAAAAAAAAAAAlDYW5jZWxsZWQAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    bid: this.txFromJSON<null>,
        get_auction: this.txFromJSON<Auction>,
        claim_refund: this.txFromJSON<null>,
        cancel_auction: this.txFromJSON<null>,
        create_auction: this.txFromJSON<u64>,
        next_auction_id: this.txFromJSON<u64>,
        finalize_auction: this.txFromJSON<null>,
        get_pending_refund: this.txFromJSON<i128>
  }
}