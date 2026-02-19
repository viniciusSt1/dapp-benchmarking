'use client'

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { useAppStore } from '@/src/store/useAppStore';

/*
const networks = [
  { name: 'Selecione uma rede', chainId: "", symbol: '-' },
  { name: 'Ethereum Mainnet', chainId: 1, symbol: 'ETH' },
  { name: 'Sepolia Testnet', chainId: 11155111, symbol: 'SepoliaETH' },
  { name: 'Polygon Mainnet', chainId: 137, symbol: 'MATIC' },
  { name: 'Polygon Mumbai', chainId: 80001, symbol: 'MATIC' },
  { name: 'Besu Private Network', chainId: 1337, symbol: 'ETH' },
  { name: 'Arbitrum One', chainId: 42161, symbol: 'ETH' },
  { name: 'Optimism', chainId: 10, symbol: 'ETH' },
  { name: 'Outro', chainId: null, symbol: '-' },
];
*/

export default function BlockchainConfig() {
  const blockchain = useAppStore((state) => state.blockchain);
  const setBlockchain = useAppStore((state) => state.setBlockchain);

  //const [selectedNetwork, setSelectedNetwork] = useState(blockchain.chainId ? networks.find(n => n.chainId === blockchain.chainId) || networks[0] : networks[0]);
  //const [chainId, setChainId] = useState<number | string>(blockchain.chainId ?? null);

  const [rpcEndpoint, setRpcEndpoint] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');

  const [wsEndpoint, setWsEndpoint] = useState('');
  const [metricsEndpoint, setMetricsEndpoint] = useState('');

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const hasChanges =
    blockchain.rpcEndpoint !== rpcEndpoint ||
    blockchain.wsEndpoint !== wsEndpoint ||
    blockchain.metricsEndpoint !== metricsEndpoint ||
    blockchain.explorerUrl !== explorerUrl;


  useEffect(() => {
    // Carregar valores do Zustand
    setRpcEndpoint(blockchain.rpcEndpoint ?? '');
    setWsEndpoint(blockchain.wsEndpoint ?? '');
    setMetricsEndpoint(blockchain.metricsEndpoint ?? '');
    setExplorerUrl(blockchain.explorerUrl ?? '');
    //setChainId(blockchain.chainId ?? '');

    console.log('DADOS ZUSTEND:', blockchain);

    checkConnection();
  }, [blockchain]);

  async function checkConnection() {
    if (!blockchain.rpcEndpoint) {
      setIsConnected(false);
      return;
    }

    const res = await fetch("/api/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rpcEndpoint: blockchain.rpcEndpoint,
        jsonrpc: "2.0",
        id: 1,
        method: "eth_chainId",
        params: [],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        setIsConnected(true);
        return;
      }
    }

    setIsConnected(false);
  }

  const handleConnect = async () => { // Ao pressionar botão de conectar
    setIsConnecting(true);

    setBlockchain({
      //chainId: chainId,
      rpcEndpoint: rpcEndpoint,
      wsEndpoint: wsEndpoint,
      metricsEndpoint: metricsEndpoint,
      explorerUrl: explorerUrl,
    });

    console.log('useState:', {
      rpcEndpoint,
      wsEndpoint,
      metricsEndpoint,
      explorerUrl,
    });

    console.log('Zuntend:', {
      blockchain: blockchain,
    });

    await checkConnection();

    // Simulando conexão -> implementar teste se conectou corretamente
    setTimeout(() => {
      setIsConnecting(false);
      toast.success('Conectado à rede com sucesso!');
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);

    setBlockchain({
      rpcEndpoint: '',
      wsEndpoint: '',
      metricsEndpoint: '',
      chainId: '',
      explorerUrl: '',
    });

    toast.info('Desconectado da rede');

    setRpcEndpoint('');
    setWsEndpoint('');
    setMetricsEndpoint('');
    setExplorerUrl('');
    //setChainId(0);
  };

  const handleUpdate = () => {
    setBlockchain({
      rpcEndpoint,
      wsEndpoint,
      metricsEndpoint,
      explorerUrl,
    });

    toast.success("Configurações atualizadas!");
  };


  /*
  const handleNetworkChange = (networkName: string) => {
    const network:any = networks.find(n => n.name === networkName);
    if (!network) return;

    setSelectedNetwork(network);

    if (network.name === 'Outro') {
      setChainId(0);
      return;
    }

    setChainId(network.chainId);

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
  }; */

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
            <div className="flex items-center gap-2">

              {hasChanges && (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Atualizar
                </button>
              )}

              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Desconectar
              </button>

            </div>
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

        {/* Chain ID 
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
              <option key={network.name} value={network.name}>
                {network.name} (Chain ID: {network.chainId || 'custom'})
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-white mb-2">Chain ID</label>
          <input
            type="number"
            value={chainId}
            onChange={(e) => setChainId(Number(e.target.value))}
            readOnly={selectedNetwork.name !== 'Outro'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-400"
          />
          {selectedNetwork.name !== 'Outro' && (
            <p className="text-slate-500 mt-1">Preenchido automaticamente</p>
          )}
        </div>*/}

        {/* RPC HTTP Endpoint */}
        <div>
          <label className="block text-white mb-2">
            RPC Endpoint (HTTP) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={rpcEndpoint}
            onChange={(e) => setRpcEndpoint(e.target.value)}
            placeholder="http://localhost:8545"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <p className="text-slate-500 mt-1">
            URL do nó RPC para comunicação via HTTP
          </p>
        </div>

        {/* WebSocket Endpoint */}
        <div>
          <label className="block text-white mb-2">
            WebSocket Endpoint (WS RPC)
          </label>
          <input
            type="text"
            value={wsEndpoint}
            onChange={(e) => setWsEndpoint(e.target.value)}
            placeholder="ws://localhost:8645"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <p className="text-slate-500 mt-1">URL do WebSocket RPC do nó</p>
        </div>

        {/* Métricas */}
        <div>
          <label className="block text-white mb-2">Endpoint de Métricas</label>
          <input
            type="text"
            value={metricsEndpoint}
            onChange={(e) => setMetricsEndpoint(e.target.value)}
            placeholder="http://localhost:9545/metrics"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <p className="text-slate-500 mt-1">Endpoint usado para Prometheus/Grafana</p>
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

        {/* Informações da Rede 
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
        </div>*/}
      </div>
    </div>
  );

}
