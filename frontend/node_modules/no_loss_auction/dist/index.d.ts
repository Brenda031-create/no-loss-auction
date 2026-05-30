import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64, i128, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CCOBLO6EAK2FMYZBKGWI7YMKPF7V47AIBTSI2IABRYBBEGREQ5VZV5FU";
    };
};
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
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Token";
    values: void;
} | {
    tag: "NextAuctionId";
    values: void;
} | {
    tag: "Auction";
    values: readonly [u64];
} | {
    tag: "PendingRefund";
    values: readonly [u64, string];
};
export type AuctionStatus = {
    tag: "Active";
    values: void;
} | {
    tag: "Finalized";
    values: void;
} | {
    tag: "Cancelled";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    bid: ({ auction_id, bidder, amount }: {
        auction_id: u64;
        bidder: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_auction: ({ auction_id }: {
        auction_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Auction>>;
    /**
     * Construct and simulate a claim_refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    claim_refund: ({ auction_id, bidder }: {
        auction_id: u64;
        bidder: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a cancel_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    cancel_auction: ({ auction_id }: {
        auction_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a create_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create_auction: ({ seller, item_name, start_price, end_ledger }: {
        seller: string;
        item_name: string;
        start_price: i128;
        end_ledger: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a next_auction_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    next_auction_id: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a finalize_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    finalize_auction: ({ auction_id }: {
        auction_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_pending_refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_pending_refund: ({ auction_id, bidder }: {
        auction_id: u64;
        bidder: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, token }: {
        admin: string;
        token: string;
    }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        bid: (json: string) => AssembledTransaction<null>;
        get_auction: (json: string) => AssembledTransaction<Auction>;
        claim_refund: (json: string) => AssembledTransaction<null>;
        cancel_auction: (json: string) => AssembledTransaction<null>;
        create_auction: (json: string) => AssembledTransaction<bigint>;
        next_auction_id: (json: string) => AssembledTransaction<bigint>;
        finalize_auction: (json: string) => AssembledTransaction<null>;
        get_pending_refund: (json: string) => AssembledTransaction<bigint>;
    };
}
