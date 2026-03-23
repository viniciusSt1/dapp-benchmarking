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
  const [progress, setProgress] = useState(0);
  
  // Resultados do teste atual
  const [results, setResults] = useState({
    functionName: caliper.lastBenchmarkInputs.functionName,
    ...caliper.lastBenchmarkResults
  });

  // Atualizar resultados quando o benchmark termina
  useEffect(() => {
    setResults({
      functionName: caliper.lastBenchmarkInputs.functionName,
      ...caliper.lastBenchmarkResults
    });
  }, [caliper.lastBenchmarkResults]);

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div>
        <h2 className="text-white mb-2">Testes de Contratos</h2>
        <p className="text-slate-400">Execute e monitore testes direcionados às funções dos contratos Simple, ERC20 e ERC721</p>
      </div>

      {/* STATUS DO TESTE */}
      <CardRunning
        isRunning={caliper.lastBenchStatus === "running"}
        functionExecuting={caliper.lastBenchmarkInputs.functionName}
        progress={progress}
        numTransactions={caliper.lastBenchmarkInputs.numTransactions} />

      {/* CONFIGURAÇÃO DO TESTE */}
      <ConfigTests />

      {/* RESULTADOS DO TESTE */}
      <ResultTestes results={results} />

      {/* HISTÓRICO DE TESTES */}
      <HistoricTests />

      {/* SOBRE O CALIPER */}
      <AboutCaliper />
    </div>
  );
}
