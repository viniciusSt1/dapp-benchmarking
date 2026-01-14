'use client'

import { useState } from 'react';
import { ExternalLink, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  hash: string;
  status: 'confirmed' | 'pending' | 'failed';
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: string;
}

const mockTransactions: Transaction[] = [
  {
    hash: '0x8f3e...d2a1',
    status: 'confirmed',
    from: '0x742d...0bEb',
    to: '0x5aA1...c3F4',
    value: '0.5 ETH',
    gasUsed: '21000',
    gasPrice: '25',
    timestamp: '2 min atrás',
  },
  {
    hash: '0x7a2c...b5e9',
    status: 'pending',
    from: '0x742d...0bEb',
    to: '0x9fD8...2a7B',
    value: '1.2 ETH',
    gasUsed: '-',
    gasPrice: '30',
    timestamp: '5 min atrás',
  },
  {
    hash: '0x6d1f...a3c8',
    status: 'confirmed',
    from: '0x5aA1...c3F4',
    to: '0x742d...0bEb',
    value: '2.0 ETH',
    gasUsed: '21000',
    gasPrice: '22',
    timestamp: '1 hora atrás',
  },
  {
    hash: '0x4e9b...f7d2',
    status: 'failed',
    from: '0x742d...0bEb',
    to: '0x3bC5...8e1A',
    value: '0.1 ETH',
    gasUsed: '21000',
    gasPrice: '20',
    timestamp: '3 horas atrás',
  },
];

export default function Transactions() {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');

  const filteredTransactions = filter === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.status === filter);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copiado!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-600/20 text-green-400 border-green-600/30',
      pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      failed: 'bg-red-600/20 text-red-400 border-red-600/30',
    };

    const labels = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      failed: 'Falhou',
    };

    return (
      <span className={`px-3 py-1 rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-2">Transações</h2>
          <p className="text-slate-400">Histórico de todas as transações</p>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2">
          {['all', 'confirmed', 'pending', 'failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'confirmed' ? 'Confirmadas' : f === 'pending' ? 'Pendentes' : 'Falhas'}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 mb-1">Total</p>
          <p className="text-white">{mockTransactions.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 mb-1">Confirmadas</p>
          <p className="text-green-400">
            {mockTransactions.filter(tx => tx.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 mb-1">Pendentes</p>
          <p className="text-yellow-400">
            {mockTransactions.filter(tx => tx.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 mb-1">Falhas</p>
          <p className="text-red-400">
            {mockTransactions.filter(tx => tx.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-slate-400">Hash</th>
                <th className="px-6 py-4 text-left text-slate-400">Status</th>
                <th className="px-6 py-4 text-left text-slate-400">De</th>
                <th className="px-6 py-4 text-left text-slate-400">Para</th>
                <th className="px-6 py-4 text-left text-slate-400">Valor</th>
                <th className="px-6 py-4 text-left text-slate-400">Gas</th>
                <th className="px-6 py-4 text-left text-slate-400">Tempo</th>
                <th className="px-6 py-4 text-left text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransactions.map((tx, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <code className="text-purple-400">{tx.hash}</code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-slate-400">{tx.from}</code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-slate-400">{tx.to}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{tx.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-400">
                      <div>{tx.gasUsed} units</div>
                      <div>{tx.gasPrice} Gwei</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400">{tx.timestamp}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyHash(tx.hash)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Copiar hash"
                      >
                        <Copy className="w-4 h-4 text-slate-400" />
                      </button>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Ver no explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
