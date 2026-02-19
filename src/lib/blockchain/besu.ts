import { JsonRpcProvider, Wallet } from "ethers";

export function createWallet(privateKey: string, rpcEndpoint: string) {
  const provider = new JsonRpcProvider(rpcEndpoint);

  return new Wallet(privateKey, provider);
}

