'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useAppStore } from "@/src/store/useAppStore";
import { CaliperResults } from "@/src/store/useAppStore";

const ConfigERC721 = forwardRef((props, ref) => {
    const [targetSendRateTransfer, setTargetSendRateTransfer] = useState<string>("10");
    const [targetSendRateMint, setTargetSendRateMint] = useState<string>("10");
    const [numTransactions, setNumTransactions] = useState<string>("50");
    const [workers, setWorkers] = useState<string>("1");
    const [contractAddress, setContractAddress] = useState<string>("");

    const setCaliper = useAppStore((state) => state.setCaliper);
    const { wsEndpoint } = useAppStore((state) => state.blockchain);

    const { lastBenchmarkInputs } = useAppStore((state) => state.caliper);

    useEffect(() => {
        if (lastBenchmarkInputs.contractName == "ERC721") {
            setTargetSendRateMint(lastBenchmarkInputs.targetSendRate.toString());
            setTargetSendRateTransfer(lastBenchmarkInputs.targetSendRate.toString());
            setNumTransactions(lastBenchmarkInputs.numTransactions.toString());
            setWorkers(lastBenchmarkInputs.workers.toString());
            setContractAddress(lastBenchmarkInputs.contractAddress);
        }
    }, [lastBenchmarkInputs]);

    async function getResult(inputsMint: any, inputsTransfer: any) {    // AJUSTAR PARA ERC721
        try {
            const response = await fetch('/api/benchmark/finish/ERC721', { method: 'GET' });
            const data = await response.json();

            if (!data.result) throw new Error("Resultados não encontrados");

            const currentState = useAppStore.getState();
            setCaliper({
                lastBenchStatus: "finished",
                lastBenchmarkResults: data.result.transferfrom,
                historic: [
                    ...currentState.caliper.historic,
                    {
                        inputs: inputsMint,
                        results: data.result.mint
                    },
                    {
                        inputs: inputsTransfer,
                        results: data.result.transferfrom
                    }
                ]
            });
        } catch (err) {
            console.log("Erro ao obter resultados:", err);
            const currentState = useAppStore.getState();

            const failedResults : CaliperResults = {
                success: 0,
                failures: 0,
                sendRate: 0,
                throughput: 0,
                latency: { min: 0, avg: 0, max: 0 },
                date: Date.now(),
                status: "failed",
            }

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
                        inputs: inputsMint,
                        results: failedResults
                    },
                    {
                        inputs: inputsTransfer,
                        results: failedResults
                    },
                ]
            });
        }
    }

    async function startBenchmark(contractExists: (address: string) => Promise<boolean>) { // AJUSTAR PARA ERC721
        if (targetSendRateMint == '' || Number(targetSendRateMint) <= 0) {
            alert("O Send Rate Alvo para o mint deve ser maior que 0");
            return;
        }

        if (targetSendRateTransfer == '' || Number(targetSendRateTransfer) <= 0) {
            alert("O Send Rate Alvo para o transferFrom deve ser maior que 0");
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

        const inputsMint = {
            contractName: "ERC721",
            functionName: "mint",
            targetSendRate: Number(targetSendRateMint),
            numTransactions: Number(numTransactions),
            workers: Number(workers),
            contractAddress,
        }

        const inputsTransfer = {
            contractName: "ERC721",
            functionName: "transferFrom",
            targetSendRate: Number(targetSendRateTransfer),
            numTransactions: Number(numTransactions),
            workers: Number(workers),
            contractAddress,
        }

        setCaliper({
            lastBenchmarkInputs: inputsTransfer,
            lastBenchStatus: "running",
        });

        try {
            const res = await fetch('/api/benchmark/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractName: "MyERC721",
                    functionName: "transferFrom,mint",
                    targetSendRateMint: Number(targetSendRateMint),
                    targetSendRateTransfer: Number(targetSendRateTransfer),
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
            await getResult(inputsMint, inputsTransfer);
        }
    }

    useImperativeHandle(ref, () => ({
        startBenchmark
    }));

    return (
        <div className="space-y-4">
            {/* Funções selecionadas */}
            <div>
                <label className="text-slate-300 mb-2 block">Funções Selecionadas</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg border bg-purple-600/20 border-purple-600 text-white">
                        <h4 className="text-white">TransferFrom</h4>
                        <p className="text-sm text-slate-400">
                            Executa a função <span className="text-purple-400">transferFrom</span> do contrato ERC721.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-purple-600/20 border-purple-600 text-white">
                        <h4 className="text-white">Mint</h4>
                        <p className="text-sm text-slate-400">
                            Executa a função <span className="text-purple-400">mint</span> do contrato ERC721.
                        </p>
                    </div>
                </div>
            </div>

            {/* Inputs para ERC721 */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-slate-300 mb-2 block">TPS Alvo pro Transfer</label>
                        <input
                            type="number"
                            value={targetSendRateTransfer}
                            onChange={(e) => setTargetSendRateTransfer(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-slate-300 mb-2 block">TPS Alvo pro Mint</label>
                        <input
                            type="number"
                            value={targetSendRateMint}
                            onChange={(e) => setTargetSendRateMint(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

ConfigERC721.displayName = 'ConfigERC721';

export default ConfigERC721;
