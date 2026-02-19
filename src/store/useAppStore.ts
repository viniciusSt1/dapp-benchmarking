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

/* ---------------- STORE ---------------- */

interface AppState {
  project: ProjectState;
  blockchain: BlockchainState;
  contract: ContractState;
  wallet: WalletState;

  setProject: (project: Partial<ProjectState>) => void;
  setBlockchain: (blockchain: Partial<BlockchainState>) => void;
  setContract: (contract: Partial<ContractState>) => void;
  setWallet: (wallet: Partial<WalletState>) => void;
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
    }),
    {
      name: "dapp-config",

      partialize: (state) => ({
        project: state.project,
        blockchain: state.blockchain,
        contract: {
          address: state.contract.address,
          name: state.contract.name,
          solidityVersion: state.contract.solidityVersion,
          abi: state.contract.abi,
        },
        wallet: state.wallet,
      }),

    }
  )
);


// Projeto: nome, descrição, categoria, imagem e tag
// Blockchain: URL_RPC, CHAIN_ID, BLOCK_EXPLORER_URL
// Smart Contract: endereço, .sol, nome, versão solidity ::: useState, abi ::: zustand
// Wallet: endereço
