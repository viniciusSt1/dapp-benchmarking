import { useState } from 'react';
import { Settings, Zap, Clock, Hash, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdvancedSettings() {
  const [gasLimit, setGasLimit] = useState(300000);
  const [gasPrice, setGasPrice] = useState(25);
  const [nonce, setNonce] = useState('');
  const [timeout, setTimeout] = useState(120);
  const [autoNonce, setAutoNonce] = useState(true);

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    setGasLimit(300000);
    setGasPrice(25);
    setNonce('');
    setTimeout(120);
    setAutoNonce(true);
    toast.info('Configurações restauradas para o padrão');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Configurações Avançadas</h2>
        <p className="text-slate-400">Ajuste parâmetros avançados de transação</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-8">
        {/* Gas Limit */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-yellow-500" />
              Gas Limit
            </label>
            <span className="text-purple-400">{gasLimit.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="21000"
            max="1000000"
            step="1000"
            value={gasLimit}
            onChange={(e) => setGasLimit(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-slate-500">21,000</span>
            <span className="text-slate-500">1,000,000</span>
          </div>
          <p className="text-slate-500 mt-2">
            Quantidade máxima de gas que pode ser usado na transação
          </p>
        </div>

        {/* Gas Price */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-yellow-500" />
              Gas Price (Gwei)
            </label>
            <span className="text-purple-400">{gasPrice} Gwei</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={gasPrice}
            onChange={(e) => setGasPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-slate-500">1 Gwei</span>
            <span className="text-slate-500">100 Gwei</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => setGasPrice(15)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              🐢 Lento (15)
            </button>
            <button
              onClick={() => setGasPrice(25)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              ⚡ Normal (25)
            </button>
            <button
              onClick={() => setGasPrice(40)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              🚀 Rápido (40)
            </button>
          </div>
        </div>

        {/* Custo Estimado */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 mb-1">Custo Estimado</p>
              <p className="text-white">
                {((gasLimit * gasPrice) / 1e9).toFixed(6)} ETH
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Em USD</p>
              <p className="text-white">
                ${((gasLimit * gasPrice * 2500) / 1e9).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Nonce */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5 text-purple-500" />
            <label className="text-white">Nonce</label>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoNonce}
                onChange={(e) => setAutoNonce(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-600"
              />
              <span className="text-slate-400">Automático</span>
            </label>
          </div>

          {!autoNonce && (
            <input
              type="number"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="Digite o nonce manualmente"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          )}
          <p className="text-slate-500 mt-2">
            Número usado para ordenar transações. Deixe automático a menos que saiba o que está fazendo.
          </p>
        </div>

        {/* Timeout */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-500" />
              Timeout de Transação (segundos)
            </label>
            <span className="text-purple-400">{timeout}s</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-slate-500">30s</span>
            <span className="text-slate-500">5min</span>
          </div>
          <p className="text-slate-500 mt-2">
            Tempo máximo de espera por confirmação antes de timeout
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-6 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Restaurar Padrão
          </button>
        </div>
      </div>
    </div>
  );
}
