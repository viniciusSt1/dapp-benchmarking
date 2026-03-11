import { create } from "zustand";

interface Metric {
  time: string;
  peers: number;
  gasUsed: number;
  txCount: number;
  pending: number;
}

interface MetricsState {
  values: Metric[];
  isConnected: boolean;

  addMetric: (metric: Metric) => void;
  setConnected: (status: boolean) => void;
  clear: () => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  values: [],
  isConnected: false,

  addMetric: (metric) =>
    set((state) => ({
      values: [...state.values.slice(-15), metric],
    })),

  setConnected: (status) =>
    set({
      isConnected: status,
    }),

  clear: () =>
    set({
      values: [],
      isConnected: false,
    }),
}));