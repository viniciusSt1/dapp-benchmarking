"use client";

import { TrendingUp, Users, Activity, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const transactionData = [
  { name: 'Seg', value: 120 },
  { name: 'Ter', value: 190 },
  { name: 'Qua', value: 150 },
  { name: 'Qui', value: 220 },
  { name: 'Sex', value: 280 },
  { name: 'Sáb', value: 240 },
  { name: 'Dom', value: 180 },
];

const volumeData = [
  { name: 'Jan', volume: 4500 },
  { name: 'Fev', volume: 5200 },
  { name: 'Mar', volume: 4800 },
  { name: 'Abr', volume: 6100 },
  { name: 'Mai', volume: 7300 },
  { name: 'Jun', volume: 8200 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8">
      <div>
        <h2 className="text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Visão geral do seu dApp</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span>12.5%</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">Total de Transações</p>
          <p className="text-white">8,543</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span>8.2%</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">Usuários Ativos</p>
          <p className="text-white">2,341</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span>15.3%</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">Volume Total</p>
          <p className="text-white">$2.5M</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-orange-600/5 border border-orange-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <ArrowDown className="w-4 h-4" />
              <span>3.1%</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">TVL (Total Value Locked)</p>
          <p className="text-white">$18.2M</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white mb-4">Transações (Últimos 7 dias)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white mb-4">Volume (ETH)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {[
            { action: 'Deploy de Contrato', time: '2 min atrás', status: 'success' },
            { action: 'Transação Confirmada', time: '15 min atrás', status: 'success' },
            { action: 'Carteira Conectada', time: '1 hora atrás', status: 'info' },
            { action: 'Falha na Transação', time: '2 horas atrás', status: 'error' },
            { action: 'Verificação de Contrato', time: '3 horas atrás', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <span className="text-white">{activity.action}</span>
              </div>
              <span className="text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
