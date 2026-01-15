'use client'

import { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';


const networks = [
  { name: 'Ethereum Mainnet', chainId: 1, symbol: 'ETH' },
  { name: 'Sepolia Testnet', chainId: 11155111, symbol: 'SepoliaETH' },
  { name: 'Polygon Mainnet', chainId: 137, symbol: 'MATIC' },
  { name: 'Polygon Mumbai', chainId: 80001, symbol: 'MATIC' },
  { name: 'Besu Private Network', chainId: 1337, symbol: 'ETH' },
  { name: 'Arbitrum One', chainId: 42161, symbol: 'ETH' },
  { name: 'Optimism', chainId: 10, symbol: 'ETH' },
];

export default function BlockchainConfig() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[1]);
  const [rpcEndpoint, setRpcEndpoint] = useState('https://sepolia.infura.io/v3/YOUR_API_KEY');
  const [explorerUrl, setExplorerUrl] = useState('https://sepolia.etherscan.io');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulando conexão
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast.success('Conectado à rede com sucesso!');
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info('Desconectado da rede');
  };

  const handleNetworkChange = (networkName: string) => {
    const network = networks.find(n => n.name === networkName);
    if (network) {
      setSelectedNetwork(network);
      setIsConnected(false);
      
      // Auto-preencher URLs baseado na rede
      if (network.name.includes('Sepolia')) {
        setRpcEndpoint('https://sepolia.infura.io/v3/YOUR_API_KEY');
        setExplorerUrl('https://sepolia.etherscan.io');
      } else if (network.name.includes('Polygon Mumbai')) {
        setRpcEndpoint('https://rpc-mumbai.maticvigil.com');
        setExplorerUrl('https://mumbai.polygonscan.com');
      } else if (network.name.includes('Polygon Mainnet')) {
        setRpcEndpoint('https://polygon-rpc.com');
        setExplorerUrl('https://polygonscan.com');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Configuração da Blockchain</h2>
        <p className="text-slate-400">Configure a rede blockchain para seu dApp</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
        {/* Status da Conexão */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-white">Conectado</p>
                  <p className="text-slate-400">{selectedNetwork.name}</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-slate-500" />
                <div>
                  <p className="text-white">Desconectado</p>
                  <p className="text-slate-400">Aguardando conexão</p>
                </div>
              </>
            )}
          </div>
          
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Desconectar
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isConnecting && <RefreshCw className="w-4 h-4 animate-spin" />}
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </button>
          )}
        </div>

        {/* Seleção de Rede */}
        <div>
          <label className="block text-white mb-2">
            Rede <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedNetwork.name}
            onChange={(e) => handleNetworkChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {networks.map((network) => (
              <option key={network.chainId} value={network.name}>
                {network.name} (Chain ID: {network.chainId})
              </option>
            ))}
          </select>
        </div>

        {/* Chain ID */}
        <div>
          <label className="block text-white mb-2">Chain ID</label>
          <input
            type="text"
            value={selectedNetwork.chainId}
            readOnly
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-400"
          />
          <p className="text-slate-500 mt-1">Preenchido automaticamente</p>
        </div>

        {/* RPC Endpoint */}
        <div>
          <label className="block text-white mb-2">
            RPC Endpoint <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={rpcEndpoint}
            onChange={(e) => setRpcEndpoint(e.target.value)}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <p className="text-slate-500 mt-1">URL do nó RPC para comunicação com a blockchain</p>
        </div>

        {/* Block Explorer URL */}
        <div>
          <label className="block text-white mb-2">Block Explorer URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={explorerUrl}
              onChange={(e) => setExplorerUrl(e.target.value)}
              placeholder="https://etherscan.io"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Informações da Rede */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 mb-1">Símbolo Nativo</p>
            <p className="text-white">{selectedNetwork.symbol}</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 mb-1">Tipo de Rede</p>
            <p className="text-white">
              {selectedNetwork.name.includes('Mainnet') ? 'Mainnet' : 'Testnet'}
            </p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 mb-1">Latência</p>
            <p className="text-white">{isConnected ? '45ms' : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
