'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/src/store/useAppStore';

import AboutCaliper from './AboutCaliper';
import ConfigTests from './ConfigTests';
import ResultTestes from './ResultTestes';
import HistoricTests from './HistoricTests';
import CardRunning from './CardRunning';

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

  async function getResult() {
    try {
      const response = await fetch('/api/benchmark/start', { method: 'GET' });
      const data = await response.json();

      if (!data.result) throw new Error("Resultados não encontrados");

      console.log('Resultados do benchmark:', data);

      const currentState = useAppStore.getState();

      setCaliper({
        lastBenchmarkResults: data.result,
        historic: [
          ...currentState.caliper.historic,
          {
            inputs: currentState.caliper.lastBenchmarkInputs,
            results: data.result
          }
        ]
      });


    } catch (err) {
      console.log("Erro ao obter resultados:", err);
      const currentState = useAppStore.getState();
      const resultsError = { // TRATAR ERRO DEPOIS
          success: 0,
          failures: 0,
          sendRate: 0,
          throughput: 0,
          latency: { min: 0, avg: 0, max: 0 },
          date: Date.now(),
        }

      setCaliper({
        lastBenchmarkResults: resultsError,
        historic: [
          ...currentState.caliper.historic,
          {
            inputs: currentState.caliper.lastBenchmarkInputs,
            results: resultsError
          }
        ]
      });
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
        contractAddress,
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
          contractAddress
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
      <CardRunning
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        functionExecuting={functionExecuting}
        progress={progress}
        numTransactions={numTransactions} />

      {/* CONFIGURAÇÃO DO TESTE */}
      <ConfigTests
        selectedFunction={selectedFunction}
        setSelectedFunction={setSelectedFunction}
        targetSendRate={targetSendRate}
        setTargetSendRate={setTargetSendRate}
        numTransactions={numTransactions}
        setNumTransactions={setNumTransactions}
        workers={workers}
        setWorkers={setWorkers}
        contractAddress={contractAddress}
        setContractAddress={setContractAddress}
        startBenchmark={startBenchmark}
        isRunning={isRunning}
      />

      {/* RESULTADOS DO TESTE */}
      <ResultTestes results={results} />

      {/* HISTÓRICO DE TESTES */}
      <HistoricTests />

      {/* SOBRE O CALIPER */}
      <AboutCaliper />
    </div>
  );
}
