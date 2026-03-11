'use client'

import { useEffect, useState } from 'react';
import {
  Rocket,
  Play,
} from 'lucide-react';

import Deploy from './Deploy';
import Functions from './Functions';

export default function SmartContracts() {  // Separar componentes depois
  const [activeTab, setActiveTab] = useState<'deploy' | 'test'>('deploy');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Smart Contracts</h2>
        <p className="text-slate-400">Faça deploy e teste seus contratos inteligentes</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'deploy'
              ? 'text-white border-b-2 border-purple-600 bg-slate-800/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
          >
            <Rocket className="w-5 h-5" />
            Deploy de Contrato
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'test'
              ? 'text-white border-b-2 border-purple-600 bg-slate-800/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
          >
            <Play className="w-5 h-5" />
            Testar Funções
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'deploy' ? (
            /* Deploy Tab Content */
            <Deploy />
          ) : (
            /* Test Tab Content */
            <Functions />
          )}
        </div>
      </div>
    </div>
  );
}