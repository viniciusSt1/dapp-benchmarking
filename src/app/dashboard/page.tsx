"use client";

import { TrendingUp, Users, Activity, DollarSign, ArrowUp, ArrowDown, Zap, Network, Radio, Fuel } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/src/store/useAppStore';

export default function Dashboard() {
  const [values, setValues] = useState<any[]>([]);
  const { rpcEndpoint, metricsEndpoint } = useAppStore((state) => state.blockchain);

  const [isMetricsEndpointConnected, setIsMetricsEndpointConnected] = useState(false);

  const [rpcData, setRpcData] = useState<any>(null);
  const [loadingRpc, setLoadingRpc] = useState(false);
  const [rpcError, setRpcError] = useState(false);
  const [hasClickedRpc, setHasClickedRpc] = useState(false);

  async function callRpc(method: string, params: any[] = []) {
    const res = await fetch("/api/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rpcEndpoint,
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    return res.json();
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!metricsEndpoint) {
        setIsMetricsEndpointConnected(false);
        return;
      }

      try {
        const res = await fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metricsUrl: metricsEndpoint,
          }),
        });

        if (!res.ok) throw new Error("Metrics offline");

        setIsMetricsEndpointConnected(true);

        const text = await res.text();
        const metrics = parseMetrics(text); // Certifique-se que existe!

        setValues((prev) => [
          ...prev.slice(-15),
          {
            time: new Date().toLocaleTimeString(),
            peers: metrics['besu_peers_peer_count_by_client{client="Besu"}'],
            gasUsed: metrics["besu_blockchain_chain_head_gas_used"],
            txCount: metrics["besu_blockchain_chain_head_transaction_count"],
            pending: metrics["besu_peers_pending_peer_requests_current"],
          },
        ]);

      } catch (err) {
        console.error("Metrics error:", err);
        setIsMetricsEndpointConnected(false);
      }
    };

    console.log("Dados zustend:", { rpcEndpoint, metricsEndpoint });
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [metricsEndpoint]);

  async function handleRpcCheck() {
    setLoadingRpc(true);
    setHasClickedRpc(true);
    setRpcError(false);

    try {
      if (!rpcEndpoint) {
        throw new Error("RPC Endpoint não configurado");
      }

      const [
        blockNumberRes,
        chainIdRes,
        clientVersionRes,
        peerCountRes,
        pendingTxRes,
        gasPriceRes,
        syncingRes,
        miningRes,
        servicesRes
      ] = await Promise.all([
        callRpc("eth_blockNumber"),
        callRpc("eth_chainId"),
        callRpc("web3_clientVersion"),

        callRpc("net_peerCount"),
        callRpc("txpool_status"),
        callRpc("eth_gasPrice"),
        callRpc("eth_syncing"),
        callRpc("eth_mining"),

        callRpc("net_services"),
      ]);

      const serviceNames = Object.keys(servicesRes.result);

      const finalData = {
        blockNumber: parseInt(blockNumberRes.result, 16),
        chainId: parseInt(chainIdRes.result, 16),
        clientVersion: clientVersionRes.result,

        networkServices: serviceNames, // <- já formatado p/ UI

        debugMetrics: {
          peerCount: parseInt(peerCountRes.result, 16),
          pendingTransactions: pendingTxRes?.result?.pending || 0,
          gasPrice: gasPriceRes.result,
          syncing: syncingRes.result !== false,
          mining: miningRes.result,
        },
      };

      setRpcData(finalData);

    } catch (e) {
      console.log(e);
      setRpcError(true);
    }

    setLoadingRpc(false);
  }

  function parseMetrics(text: string) {
    const lines = text.split("\n");
    const data: Record<string, number> = {};

    for (const line of lines) {
      if (line.startsWith("#") || !line.trim()) continue;

      // Separar key e value mesmo com labels { ... }
      const parts = line.trim().split(/\s+/);
      const key = parts[0];
      const value = Number(parts[1]);

      if (key && !isNaN(value)) {
        data[key] = value;
      }
    }

    return data;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Visão geral do seu dApp</p>
      </div>

      {!isMetricsEndpointConnected ? (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mb-4">
          <p className="text-red-400 font-medium mb-3">
            Não foi possível conectar ao Metrics Endpoint, verifique sua url.
          </p>
          <a
            href="/blockchain"
            className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            Configurar Endpoints
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transações Efetivadas */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white">Transações Efetivadas</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="txCount"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transações Pendentes */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white">Transações Pendentes</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ fill: '#eab308', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Peers Conectados */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white">Peers Conectados</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={values}>
                <defs>
                  <linearGradient id="colorPeers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="peers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPeers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gas Utilizado */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white">Gas Utilizado</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => value.toLocaleString()}
                />
                <Bar dataKey="gasUsed" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráficos em Tempo Real */}


      {/* Área de Chamadas RPC */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white">Chamadas RPC</h3>
            <p className="text-sm text-slate-400">Verificar informações da rede blockchain</p>
          </div>
        </div>

        <button
          onClick={handleRpcCheck}
          disabled={loadingRpc}
          className="mb-6 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loadingRpc ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Radio className="w-4 h-4 mr-2" />
              Verificar Rede
            </>
          )}
        </button>

        {hasClickedRpc && rpcError && (
          <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mt-4">
            <p className="text-red-400 font-medium mb-3">Não foi possível verificar o RPC Endpoint, verifique sua url</p>
            <a
              href="/blockchain"
              className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              Configurar RPC
            </a>
          </div>
        )}


        {rpcData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantidade de Blocos */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Quantidade de Blocos</p>
              <p className="text-white text-xl font-mono">{rpcData.blockNumber.toLocaleString()}</p>
            </div>

            {/* Chain ID */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Chain ID</p>
              <p className="text-white text-xl font-mono">{rpcData.chainId}</p>
            </div>

            {/* Client Version */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 md:col-span-2">
              <p className="text-slate-400 text-sm mb-1">Client Version</p>
              <p className="text-white font-mono text-sm break-all">{rpcData.clientVersion}</p>
            </div>

            {/* Serviços da Rede */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Serviços da Rede</p>
              <div className="flex flex-wrap gap-2">
                {rpcData.networkServices.map((service: string) => (
                  <span key={service} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm border border-cyan-600/30">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Debug Metrics */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-3">Debug Metrics</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Peer Count:</span>
                  <span className="text-white font-mono">{rpcData.debugMetrics.peerCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Pending TX:</span>
                  <span className="text-white font-mono">{rpcData.debugMetrics.pendingTransactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Gas Price:</span>
                  <span className="text-white font-mono text-xs break-all">{rpcData.debugMetrics.gasPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Syncing:</span>
                  <span className={`font-mono ${rpcData.debugMetrics.syncing ? 'text-yellow-400' : 'text-green-400'}`}>
                    {rpcData.debugMetrics.syncing ? 'true' : 'false'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Mining:</span>
                  <span className={`font-mono ${rpcData.debugMetrics.mining ? 'text-green-400' : 'text-slate-400'}`}>
                    {rpcData.debugMetrics.mining ? 'true' : 'false'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Atividades Recentes */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Atividades Recentes (apenas frontend no momento aqui, fazer depois)</h3>
        <div className="space-y-4">
          {[
            { action: 'Deploy de Contrato', time: '2 min atrás', status: 'success' },
            { action: 'Transação Confirmada', time: '15 min atrás', status: 'success' },
            { action: 'Carteira Conectada', time: '1 hora atrás', status: 'info' },
            { action: 'Falha na Transação', time: '2 horas atrás', status: 'error' },
            { action: 'Verificação de Contrato', time: '3 horas atrás', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                <span className="text-white">{activity.action}</span>
              </div>
              <span className="text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
