import { Block } from "ethers";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------------- TYPES ---------------- */

interface ProjectState {
  name: string;
  description: string;
  category: string;
  image?: string;
  tags: string[];
}

interface BlockchainState {
  chainId: number | string;
  rpcEndpoint: string;
  rpcEndpointConnected: boolean;
  wsEndpoint: string;
  metricsEndpoint: string;
  blockTime: number;
  explorerUrl: string;
}

interface ContractState {
  address: string;
  name: string;
  solidityVersion: string;
  abi: any[] | null;
}

interface WalletState {
  address: string | null;
}

export interface CaliperResults {
  success: number;
  failures: number;
  sendRate: number;
  throughput: number;
  latency: {
    min: number;
    avg: number;
    max: number;
  };
  date: string | number;
  status: "completed" | "failed" | "running";
}

export interface CaliperInputs {
  functionName: string;
  targetSendRate: number;
  numTransactions: number;
  workers: number;
  contractAddress: string;
}

interface CaliperState {
  lastBenchStatus: "running" | "finished";
  lastBenchmarkInputs: CaliperInputs;
  lastBenchmarkResults: CaliperResults;
  historic: Array<{ inputs: CaliperInputs; results: CaliperResults }>;
}

/* ---------------- STORE ---------------- */

interface AppState {
  project: ProjectState;
  blockchain: BlockchainState;
  contract: ContractState;
  wallet: WalletState;
  caliper: CaliperState;

  setProject: (project: Partial<ProjectState>) => void;
  setBlockchain: (blockchain: Partial<BlockchainState>) => void;
  setContract: (contract: Partial<ContractState>) => void;
  setWallet: (wallet: Partial<WalletState>) => void;
  setCaliper: (caliper: Partial<CaliperState>) => void;

  checkRpcEndpointConnection: () => Promise<void>;
  removeHistoricTest: (index: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      project: {
        name: "",
        description: "",
        category: "",
        tags: [],
      },

      blockchain: {
        chainId: "",
        rpcEndpoint: "",
        rpcEndpointConnected: false,
        wsEndpoint: "",
        metricsEndpoint: "",
        blockTime: 5,
        explorerUrl: "",
      },

      contract: {
        address: "",
        name: "",
        solidityVersion: "",
        abi: null,
      },

      wallet: {
        address: null,
      },

      caliper: {
        lastBenchStatus: 'finished',
        lastBenchmarkInputs: {
          functionName: "",
          targetSendRate: 0,
          numTransactions: 0,
          workers: 0,
          contractAddress: "",
        },
        lastBenchmarkResults: {
          success: 0,
          failures: 0,
          sendRate: 0,
          throughput: 0,
          latency: { min: 0, avg: 0, max: 0 },
          date: Date.now(),
          status: "failed",
        },
        historic: [],
      },

      setProject: (project) =>
        set((state) => ({
          project: { ...state.project, ...project },
        })),

      setBlockchain: (blockchain) => {
        if (blockchain.blockTime && blockchain.blockTime <= 0) blockchain.blockTime = 5;
        blockchain.blockTime = Number(blockchain.blockTime);
        return set((state) => ({
          blockchain: { ...state.blockchain, ...blockchain },
        }));
      },

      setContract: (contract) =>
        set((state) => ({
          contract: { ...state.contract, ...contract },
        })),

      setWallet: (wallet) =>
        set((state) => ({
          wallet: { ...state.wallet, ...wallet },
        })),

      setCaliper: (caliper) =>
        set((state) => ({
          caliper: { ...state.caliper, ...caliper },
        })),

      checkRpcEndpointConnection: async () => {
        const { rpcEndpoint } = get().blockchain;

        if (!rpcEndpoint) {
          set((state) => ({
            blockchain: {
              ...state.blockchain,
              rpcEndpointConnected: false,
            },
          }));
          return;
        }

        try {
          const res = await fetch(rpcEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_blockNumber",
              params: [],
              id: 1,
            }),
          });

          set((state) => ({
            blockchain: {
              ...state.blockchain,
              rpcEndpointConnected: res.ok,
            },
          }));
        } catch {
          set((state) => ({
            blockchain: {
              ...state.blockchain,
              rpcEndpointConnected: false,
            },
          }));
        }
      },
      removeHistoricTest: (index) =>
        set((state) => ({
          caliper: {
            ...state.caliper,
            historic: state.caliper.historic.filter((_, i) => i !== index),
          },
        })),

    }),
    {
      name: "dapp-config",
      partialize: (state) => ({
        project: state.project,
        blockchain: state.blockchain,
        contract: state.contract,
        wallet: state.wallet,
        caliper: state.caliper,
      }),
    }
  )
);