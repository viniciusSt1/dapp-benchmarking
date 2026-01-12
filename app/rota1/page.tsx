"use client";

import React, { useState, useRef, useEffect } from "react";
import Card from './components/card';
import Button from './components/button';

export default function BesuDAppPage() {
  const [contractName, setContractName] = useState("");
  const [contractSource, setContractSource] = useState("");
  const [contractFileName, setContractFileName] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);

  const [rpcResult, setRpcResult] = useState<any>(null);
  const [addressQuery, setAddressQuery] = useState("");

  const [benchRunning, setBenchRunning] = useState(false);
  const [benchFinished, setBenchFinished] = useState(false);
  const [benchOutput, setBenchOutput] = useState<string | null>(null);
  const [benchError, setBenchError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setContractFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setContractSource(String(reader.result));
    reader.readAsText(file);
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  async function pollStatus() { // Polling (verificação periódica) do status do benchmark
    if (pollRef.current) return;

    const id = window.setInterval(async () => { // Verifica se finalizou a cada 1s
      try {
        const res = await fetch("/api/benchmark/start");  // Método GET omitido
        
        if (!res.ok) {  // Erro na requisição
          const data = await res.json().catch(() => null);

          setBenchError(data?.error || "Erro ao verificar status");
          setBenchRunning(false);
          setBenchFinished(true);

          if (pollRef.current) {
            clearInterval(pollRef.current); // Para polling
            pollRef.current = null;
          }
          return;
        }

        const data = await res.json();
        
        if (!data.running && data.finished) {
          setBenchOutput(data.stdout ?? null);
          setBenchError(data.stderr ?? null);
          setBenchRunning(false);
          setBenchFinished(true);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (e: any) {
        setBenchError(String(e?.message ?? e));
        setBenchRunning(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, 1000);

    pollRef.current = id;
  }

  async function startBenchmark() {
    if (benchRunning) return;

    setBenchRunning(true);
    setBenchFinished(false);
    setBenchOutput(null);
    setBenchError(null);

    try {
      const res = await fetch("/api/benchmark/start", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setBenchError(data?.error || "Erro ao iniciar benchmark");
        setBenchRunning(false);
        return;
      }

      // started — begin polling
      pollStatus();
    } catch (e: any) {
      setBenchError(String(e?.message ?? e));
      setBenchRunning(false);
    }
  }

  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    setDeploying(true);
    setDeployResult(null);

    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractName,
        contractSource,
      }),
    });

    const data = await res.json();
    setDeployResult(data);
    setDeploying(false);
  }

  async function callRpc(method: string, params: any[] = []) {
    setRpcResult(null);

    const res = await fetch("/api/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    const data = await res.json();
    setRpcResult(data);
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-10">
      <div className="mx-auto max-w-5xl px-6 space-y-8">

        {/*
        <Card></Card>
        <Button></Button>
        */}
        
        {/* DEPLOY */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Deploy de contrato inteligente
          </h2>

          <form onSubmit={handleDeploy} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do contrato</label>
              <input
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="MyContract"
                className="mt-2 w-full rounded-lg border px-3 py-2 bg-white dark:bg-zinc-950"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Código Solidity</label>
                <textarea
                  value={contractSource}
                  onChange={(e) => setContractSource(e.target.value)}
                  rows={12}
                  placeholder="pragma solidity ^0.8.0; contract MyContract { }"
                  className="mt-2 w-full rounded-lg border p-3 font-mono text-sm bg-white dark:bg-zinc-950"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Upload .sol</label>
                <input
                  type="file"
                  accept=".sol"
                  onChange={handleFileChange}
                  className="mt-2 text-sm"
                />

                {contractFileName && (
                  <div className="mt-4 p-3 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm">
                    <div className="flex justify-between items-center">
                      <span>{contractFileName}</span>
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(!previewOpen)}
                        className="text-indigo-600 dark:text-indigo-400 underline"
                      >
                        {previewOpen ? "Ocultar" : "Visualizar"}
                      </button>
                    </div>

                    {previewOpen && (
                      <pre className="mt-3 text-xs bg-black text-white p-3 rounded overflow-auto">
                        {contractSource}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={deploying}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            >
              {deploying ? "Fazendo deploy..." : "Deploy contrato"}
            </button>
          </form>

          {deployResult && (
            <pre className="mt-4 text-xs bg-zinc-100 dark:bg-zinc-800 p-4 rounded whitespace-pre-wrap break-all">
              {JSON.stringify(deployResult, null, 2)}
            </pre>
          )}
        </section>

        {/* RPC */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Chamadas RPC (Besu)
          </h2>

          <div className="flex flex-wrap gap-3 mb-4">
            {/* Blocos / Chain */}
            <button
              onClick={() => callRpc("eth_blockNumber")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Último bloco
            </button>

            <button
              onClick={() => callRpc("eth_chainId")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Chain ID
            </button>

            {/* Rede */}
            <button
              onClick={() => callRpc("net_peerCount")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Peer count
            </button>

            <button
              onClick={() => callRpc("net_listening")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Net listening
            </button>

            <button
              onClick={() => callRpc("net_enode")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Enode
            </button>

            <button
              onClick={() => callRpc("net_services")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Net services
            </button>

            {/* Nó */}
            <button
              onClick={() => callRpc("admin_nodeInfo")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Node info
            </button>

            <button
              onClick={() => callRpc("web3_clientVersion")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Client version
            </button>

            {/* Métricas */}
            <button
              onClick={() => callRpc("debug_metrics")}
              className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              Debug metrics
            </button>
          </div>


          <div className="flex gap-2 mb-4">
            <input
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded-lg border px-3 py-2 bg-white dark:bg-zinc-950"
            />
            <button
              onClick={() =>
                callRpc("eth_getBalance", [addressQuery, "latest"])
              }
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Saldo
            </button>
          </div>

          {rpcResult && (
            <pre className="mt-4 text-xs bg-zinc-100 dark:bg-zinc-800 p-4 rounded whitespace-pre-wrap break-all">
              {JSON.stringify(rpcResult, null, 2)}
            </pre>
          )}
        </section>

        <div className="flex flex-wrap gap-3 mb-4">

          <button
            onClick={startBenchmark}
            className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
          >
            Rodar benchmark (Caliper)
          </button>

          {benchRunning && (
            <div className="px-3 py-2 rounded-lg text-sm text-indigo-600">Rodando benchmark... (aguarde)</div>
          )}

        </div>

        {benchFinished && (
          <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-md font-semibold mb-2">Resultado do benchmark</h3>
            {benchError ? (
              <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900 p-4 rounded whitespace-pre-wrap break-all text-red-800 dark:text-red-200">
                {benchError}
              </pre>
            ) : (
              <pre className="mt-2 text-xs bg-zinc-100 dark:bg-zinc-800 p-4 rounded whitespace-pre-wrap break-all">
                {benchOutput}
              </pre>
            )}
          </section>
        )}
        
      </div>
    </main>
  );
}
