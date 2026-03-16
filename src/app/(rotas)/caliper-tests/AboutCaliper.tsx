'use client';

import { AlertCircle } from "lucide-react";

export default function AboutCaliper() {
    return (
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
            <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                    <h3 className="text-white mb-2">Sobre o Hyperledger Caliper</h3>
                    <p className="text-blue-200 mb-3">
                        Hyperledger Caliper é uma ferramenta de benchmark para medir o desempenho de implementações blockchain.
                    </p>
                    <ul className="space-y-1 text-blue-200">
                        <li>• Configure workloads personalizados para cenários reais</li>
                        <li>• Monitore métricas de performance em tempo real</li>
                        <li>• Exporte relatórios detalhados para análise posterior</li>
                        <li>• Compare resultados entre diferentes configurações</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}