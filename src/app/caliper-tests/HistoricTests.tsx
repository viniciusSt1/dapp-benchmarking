'use client';

import { BarChart3, FileText } from "lucide-react";
import { useState } from "react";

export default function HistoricTests() {
    // Histórico --> Dados sintéticos para demonstração
    const [testHistory, setTestHistory] = useState([
        {
            date: "2024-02-01 14:22",
            functionName: "transfer",
            tps: 41.2,
            latency: 37.1,
            success: 96,
            status: "completed"
        },
        {
            date: "2024-02-01 13:10",
            functionName: "query",
            tps: 52.5,
            latency: 22.8,
            success: 100,
            status: "completed"
        }
    ]);

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

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-white">Histórico de Testes</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left text-slate-400 pb-3">Data/Hora</th>
                            <th className="text-left text-slate-400 pb-3">Função</th>
                            <th className="text-left text-slate-400 pb-3">TPS</th>
                            <th className="text-left text-slate-400 pb-3">Latência (ms)</th>
                            <th className="text-left text-slate-400 pb-3">Sucesso (%)</th>
                            <th className="text-left text-slate-400 pb-3">Status</th>
                            <th className="text-left text-slate-400 pb-3">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {testHistory.map((test, index) => (
                            <tr
                                key={index}
                                className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="py-4 text-slate-300">{test.date}</td>
                                <td className="py-4 text-purple-400 font-semibold uppercase">{test.functionName}</td>
                                <td className="py-4 text-white">{test.tps.toFixed(1)}</td>
                                <td className="py-4 text-white">{test.latency.toFixed(1)}</td>
                                <td className="py-4">{test.success}%</td>
                                <td className="py-4">{getStatusBadge(test.status)}</td>
                                <td className="py-4">
                                    <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}