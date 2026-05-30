import { Client, networks } from "../../../packages/no_loss_auction/dist/index.js";

export const contract = new Client({
  ...networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org:443",
});