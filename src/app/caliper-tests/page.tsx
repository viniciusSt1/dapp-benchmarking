'use client';

import { useState } from 'react';
import { 
  Activity, 
  Play, 
  Square, 
  FileText, 
  TrendingUp, 
  Clock, 
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  BarChart3
} from 'lucide-react';

export default function CaliperTesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedWorkload, setSelectedWorkload] = useState('createAsset');

  const workloads = [
    { 
      id: 'createAsset', 
      name: 'Criar Ativos', 
      description: 'Teste de criação de novos ativos na blockchain',
      txCount: 1000 
    },
    { 
      id: 'transferAsset', 
      name: 'Transferir Ativos', 
      description: 'Teste de transferência de ativos entre contas',
      txCount: 500 
    },
    { 
      id: 'queryAsset', 
      name: 'Consultar Ativos', 
      description: 'Teste de consultas de dados (operações de leitura)',
      txCount: 2000 
    },
    { 
      id: 'mixedWorkload', 
      name: 'Carga Mista', 
      description: 'Combinação de operações de leitura e escrita',
      txCount: 1500 
    },
  ];

  const testResults = [
    {
      name: 'Throughput (TPS)',
      value: '245.3',
      unit: 'tx/s',
      status: 'success',
      target: '200+',
    },
    {
      name: 'Latência Média',
      value: '1.24',
      unit: 's',
      status: 'success',
      target: '< 2s',
    },
    {
      name: 'Taxa de Sucesso',
      value: '99.8',
      unit: '%',
      status: 'success',
      target: '> 99%',
    },
    {
      name: 'Latência Máxima',
      value: '3.87',
      unit: 's',
      status: 'warning',
      target: '< 3s',
    },
  ];

  const testHistory = [
    {
      date: '18/01/2026 14:32',
      workload: 'Criar Ativos',
      tps: 245.3,
      latency: 1.24,
      success: 99.8,
      status: 'completed',
    },
    {
      date: '18/01/2026 13:15',
      workload: 'Transferir Ativos',
      tps: 198.7,
      latency: 1.52,
      success: 99.9,
      status: 'completed',
    },
    {
      date: '18/01/2026 11:45',
      workload: 'Consultar Ativos',
      tps: 512.4,
      latency: 0.48,
      success: 100,
      status: 'completed',
    },
    {
      date: '17/01/2026 16:20',
      workload: 'Carga Mista',
      tps: 0,
      latency: 0,
      success: 0,
      status: 'failed',
    },
  ];

  const handleStartTest = () => {
    setIsRunning(true);
    // Simular término do teste após 5 segundos
    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

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
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Testes Hyperledger Caliper</h2>
        <p className="text-slate-400">
          Execute e monitore testes de performance da sua blockchain
        </p>
      </div>

      {/* Status do Teste em Execução */}
      {isRunning && (
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white mb-1">Teste em Execução</h3>
                <p className="text-blue-200">
                  Executando workload: {workloads.find(w => w.id === selectedWorkload)?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRunning(false)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              Parar Teste
            </button>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Progresso</span>
              <span className="text-blue-300">342 / 1000 transações</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '34%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Configuração de Teste */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Configuração do Teste</h3>
        
        <div className="space-y-4">
          {/* Seleção de Workload */}
          <div>
            <label className="text-slate-300 mb-2 block">
              Selecione o Workload
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workloads.map((workload) => (
                <button
                  key={workload.id}
                  onClick={() => setSelectedWorkload(workload.id)}
                  className={`p-4 rounded-lg border transition-colors text-left ${
                    selectedWorkload === workload.id
                      ? 'bg-purple-600/20 border-purple-600 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={selectedWorkload === workload.id ? 'text-white' : 'text-slate-200'}>
                      {workload.name}
                    </h4>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                      {workload.txCount} tx
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{workload.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Parâmetros do Teste */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 mb-2 block">
                Taxa de Envio (TPS)
              </label>
              <input
                type="number"
                defaultValue={50}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 mb-2 block">
                Número de Workers
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 mb-2 block">
                Duração (segundos)
              </label>
              <input
                type="number"
                defaultValue={60}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Botão Iniciar Teste */}
          <button
            onClick={handleStartTest}
            disabled={isRunning}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Teste em Execução...' : 'Iniciar Teste'}
          </button>
        </div>
      </div>

      {/* Resultados do Último Teste */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Resultados do Último Teste</h3>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-slate-400">{result.name}</p>
                {getStatusIcon(result.status)}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white text-2xl">{result.value}</span>
                <span className="text-slate-400">{result.unit}</span>
              </div>
              <p className="text-slate-500 text-sm">Alvo: {result.target}</p>
            </div>
          ))}
        </div>

        {/* Métricas Adicionais */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Throughput Mínimo</span>
            </div>
            <p className="text-white text-xl">187.5 tx/s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Throughput Máximo</span>
            </div>
            <p className="text-white text-xl">312.8 tx/s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300">Duração Total</span>
            </div>
            <p className="text-white text-xl">4.08 s</p>
          </div>
        </div>
      </div>

      {/* Histórico de Testes */}
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
                <th className="text-left text-slate-400 pb-3">Workload</th>
                <th className="text-left text-slate-400 pb-3">TPS</th>
                <th className="text-left text-slate-400 pb-3">Latência (s)</th>
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
                  <td className="py-4 text-white">{test.workload}</td>
                  <td className="py-4 text-white">
                    {test.status === 'completed' ? test.tps.toFixed(1) : '-'}
                  </td>
                  <td className="py-4 text-white">
                    {test.status === 'completed' ? test.latency.toFixed(2) : '-'}
                  </td>
                  <td className="py-4">
                    <span className={test.success >= 99 ? 'text-green-400' : 'text-yellow-400'}>
                      {test.status === 'completed' ? `${test.success}%` : '-'}
                    </span>
                  </td>
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

      {/* Informações sobre Caliper */}
      <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-white mb-2">Sobre o Hyperledger Caliper</h3>
            <p className="text-blue-200 mb-3">
              Hyperledger Caliper é uma ferramenta de benchmark para medir o desempenho de implementações blockchain.
              Ele permite testar throughput, latência, e utilização de recursos.
            </p>
            <ul className="space-y-1 text-blue-200">
              <li>• Configure workloads personalizados para simular cenários reais</li>
              <li>• Monitore métricas de performance em tempo real</li>
              <li>• Exporte relatórios detalhados para análise posterior</li>
              <li>• Compare resultados entre diferentes configurações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
