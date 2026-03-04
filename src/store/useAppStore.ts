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
  wsEndpoint: string;
  metricsEndpoint: string;
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

interface CaliperResults {
  success:number;
  failures: number;  
  sendRate: number;
  throughput: number;
  latency: {
    min: number;
    avg: number;
    max: number;
  };
}

interface CaliperInputs {
  functionName: string;
  targetSendRate: number;
  numTransactions: number;
  workers: number;
  contractAddress: string;
}

interface CaliperState {
  status: "idle" | "running" | "finished";
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
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      project: {
        name: "",
        description: "",
        category: "",
        tags: [],
      },

      blockchain: {
        chainId: "",
        rpcEndpoint: "",
        wsEndpoint: "",
        metricsEndpoint: "",
        explorerUrl: "",
      },

      contract: {
        address: "",
        name: "", // sem uso no momento, pode ser fixo ou removido depois
        solidityVersion: "", // sem uso no momento, pode ser fixo ou removido depois
        abi: null,
      },

      wallet: {
        address: null,
      },

      caliper: {
        status: "idle",
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
          latency: {
            min: 0,
            avg: 0,
            max: 0,
          },
        },
        historic: [],
      },

      setProject: (project) =>
        set((state) => ({
          project: { ...state.project, ...project },
        })),

      setBlockchain: (blockchain) =>
        set((state) => ({
          blockchain: { ...state.blockchain, ...blockchain },
        })),

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
    }),
    {
      name: "dapp-config",

      partialize: (state) => ({
        project: state.project,
        blockchain: state.blockchain,
        contract: state.contract,
        wallet: state.wallet,
      }),

    }
  )
);


// Projeto: nome, descrição, categoria, imagem e tag
// Blockchain: URL_RPC, CHAIN_ID, BLOCK_EXPLORER_URL
// Smart Contract: endereço, .sol, nome, versão solidity ::: useState, abi ::: zustand
// Wallet: endereço
