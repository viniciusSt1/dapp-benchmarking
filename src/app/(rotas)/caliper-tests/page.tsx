'use client';

import { useEffect, useState } from 'react';
import { CaliperResults, useAppStore } from '@/src/store/useAppStore';

import AboutCaliper from './AboutCaliper';
import ConfigTests from './ConfigTests';
import ResultTestes from './ResultTestes';
import HistoricTests from './HistoricTests';
import CardRunning from './CardRunning';

export default function CaliperTesting() {
  const caliper = useAppStore((state) => state.caliper);
  const setCaliper = useAppStore((state) => state.setCaliper);
  const { wsEndpoint, rpcEndpoint } = useAppStore((state) => state.blockchain);

  const [selectedFunction, setSelectedFunction] = useState<string>("open");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [targetSendRate, setTargetSendRate] = useState<string>("100");
  const [numTransactions, setNumTransactions] = useState<string>("1000");
  const [workers, setWorkers] = useState<string>("1");
  const [functionExecuting, setFunctionExecuting] = useState<string>("");

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

      //console.log("Dados do caliper zustend:", newCaliper);

      setSelectedFunction(newCaliper.lastBenchmarkInputs.functionName);
      setTargetSendRate(newCaliper.lastBenchmarkInputs.targetSendRate.toString());
      setNumTransactions(newCaliper.lastBenchmarkInputs.numTransactions.toString());
      setWorkers(newCaliper.lastBenchmarkInputs.workers.toString());
      setContractAddress(newCaliper.lastBenchmarkInputs.contractAddress);

      setResults({
        functionName: newCaliper.lastBenchmarkInputs.functionName,
        ...newCaliper.lastBenchmarkResults
      });
    }

    getResultsZustend();
  }, [caliper.lastBenchmarkResults]);

  async function contractExists(address: string) {
    const res = await fetch("/api/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rpcEndpoint: rpcEndpoint,
        jsonrpc: "2.0",
        method: "eth_getCode",
        params: [address, "latest"],
        id: 1,
      }),
    });

    const data = await res.json();

    return data.result && data.result !== "0x";
  }

  async function getResult() {
    try {
      const response = await fetch('/api/benchmark/start', { method: 'GET' });
      const data = await response.json();

      if (!data.result) throw new Error("Resultados não encontrados");

      //console.log('Resultados do benchmark:', data);

      const currentState = useAppStore.getState();

      setCaliper({
        lastBenchStatus: "finished",
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
      const resultsError: CaliperResults = {
        success: 0,
        failures: 0,
        sendRate: 0,
        throughput: 0,
        latency: { min: 0, avg: 0, max: 0 },
        date: Date.now(),
        status: "failed",
      }

      setCaliper({
        lastBenchStatus: "finished",
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
    if (targetSendRate == '' || Number(targetSendRate) <= 0) {
      alert("O Send Rate Alvo deve ser maior que 0");
      return;
    }

    if (numTransactions == '' || Number(numTransactions) <= 0) {
      alert("O número de transações deve ser maior que 0");
      return;
    }

    if (workers == '' || Number(workers) <= 0) {
      alert("O número de workers deve ser maior que 0");
      return;
    }

    const exists = await contractExists(contractAddress);

    if (!exists) {
      alert("O endereço informado não possui contrato deployado na rede.");
      return;
    }

    setCaliper({
      lastBenchmarkInputs: {
        functionName: selectedFunction,
        targetSendRate: Number(targetSendRate),
        numTransactions: Number(numTransactions),
        workers: Number(workers),
        contractAddress,
      },
      lastBenchStatus: "running",
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
          contractAddress,
          wsEndpoint: wsEndpoint
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
        isRunning={caliper.lastBenchStatus === "running"}
        functionExecuting={functionExecuting}
        progress={progress}
        numTransactions={Number(numTransactions)} />

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
        isRunning={caliper.lastBenchStatus === "running"}
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
