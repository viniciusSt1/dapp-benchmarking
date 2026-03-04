'use client';

import { useEffect, useState } from 'react';
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
  BarChart3,
  CheckCircle,
  Gauge,
  Timer,
} from 'lucide-react';

import ResultCard from './ResultCard';
import { useAppStore } from '@/src/store/useAppStore';

export default function CaliperTesting() {
  const caliper = useAppStore((state) => state.caliper);
  const setCaliper = useAppStore((state) => state.setCaliper);

  const [isRunning, setIsRunning] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState("open");
  const [contractAddress, setContractAddress] = useState("");
  const [targetSendRate, setTargetSendRate] = useState(50);
  const [numTransactions, setNumTransactions] = useState(1000);
  const [workers, setWorkers] = useState(1);
  const [functionExecuting, setFunctionExecuting] = useState("");

  const [progress, setProgress] = useState(0);
  // Resultados do teste atual
  const [results, setResults] = useState({
    functionName: caliper.lastBenchmarkInputs.functionName,
    ...caliper.lastBenchmarkResults
  });

  // Histórico
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

  // carregar ultimo resultado 
  useEffect(() => {
    async function getResultsZustend() {
      const newCaliper = useAppStore.getState().caliper;

      console.log("Dados do caliper zustend:", newCaliper);
      setResults({
        functionName: newCaliper.lastBenchmarkInputs.functionName,
        ...newCaliper.lastBenchmarkResults
      });
    }

    getResultsZustend();
  }, [caliper.lastBenchmarkResults]);

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

  /*
  function pooling() {
    return new Promise<void>((resolve) => {
      async function check() {
        try {
          const response = await fetch('/api/benchmark/start', { method: 'GET' });
          const data = await response.json();

          console.log('Benchmark status:', data);

          if (data.finished) {
            resolve();
          } else {
            setTimeout(check, 5000); // tenta novamente
          }

        } catch (err) {
          console.log(err);
          resolve(); // encerra em caso de erro
        }
      }

      check();
    });
  }
  */

  async function getResult() {
    try {
      const response = await fetch('/api/benchmark/start', { method: 'GET' });
      const data = await response.json();

      console.log('Resultados do benchmark:', data);

      if (data.result) {
        setCaliper({ lastBenchmarkResults: data.result });
      }

    } catch (err) {
      console.log("Erro ao obter resultados:", err);
    }
  }

  async function startBenchmark() {
    setIsRunning(true);
    setCaliper({
      lastBenchmarkInputs: {
          functionName: selectedFunction,
          targetSendRate,
          numTransactions,
          workers,
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678"
      },
    });

    setFunctionExecuting(selectedFunction);

    try {
      const res = await fetch('/api/benchmark/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionName: selectedFunction,
          targetSendRate,
          numTransactions,
          workers,
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678"
        })
      });

      if (!res.ok) {
        throw new Error("Erro no servidor: " + res.status);
      }

      const data = await res.json();
      console.log("Benchmark finalizado:", data);

    } catch (err) {
      console.log("Erro ao iniciar benchmark:", err);

    } finally {
      setIsRunning(false);
      await getResult();
    }
  }

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div>
        <h2 className="text-white mb-2">Testes do Contrato Simple</h2>
        <p className="text-slate-400">Execute e monitore testes direcionados às funções do contrato Simple (no futuro ampliar para outros contratos)</p>
      </div>

      {/* STATUS DO TESTE */}
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
                  Função: <span className="text-purple-400 uppercase">{functionExecuting}</span>
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
      )}

      {/* CONFIGURAÇÃO DO TESTE */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Configuração do Teste</h3>

        <div className="space-y-4">

          {/* Seleção da função */}
          <div>
            <label className="text-slate-300 mb-2 block">Selecione a função</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["open", "query", "transfer"].map(func => (
                <button
                  key={func}
                  onClick={() => setSelectedFunction(func)}
                  className={`p-4 rounded-lg border transition-colors text-left ${selectedFunction === func
                    ? "bg-purple-600/20 border-purple-600 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                >
                  <h4 className="text-white capitalize">{func}</h4>
                  <p className="text-sm text-slate-400">
                    Executa a função <span className="text-purple-400">{func}</span> do contrato.
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs do teste */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 mb-2 block">Send Rate Alvo (TPS)</label>
              <input
                type="number"
                value={targetSendRate}
                onChange={(e) => setTargetSendRate(Number(e.target.value))}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 mb-2 block">Transações Totais</label>
              <input
                type="number"
                value={numTransactions}
                onChange={(e) => setNumTransactions(Number(e.target.value))}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 mb-2 block">Número de Workers</label>
              <input
                type="number"
                value={workers}
                onChange={(e) => setWorkers(Number(e.target.value))}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Endereço do Contrato */}
          <div className="mb-6">
            <label className="text-slate-300 mb-2 block">
              Endereço do Contrato
            </label>

            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x1234...ABCD"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-purple-600 focus:outline-none"
            />
          </div>

          {/* Botão iniciar */}
          <button
            onClick={startBenchmark}
            disabled={isRunning}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isRunning
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              }`}
          >
            <Play className="w-5 h-5" />
            {isRunning ? "Teste em Execução..." : "Iniciar Teste"}
          </button>
        </div>
      </div>

      {/* RESULTADOS DO TESTE */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">
            Resultados do Último Teste —
            <span className="text-purple-400 ml-2 uppercase">{results.functionName}</span>
          </h3>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard label="Sucessos" value={results.success} icon={CheckCircle} color="text-green-400" />
          <ResultCard label="Falhas" value={results.failures} icon={XCircle} color="text-red-400" />
          <ResultCard label="Send Rate Atingido" value={`${results.sendRate} tx/s`} icon={Gauge} color="text-blue-400" />
          <ResultCard label="Throughput" value={`${results.throughput.toFixed(2)} tx/s`} icon={Zap} color="text-yellow-400" />
        </div>

        {/* Latências */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Latência Mínima" value={`${results.latency.min} ms`} icon={Timer} color="text-green-300" />
          <ResultCard label="Latência Média" value={`${results.latency.avg} ms`} icon={Timer} color="text-blue-300" />
          <ResultCard label="Latência Máxima" value={`${results.latency.max} ms`} icon={Timer} color="text-red-300" />
        </div>
      </div>

      {/* HISTÓRICO DE TESTES */}
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

      {/* SOBRE O CALIPER */}
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

    </div>
  );
}
