'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, AlertTriangle, Key } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/src/store/useAppStore'
import { Wallet } from 'ethers'

export default function WalletImport() {
  const { wallet, setWallet } = useAppStore()

  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPrivateKey(wallet.privateKey)
    setPublicKey(wallet.publicKey)
  }, [wallet.privateKey])

  const handleImport = async () => {
    setLoading(true)

    try {
      const wallet = new Wallet(privateKey)
      setPublicKey(wallet.address)
      toast.success('Carteira importada com sucesso!')
      setWallet({ privateKey, publicKey: wallet.address })
    } catch (err) {
      toast.error('Erro ao importar carteira')
      setPublicKey(wallet.publicKey)
      setPrivateKey(wallet.privateKey)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-yellow-700/40 rounded-xl p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
          <Key className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-white">Conectar Carteira</h3>
          <p className="text-slate-400 text-sm">
            Importar carteira via private key para deploy de contratos e execução de benchmarks.
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-3 p-4 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
        <AlertTriangle className="text-yellow-400 w-5 h-5 mt-0.5" />
        <div className="text-sm text-yellow-200">
          <p className="font-medium mb-1">Atenção</p>
          <p>
            Nunca use sua carteira principal. Utilize apenas contas de teste.
            Sua chave não será armazenada permanentemente.
          </p>
        </div>
      </div>

      {/* Private Key */}
      <div className="space-y-4">

        {/* Chave Privada */}
        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">
            Chave Privada (recarregue a página para utilizar a chave padrão)
          </label>

          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="0x..."
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono outline-none focus:border-purple-500"
            />

            <button
              onClick={() => setShowKey(!showKey)}
              className="px-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 flex items-center justify-center"
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Chave Pública */}
        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">
            Endereço da Carteira
          </label>

          <input
            type="text"
            value={publicKey}
            disabled
            placeholder="0x..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono opacity-70 cursor-not-allowed"
          />
        </div>

      </div>

      <button
        onClick={handleImport}
        disabled={loading}
        className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Importando...' : 'Importar Carteira'}
      </button>
    </div>
  )
}