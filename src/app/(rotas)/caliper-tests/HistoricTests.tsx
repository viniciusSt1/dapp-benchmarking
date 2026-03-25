'use client';

import { BarChart3, FileText, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/src/store/useAppStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";

export default function HistoricTests() {
    const historico = useAppStore((state) => state.caliper.historic);
    const removeHistoricTest = useAppStore((state) => state.removeHistoricTest);
    const [selectedTest, setSelectedTest] = useState<{ inputs: any; results: any } | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full">
                        Concluído
                    </span>
                );
            case 'running':
                return (
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        Em execução
                    </span>
                );
            case 'failed':
                return (
                    <span className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full">
                        Falhou
                    </span>
                );
            default:
                return null;
        }
    };

    const handleDelete = (index: number) => {
        if (confirm("Deseja excluir este teste do histórico?")) {
            removeHistoricTest(index);
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-white">Histórico de Testes</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-center text-slate-400 pb-3">Data/Hora</th>
                            <th className="text-center text-slate-400 pb-3">Contrato/Função</th>
                            <th className="text-center text-slate-400 pb-3">Send Rate</th>
                            <th className="text-center text-slate-400 pb-3">Throughput</th>
                            <th className="text-center text-slate-400 pb-3">Latência (ms)</th>
                            <th className="text-center text-slate-400 pb-3">Sucesso (%)</th>
                            <th className="text-center text-slate-400 pb-3">Status</th>
                            <th className="text-center text-slate-400 pb-3" colSpan={2}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {historico.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-slate-500">
                                    Nenhum teste executado ainda
                                </td>
                            </tr>
                        ) : (
                            [...historico].reverse().map((test, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="p-4 text-slate-300 text-center">
                                        {new Date(test.results.date).toLocaleString("pt-BR")}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="text-purple-400 font-semibold uppercase">{test.inputs.contractName} /</div>
                                        <div className="text-blue-400 font-semibold uppercase text-[15px]">{test.inputs.functionName}</div>
                                    </td>

                                    <td className="p-4 text-white text-center">
                                        {test.results.throughput} tx/s
                                    </td>

                                    <td className="p-4 text-white text-center">
                                        {test.results.sendRate} tx/s
                                    </td>

                                    <td className="p-4 text-white text-center">
                                        {test.results.latency.avg}
                                    </td>

                                    <td className="p-4 text-white text-center">
                                        {(
                                            (test.results.success * 100) /
                                            (test.results.success + test.results.failures)
                                        ).toFixed(2)}
                                        %
                                    </td>

                                    <td className="p-4 text-center">
                                        {getStatusBadge(test.results.status)}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                                                onClick={() => setSelectedTest(test)}
                                            >
                                                <FileText className="w-4 h-4" />
                                                Detalhes
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                                onClick={() => handleDelete(index)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-white !max-w-4xl !w-full !p-12">

                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Detalhes do Benchmark
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTest && (
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] mt-4">

                            {/* INPUTS */}
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-4">Inputs</h3>

                                <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
                                    <span className="text-slate-400">Contrato</span>
                                    <span className="text-white">{selectedTest.inputs.contractName}</span>

                                    <span className="text-slate-400">Função</span>
                                    <span className="text-white">{selectedTest.inputs.functionName}</span>

                                    <span className="text-slate-400">Send Rate</span>
                                    <span className="text-white">{selectedTest.inputs.targetSendRate}</span>

                                    <span className="text-slate-400">Transações</span>
                                    <span className="text-white">{selectedTest.inputs.numTransactions}</span>

                                    <span className="text-slate-400">Workers</span>
                                    <span className="text-white">{selectedTest.inputs.workers}</span>

                                    <span className="text-slate-400">Address</span>
                                    <span className="text-white break-all">
                                        {selectedTest.inputs.contractAddress}
                                    </span>
                                </div>
                            </div>

                            {/* RESULTS */}
                            <div>
                                <h3 className="text-blue-400 font-semibold mb-4">Resultados</h3>

                                <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
                                    <span className="text-slate-400">Status</span>
                                    <span>{getStatusBadge(selectedTest.results.status)}</span>

                                    <span className="text-slate-400">Throughput</span>
                                    <span className="text-white">
                                        {selectedTest.results.throughput} tx/s
                                    </span>

                                    <span className="text-slate-400">Send Rate Atingido</span>
                                    <span className="text-white">
                                        {selectedTest.results.sendRate} tx/s
                                    </span>

                                    <span className="text-slate-400">Latência Avg</span>
                                    <span className="text-white">
                                        {selectedTest.results.latency.avg}
                                    </span>

                                    <span className="text-slate-400">Latência Min</span>
                                    <span className="text-white">
                                        {selectedTest.results.latency.min}
                                    </span>

                                    <span className="text-slate-400">Latência Max</span>
                                    <span className="text-white">
                                        {selectedTest.results.latency.max}
                                    </span>
                                </div>
                            </div>

                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>

    );
}
