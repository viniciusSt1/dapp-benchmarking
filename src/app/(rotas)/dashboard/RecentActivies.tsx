'use client'

import { useAppStore } from '@/src/store/useAppStore'
import { Copy, Check, Trash2 } from 'lucide-react'
import { useState } from 'react'

function formatTime(timestamp: number) {
  const diff = Date.now() - timestamp

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes} min`
  if (hours < 24) return `${hours}h`

  return new Date(timestamp).toLocaleDateString()
}

export default function RecentActivities() {
  const historic = useAppStore((s) => s.contractHistory?.historic || [])
  const removeContractHistory = useAppStore(
    (s) => s.removeContractHistory
  )

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (address: string, index: number) => {
    navigator.clipboard.writeText(address)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1200)
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
      <h3 className="text-white mb-4 text-base font-semibold">
        Histórico de Contratos
      </h3>

      {historic.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Nenhum contrato implantado ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {historic
            .map((contract, originalIndex) => ({
              contract,
              originalIndex,
            }))
            .reverse()
            .map(({ contract, originalIndex }, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {/* ESQUERDA */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      contract.status === 'success'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />

                  <div className="flex flex-col min-w-0">
                    {/* Título */}
                    <span className="text-white font-medium">
                      {contract.status === 'success'
                        ? contract.name || 'Contrato Desconhecido'
                        : 'Deploy falhou'}
                    </span>

                    {/* Descrição */}
                    {contract.status === 'success' ? (
                      <span
                        className="text-slate-400 text-sm font-mono truncate"
                        title={contract.address}
                      >
                        {contract.address}
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm">
                        Não foi possível implantar o contrato
                      </span>
                    )}
                  </div>
                </div>

                {/* DIREITA */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Tempo */}
                  <span className="text-slate-500 text-sm">
                    {formatTime(contract.date)}
                  </span>

                  {/* Copiar */}
                  {contract.status === 'success' && (
                    <button
                      onClick={() =>
                        handleCopy(contract.address, index)
                      }
                      className="p-1.5 rounded-md hover:bg-slate-700 transition"
                      title="Copiar endereço"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  )}

                  {/* Remover */}
                  <button
                    onClick={() =>
                      removeContractHistory(originalIndex)
                    }
                    className="p-1.5 rounded-md hover:bg-red-500/20 transition"
                    title="Remover do histórico"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}