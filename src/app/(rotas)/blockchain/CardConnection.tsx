'use client';

import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

export default function CardConnection({ isConnected, isConnecting, hasChanges, handleUpdate, handleDisconnect, handleConnect }: {
    isConnected: boolean;
    isConnecting: boolean;
    hasChanges: boolean;
    handleUpdate: () => void;
    handleDisconnect: () => void;
    handleConnect: () => void;
}) {


    return (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
                {isConnected ? (
                    <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                            <p className="text-white">Conectado</p>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="w-6 h-6 text-slate-500" />
                        <div>
                            <p className="text-white">Desconectado</p>
                            <p className="text-slate-400">Aguardando conexão</p>
                        </div>
                    </>
                )}
            </div>

            {isConnected ? (
                <div className="flex items-center gap-2">

                    {hasChanges && (
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Atualizar
                        </button>
                    )}

                    <button
                        onClick={handleDisconnect}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Desconectar
                    </button>

                </div>
            ) : (
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isConnecting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {isConnecting ? 'Conectando...' : 'Conectar'}
                </button>
            )}
        </div>
    );
}