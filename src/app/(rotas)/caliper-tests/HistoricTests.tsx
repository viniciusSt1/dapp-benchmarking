'use client';

import { BarChart3, FileText, Trash2 } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";

export default function HistoricTests() {
    const historico = useAppStore((state) => state.caliper.historic);
    const removeHistoricTest = useAppStore((state) => state.removeHistoricTest);

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
                            <th className="text-center text-slate-400 pb-3">Função</th>
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
                            historico.map((test, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="p-4 text-slate-300 text-center">
                                        {new Date(test.results.date).toLocaleString("pt-BR")}
                                    </td>

                                    <td className="p-4 text-purple-400 font-semibold uppercase text-center">
                                        {test.inputs.functionName}
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
                                            <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
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
        </div>
    );
}
