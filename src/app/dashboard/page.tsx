"use client";

import { TrendingUp, Users, Activity, DollarSign, ArrowUp, ArrowDown, Zap, Network, Radio, Fuel } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import RpcCalls from './RpcCalls';
import RecentActivities from './RecentActivies';
import { useMetricsStore } from '@/src/store/useMetricsStore';

export default function Dashboard() {
  const { rpcEndpoint } = useAppStore((state) => state.blockchain);

  const values = useMetricsStore((s) => s.values);
  const isMetricsEndpointConnected = useMetricsStore((s) => s.isConnected)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Visão geral do seu dApp</p>
      </div>

      {!isMetricsEndpointConnected ? (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mb-4">
          <p className="text-red-400 font-medium mb-3">
            Não foi possível conectar ao Metrics Endpoint, verifique sua url.
          </p>
          <a
            href="/blockchain"
            className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            Configurar Endpoints
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transações Efetivadas */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white">Transações Efetivadas</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>

            {/* AJUSTAR O COMPONENTE GRAPHIC */}
            <ResponsiveContainer width="100%" height={250}> 
              <LineChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
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
                  dataKey="txCount"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transações Pendentes */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white">Transações Pendentes</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
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
                  dataKey="pending"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ fill: '#eab308', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Peers Conectados */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white">Peers Conectados</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={values}>
                <defs>
                  <linearGradient id="colorPeers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="peers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPeers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gas Utilizado */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white">Gas Utilizado</h3>
                <p className="text-sm text-slate-400">Atualização em tempo real</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={values}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => value.toLocaleString()}
                />
                <Bar dataKey="gasUsed" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}


      {/* Área de Chamadas RPC */}
      <RpcCalls rpcEndpoint={rpcEndpoint} />

      {/* Atividades Recentes */}
      <RecentActivities />
    </div>
  );
}
