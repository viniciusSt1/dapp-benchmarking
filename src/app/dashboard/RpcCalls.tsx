'use client';

import { Radio, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RpcCalls({ rpcEndpoint }: { rpcEndpoint: string }) {
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

    return (
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
                    <Link
                        href="/blockchain"
                        className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                    >
                        Configurar RPC
                    </Link>
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
    )
}