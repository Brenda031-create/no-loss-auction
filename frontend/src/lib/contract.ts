import * as Client from "no_loss_auction";

export const contract = new Client.Client({
  ...Client.networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org:443",
});