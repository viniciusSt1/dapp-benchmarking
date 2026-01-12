import { useState } from 'react';
import { Wallet, Copy, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function WalletSection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [balance] = useState('2.5847');
  const [usdBalance] = useState('6,461.75');

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulando conexão com carteira
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast.success('Carteira conectada com sucesso!');
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info('Carteira desconectada');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Endereço copiado!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Carteira</h2>
        <p className="text-slate-400">Gerencie sua carteira e saldo</p>
      </div>

      {!isConnected ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
          <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-white mb-2">Conecte sua Carteira</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Conecte sua carteira Web3 para interagir com contratos inteligentes e gerenciar seus ativos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  MetaMask
                </>
              )}
            </button>
            <button
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              WalletConnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status da Carteira */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-white">Carteira Conectada</p>
                  <p className="text-slate-400">MetaMask</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Desconectar
              </button>
            </div>

            {/* Endereço */}
            <div className="mb-6">
              <label className="block text-slate-400 mb-2">Endereço da Carteira</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 font-mono text-white">
                  {walletAddress}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <a
                  href={`https://etherscan.io/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Saldo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl">
                <p className="text-purple-200 mb-2">Saldo ETH</p>
                <p className="text-white mb-1">{balance} ETH</p>
                <p className="text-purple-200">${usdBalance} USD</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <p className="text-slate-400 mb-2">Network</p>
                <p className="text-white mb-1">Sepolia Testnet</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400">Conectado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tokens */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-white mb-4">Seus Tokens</h3>
            <div className="space-y-3">
              {[
                { name: 'Wrapped Ethereum', symbol: 'WETH', balance: '1.2345', usd: '3,086.25' },
                { name: 'USD Coin', symbol: 'USDC', balance: '1,500.00', usd: '1,500.00' },
                { name: 'Dai Stablecoin', symbol: 'DAI', balance: '750.50', usd: '750.50' },
              ].map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white">{token.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="text-white">{token.name}</p>
                      <p className="text-slate-400">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{token.balance}</p>
                    <p className="text-slate-400">${token.usd}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
