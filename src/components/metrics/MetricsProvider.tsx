"use client";

import { useEffect } from "react";
import { useMetricsStore } from "@/src/store/useMetricsStore";
import { useAppStore } from "@/src/store/useAppStore";

export default function MetricsProvider({ children }: { children: React.ReactNode }) {
  const addMetric = useMetricsStore((s) => s.addMetric);
  const setConnected = useMetricsStore((s) => s.setConnected);
  const {metricsEndpoint, blockTime} = useAppStore((s) => s.blockchain);

  useEffect(() => {
    if (!metricsEndpoint) return;

    async function fetchMetrics() { // Atualmente rodando sempre idependente se conexão estabelecida. Para evitar tentativas inúteis mudar a lógica para rodar somente quando desejado
      try {
        const res = await fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metricsUrl: metricsEndpoint }),
        });

        if (!res.ok) throw new Error("Metrics offline");

        const text = await res.text();
        const metrics = parseMetrics(text);
        
        if ( 
          metrics['besu_peers_peer_count_by_client{client="Besu"}'] || 
          metrics["besu_blockchain_chain_head_gas_used"] || 
          metrics["besu_blockchain_chain_head_transaction_count"] ||
          metrics["besu_peers_pending_peer_requests_current"]
        ){
          setConnected(true);
          addMetric({
            time: new Date().toLocaleTimeString(),
            peers: metrics['besu_peers_peer_count_by_client{client="Besu"}'],
            gasUsed: metrics["besu_blockchain_chain_head_gas_used"],
            txCount: metrics["besu_blockchain_chain_head_transaction_count"],
            pending: metrics["besu_peers_pending_peer_requests_current"],
          });
        } else 
          throw new Error("Dados não obtidos corretamente");

      } catch (err) {
        setConnected(false);
        console.log("Metrics error:", err);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, blockTime * 1000);

    return () => clearInterval(interval);
  }, [metricsEndpoint, blockTime]);

  return <>{children}</>;
}

function parseMetrics(text: string) {
  const lines = text.split("\n");
  const data: Record<string, number> = {};

  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;

    const parts = line.trim().split(/\s+/);
    const key = parts[0];
    const value = Number(parts[1]);

    if (key && !isNaN(value)) {
      data[key] = value;
    }
  }

  return data;
}