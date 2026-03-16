'use client';
import { Play } from "lucide-react";
import { useEffect } from "react";
import { useAppStore } from "@/src/store/useAppStore";

export default function ConfigTests(
    { selectedFunction, setSelectedFunction,
        targetSendRate, setTargetSendRate,
        numTransactions, setNumTransactions,
        workers, setWorkers,
        contractAddress, setContractAddress,
        startBenchmark,
        isRunning }: {
            selectedFunction: string;
            setSelectedFunction: (func: string) => void;
            targetSendRate: string;
            setTargetSendRate: (rate: string) => void;
            numTransactions: string;
            setNumTransactions: (num: string) => void;
            workers: string;
            setWorkers: (num: string) => void;
            contractAddress: string;
            setContractAddress: (addr: string) => void;
            startBenchmark: () => void;
            isRunning: boolean;
        }) {
    const checkRpc = useAppStore((s) => s.checkRpcEndpointConnection)
    const { rpcEndpoint,rpcEndpointConnected, wsEndpoint } = useAppStore((state) => state.blockchain);

    useEffect(() => {
        checkRpc()
    }, [])

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-white mb-4">Configuração do Teste</h3>

            <div className="space-y-4">

                {/* Seleção da função */}
                <div>
                    <label className="text-slate-300 mb-2 block">Selecione a função</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {["open", "query", "transfer"].map(func => (
                            <button
                                key={func}
                                onClick={() => setSelectedFunction(func)}
                                className={`p-4 rounded-lg border transition-colors text-left ${selectedFunction === func
                                    ? "bg-purple-600/20 border-purple-600 text-white"
                                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                                    }`}
                            >
                                <h4 className="text-white capitalize">{func}</h4>
                                <p className="text-sm text-slate-400">
                                    Executa a função <span className="text-purple-400">{func}</span> do contrato.
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inputs do teste */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-slate-300 mb-2 block">Send Rate Alvo (TPS)</label>
                        <input
                            type="number"
                            value={targetSendRate}
                            onChange={(e) => setTargetSendRate(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 mb-2 block">Transações Totais</label>
                        <input
                            type="number"
                            value={numTransactions}
                            onChange={(e) => setNumTransactions(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 mb-2 block">Número de Workers</label>
                        <input
                            type="number"
                            value={workers}
                            onChange={(e) => setWorkers(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Endereço do Contrato */}
                <div className="mb-6">
                    <label className="text-slate-300 mb-2 block">
                        Endereço do Contrato
                    </label>

                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        placeholder="0x1234...ABCD"
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                    />
                </div>

                {/* Botão iniciar */}
                <button
                    onClick={startBenchmark}
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
