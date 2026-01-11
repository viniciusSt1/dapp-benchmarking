import { JsonRpcProvider, Wallet } from "ethers";

export const RPC_URL = "http://127.0.0.1:8545"; // node1

export const provider = new JsonRpcProvider(RPC_URL);

export const wallet = new Wallet(
  "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // --> Conta fe3b...
  provider
);
