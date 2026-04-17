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
  //chainId: number | string;
  rpcEndpoint: string;
  rpcEndpointConnected: boolean;
  wsEndpoint: string;
  metricsEndpoint: string;
  blockTime: number;
  explorerUrl: string;
}

interface contractHistoryState {
  historic: Array<{ address: string; status: "success" | "failed"; name: string;  date: number }>;
}

interface lastContractDeployState {
  address: string;
  name: string;
  abi: any;
  errorDeploy: any;
  deployResult: any;
  isDeploing: boolean;
  //solidityVersion: string;
  //evmVersion: string;
}

interface WalletState {
  privateKey: string;
  publicKey: string;
}

interface ContractFunctionsState {
  contractAddress: string;
  abiText: string;
  isVerified: boolean;
  functions: Array<{
    key: string;
    name: string;
    type: 'read' | 'write';
    stateMutability: string;
    inputs: { name: string; type: string }[];
    outputs?: { type: string }[];
  }>;
  inputValues: Record<string, string[]>;
  functionResults: Record<string, string>;
  loadingFunction: string | null;
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
  contractName: string;
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
  lastContractDeploy: lastContractDeployState;
  contractHistory: contractHistoryState;
  wallet: WalletState;
  contractFunctions: ContractFunctionsState;
  caliper: CaliperState;

  setProject: (project: Partial<ProjectState>) => void;
  setBlockchain: (blockchain: Partial<BlockchainState>) => void;
  setContract: (lastContractDeploy: Partial<lastContractDeployState>) => void;
  setContractHistory: (contractHistory: Partial<contractHistoryState>) => void;
  addContractHistory: (item: { address: string; status: "success" | "failed"; name: string; date: number }) => void;
  removeContractHistory: (index: number) => void;
  setWallet: (wallet: Partial<WalletState>) => void;
  setContractFunctions: (contractFunctions: Partial<ContractFunctionsState>) => void;
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
        //chainId: "",
        rpcEndpoint: "",
        rpcEndpointConnected: false,
        wsEndpoint: "",
        metricsEndpoint: "",
        blockTime: 5,
        explorerUrl: "",
      },

      contractHistory: {
        historic: [],
      },

      lastContractDeploy: {
        address: "",
        name: "",
        abi: null,
        isDeploing: false,
        errorDeploy: null,
        deployResult: null,
        //solidityVersion: "",
        //evmVersion: "",
      },

      wallet: {
        privateKey: "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
        publicKey: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", 
      },

      contractFunctions: {
        contractAddress: "",
        abiText: "",
        isVerified: false,
        functions: [],
        inputValues: {},
        functionResults: {},
        loadingFunction: null,
      },

      caliper: {
        lastBenchStatus: 'finished',
        lastBenchmarkInputs: {
          contractName: "",
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

      setContract: (lastContractDeploy) =>
        set((state) => ({
          lastContractDeploy: { ...state.lastContractDeploy, ...lastContractDeploy },
        })),
      
      addContractHistory: (item) =>
        set((state) => ({
          contractHistory: {
            ...state.contractHistory,
            historic: [...state.contractHistory.historic, item],
          },
      })),

      removeContractHistory: (index) =>
        set((state) => ({
          contractHistory: {
            ...state.contractHistory,
            historic: state.contractHistory.historic.filter((_, i) => i !== index),
          },
      })),

      setContractHistory: (contractHistory) =>
        set((state) => ({
          contractHistory: { ...state.contractHistory, ...contractHistory },
        })),

      setWallet: (wallet) =>
        set((state) => ({
          wallet: { ...state.wallet, ...wallet },
        })),

      setContractFunctions: (contractFunctions) =>
        set((state) => ({
          contractFunctions: { ...state.contractFunctions, ...contractFunctions },
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
        caliper: state.caliper,
        contractHistory: state.contractHistory,
        contractFunctions: state.contractFunctions,
        //wallet: state.wallet,
        //lastContractDeploy: state.lastContractDeploy,
      }),
    }
  )
);