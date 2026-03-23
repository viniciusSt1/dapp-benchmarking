'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useAppStore } from "@/src/store/useAppStore";

const ConfigERC20 = forwardRef((props, ref) => {
    const [targetSendRate, setTargetSendRate] = useState<string>("100");
    const [numTransactions, setNumTransactions] = useState<string>("1000");
    const [workers, setWorkers] = useState<string>("1");
    const [contractAddress, setContractAddress] = useState<string>("");

    const setCaliper = useAppStore((state) => state.setCaliper);
    const { wsEndpoint } = useAppStore((state) => state.blockchain);

    const { lastBenchmarkInputs } = useAppStore((state) => state.caliper);

    useEffect(() => {
        setTargetSendRate(lastBenchmarkInputs.targetSendRate.toString());
        setNumTransactions(lastBenchmarkInputs.numTransactions.toString());
        setWorkers(lastBenchmarkInputs.workers.toString());
        if (lastBenchmarkInputs.contractName === "ERC20")
            setContractAddress(lastBenchmarkInputs.contractAddress);
    }, [])

    async function getResult() {
        try {
            const response = await fetch('/api/benchmark/start', { method: 'GET' });
            const data = await response.json();

            if (!data.result) throw new Error("Resultados não encontrados");

            const currentState = useAppStore.getState();
            setCaliper({
                lastBenchStatus: "finished",
                lastBenchmarkResults: data.result,
                historic: [
                    ...currentState.caliper.historic,
                    {
                        inputs: currentState.caliper.lastBenchmarkInputs,
                        results: data.result
                    }
                ]
            });
        } catch (err) {
            console.log("Erro ao obter resultados:", err);
            const currentState = useAppStore.getState();
            setCaliper({
                lastBenchStatus: "finished",
                lastBenchmarkResults: {
                    success: 0,
                    failures: 0,
                    sendRate: 0,
                    throughput: 0,
                    latency: { min: 0, avg: 0, max: 0 },
                    date: Date.now(),
                    status: "failed",
                },
                historic: [
                    ...currentState.caliper.historic,
                    {
                        inputs: currentState.caliper.lastBenchmarkInputs,
                        results: {
                            success: 0,
                            failures: 0,
                            sendRate: 0,
                            throughput: 0,
                            latency: { min: 0, avg: 0, max: 0 },
                            date: Date.now(),
                            status: "failed",
                        }
                    }
                ]
            });
        }
    }

    async function startBenchmark(contractExists: (address: string) => Promise<boolean>) {
        if (targetSendRate == '' || Number(targetSendRate) <= 0) {
            alert("O Send Rate Alvo deve ser maior que 0");
            return;
        }

        if (numTransactions == '' || Number(numTransactions) <= 0) {
            alert("O número de transações deve ser maior que 0");
            return;
        }

        if (workers == '' || Number(workers) <= 0) {
            alert("O número de workers deve ser maior que 0");
            return;
        }

        const exists = await contractExists(contractAddress);
        if (!exists) {
            alert("O endereço informado não possui contrato deployado na rede.");
            return;
        }

        const currentState = useAppStore.getState();
        setCaliper({
            lastBenchmarkInputs: {
                contractName: "ERC20",
                functionName: "transfer",
                targetSendRate: Number(targetSendRate),
                numTransactions: Number(numTransactions),
                workers: Number(workers),
                contractAddress,
            },
            lastBenchStatus: "running",
        });

        try {
            const res = await fetch('/api/benchmark/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractName: "MyERC20",
                    functionName: "transfer",
                    targetSendRate: Number(targetSendRate),
                    numTransactions: Number(numTransactions),
                    workers: Number(workers),
                    contractAddress,
                    wsEndpoint: wsEndpoint
                })
            });

            if (!res.ok) {
                throw new Error("Erro no servidor: " + res.status);
            }

            const data = await res.json();
            console.log("Benchmark finalizado:", data);
        } catch (err) {
            console.log("Erro ao iniciar benchmark:", err);
        } finally {
            await getResult();
        }
    }

    useImperativeHandle(ref, () => ({
        startBenchmark
    }));

    return (
        <div className="space-y-4">
            {/* Função selecionada */}
            <div>
                <label className="text-slate-300 mb-2 block">Função Selecionada</label>
                <div className="p-4 rounded-lg border bg-purple-600/20 border-purple-600 text-white">
                    <h4 className="text-white">Transfer</h4>
                    <p className="text-sm text-slate-400">
                        Executa a função <span className="text-purple-400">transfer</span> do contrato ERC20.
                    </p>
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
        </div>
    );
});

ConfigERC20.displayName = 'ConfigERC20';

export default ConfigERC20;
