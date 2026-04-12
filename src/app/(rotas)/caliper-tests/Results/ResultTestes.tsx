'use client';

import { useEffect, useState } from "react";
import ResultCard from "./ResultCard";
import { CheckCircle, XCircle, Gauge, Zap, Timer, Download } from "lucide-react";
import { toast } from "sonner";

export default function ResultTestes({ results }: {
  results: {
    functionName: string;
    success: number;
    failures: number;
    sendRate: number;
    throughput: number;
    latency: {
      min: number;
      avg: number;
      max: number;
    }
    date: string | number;
  }
}) {

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(results.date).toLocaleString("pt-BR")
    );
  }, [results.date]);

  const handleDownload = async () => {
    const res = await fetch("/api/benchmark/report");

    if (!res.ok) {
      toast.error("Erro ao baixar relatório");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.html";
    a.click();

    window.URL.revokeObjectURL(url);

    toast.success("Relatório disponibilizado com sucesso!");
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">
          Resultados do Último Teste —
          <span className="text-purple-400 ml-2 uppercase">{results.functionName}</span>
          <span className="text-slate-400"> ({formattedDate})</span>
        </h3>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
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
        <ResultCard label="Latência Mínima" value={`${results.latency.min} s`} icon={Timer} color="text-green-300" />
        <ResultCard label="Latência Média" value={`${results.latency.avg} s`} icon={Timer} color="text-blue-300" />
        <ResultCard label="Latência Máxima" value={`${results.latency.max} s`} icon={Timer} color="text-red-300" />
      </div>
    </div>
  );
}