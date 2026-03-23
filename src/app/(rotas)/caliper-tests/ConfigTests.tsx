'use client';

import ConfigSimple from './ConfigSimple';
import ConfigERC20 from './ConfigERC20';
import ConfigERC721 from './ConfigERC721';
import { Play } from "lucide-react";

import { useState, useRef } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import { useEffect } from 'react';

export default function ConfigTests() {
    const [selectedContract, setSelectedContract] = useState<string>("Simple");

    const checkRpc = useAppStore((s) => s.checkRpcEndpointConnection)
    const { rpcEndpoint, rpcEndpointConnected, wsEndpoint } = useAppStore((state) => state.blockchain);
    const { lastBenchStatus } = useAppStore((state) => state.caliper);

    const isRunning = lastBenchStatus === "running";

    const simpleRef = useRef<any>(null);
    const erc20Ref = useRef<any>(null);
    const erc721Ref = useRef<any>(null);

    useEffect(() => {
        checkRpc()
    }, [])

    async function contractExists(address: string) {
        const res = await fetch("/api/rpc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rpcEndpoint: rpcEndpoint,
                jsonrpc: "2.0",
                method: "eth_getCode",
                params: [address, "latest"],
                id: 1,
            }),
        });

        const data = await res.json();
        return data.result && data.result !== "0x";
    }

    const handleStartBenchmark = () => {
        if (selectedContract === "Simple" && simpleRef.current) {
            simpleRef.current.startBenchmark(contractExists);
        } else if (selectedContract === "ERC20" && erc20Ref.current) {
            erc20Ref.current.startBenchmark(contractExists);
        } else if (selectedContract === "ERC721" && erc721Ref.current) {
            erc721Ref.current.startBenchmark(contractExists);
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800">
            {/* Tabs para seleção de contrato */}
            <div className="flex border-b border-slate-800">
                {["Simple", "ERC20", "ERC721"].map(contract => (
                    <button
                        key={contract}
                        onClick={() => setSelectedContract(contract)}
                        className={`flex-1 px-6 py-4 font-medium transition-colors text-center ${selectedContract === contract
                            ? 'text-white border-b-2 border-purple-600 bg-slate-800/50'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                    >
                        {contract}
                    </button>
                ))}
            </div>

            <div className="p-6 space-y-4">
                <h3 className="text-white mb-4">Configuração do Teste</h3>

                {selectedContract === "Simple" && <ConfigSimple ref={simpleRef} />}
                {selectedContract === "ERC20" && <ConfigERC20 ref={erc20Ref} />}
                {selectedContract === "ERC721" && <ConfigERC721 ref={erc721Ref} />}

                {/* Botão iniciar */}
                <button
                    onClick={handleStartBenchmark}
                    disabled={isRunning || !rpcEndpointConnected || !wsEndpoint}
                    className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isRunning || !rpcEndpointConnected || !wsEndpoint
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                        }`}
                >
                    <Play className="w-5 h-5" />
                    {isRunning ? "Teste em Execução..." : "Iniciar Teste"}
                </button>
                {(!rpcEndpointConnected || !wsEndpoint) && (
                    <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mb-4">
                        <p className="text-red-400 font-medium mb-3">
                            Não foi possível conectar ao {!rpcEndpointConnected ? 'Rpc Endpoint' : 'Ws Endpoint'}, verifique sua url.
                            <i> (  Rpc:{rpcEndpoint}   Ws: {wsEndpoint}  )</i>
                        </p>
                        <a
                            href="/blockchain"
                            className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                        >
                            Configurar Endpoints
                        </a>
                    </div>)}
            </div>
        </div>
    );
}
