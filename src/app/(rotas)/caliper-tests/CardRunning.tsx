'use client';
import { Activity, Square } from "lucide-react";

export default function CardRunning({isRunning, functionExecuting, progress, numTransactions} : {
    isRunning: boolean;
    functionExecuting: string;
    progress: number;
    numTransactions: number;
}) {
    return (
        isRunning && (
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-white mb-1">Teste em Execução</h3>
                            <p className="text-blue-200">
                                Função: <span className="text-purple-400 uppercase">{functionExecuting}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Square className="w-5 h-5" />
                        Parar Teste
                    </button>
                </div>

                {/* Barra de progresso */}
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Progresso</span>
                        <span className="text-blue-300">{progress} / {numTransactions} transações</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                            style={{ width: `${(progress / numTransactions) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        )
    );
}