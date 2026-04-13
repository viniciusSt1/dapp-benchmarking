'use client'

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useAppStore } from '@/src/store/useAppStore';
import { useMetricsStore } from '@/src/store/useMetricsStore';
import Input from '@/src/components/ui/Input';
import CardConnection from './CardConnection';

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
  const checkRpc = useAppStore((s) => s.checkRpcEndpointConnection)
  const isMetricsEndpointConnected = useMetricsStore((s) => s.isConnected)

  //const [selectedNetwork, setSelectedNetwork] = useState(blockchain.chainId ? networks.find(n => n.chainId === blockchain.chainId) || networks[0] : networks[0]);
  //const [chainId, setChainId] = useState<number | string>(blockchain.chainId ?? null);

  const [rpcEndpoint, setRpcEndpoint] = useState<string>('');
  const [explorerUrl, setExplorerUrl] = useState<string>('');
  const [wsEndpoint, setWsEndpoint] = useState<string>('');
  const [metricsEndpoint, setMetricsEndpoint] = useState<string>('');
  const [blockTime, setBlockTime] = useState<string>('');

  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const hasChanges =
    blockchain.rpcEndpoint !== rpcEndpoint ||
    blockchain.wsEndpoint !== wsEndpoint ||
    blockchain.metricsEndpoint !== metricsEndpoint ||
    blockchain.blockTime !== Number(blockTime) ||
    blockchain.explorerUrl !== explorerUrl;
  
  useEffect(() => {
    checkRpc();
  }, [blockchain.rpcEndpoint]);

  useEffect(() => {
    // Carregar valores do Zustand
    setRpcEndpoint(blockchain.rpcEndpoint ?? '');
    setWsEndpoint(blockchain.wsEndpoint ?? '');
    setMetricsEndpoint(blockchain.metricsEndpoint ?? '');
    setExplorerUrl(blockchain.explorerUrl ?? '');
    setBlockTime(blockchain.blockTime.toString() ?? '5');
    //setChainId(blockchain.chainId ?? '');

    console.log('DADOS ZUSTEND:', blockchain);
  }, [blockchain]);

  const handleConnect = async () => { // Ao pressionar botão de conectar
    setIsConnecting(true);

    setBlockchain({
      //chainId: chainId,
      rpcEndpoint: rpcEndpoint,
      wsEndpoint: wsEndpoint,
      metricsEndpoint: metricsEndpoint,
      blockTime: blockTime == '' ? 5 : Number(blockTime),
      explorerUrl: explorerUrl,
    });

    //checkRpc(); //realizado automaticamente no useEffect

    // Brincadeirinha
    setTimeout(() => {
      setIsConnecting(false);
      const currentState = useAppStore.getState()

      if (!currentState.blockchain.rpcEndpointConnected) {
        toast.error('Falha ao conectar à rede...')
        return
      }
      toast.success('Conectado com sucesso!');
    }, 1500);
  };

  const handleDisconnect = () => {
    setBlockchain({
      rpcEndpoint: '',
      rpcEndpointConnected:false,
      wsEndpoint: '',
      metricsEndpoint: '',
      //chainId: '',
      blockTime: 5,
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
      blockTime: blockTime == '' ? 5 : Number(blockTime),
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
        <CardConnection
          isConnected={blockchain.rpcEndpointConnected}
          isConnecting={isConnecting}
          hasChanges={hasChanges}
          handleUpdate={handleUpdate}
          handleDisconnect={handleDisconnect}
          handleConnect={handleConnect}
        ></CardConnection>

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
        <Input
          label="RPC Endpoint (HTTP)"
          value={rpcEndpoint}
          onChange={setRpcEndpoint}
          placeholder="http://localhost:8545"
          description="URL do nó RPC para comunicação via HTTP"
          required={true}
          error={!blockchain.rpcEndpointConnected}
        ></Input>

        {/* WebSocket Endpoint */}
        <Input
          label="WebSocket Endpoint (WS RPC)"
          value={wsEndpoint}
          onChange={setWsEndpoint}
          placeholder="ws://localhost:8645"
          description="URL do WebSocket RPC do nó utilizado para testes caliper"
          required={true}
          error={!blockchain.wsEndpoint}
        ></Input>

        {/* Métricas */}
        <Input
          label="Endpoint de Métricas"
          value={metricsEndpoint}
          onChange={setMetricsEndpoint}
          placeholder="http://localhost:9545/metrics"
          description="Endpoint usado para Prometheus/Grafana"
          required={true}
          error={!isMetricsEndpointConnected}
        ></Input>

        {/*Tempo em segundos a cada novo bloco */}
        <Input 
          label="Tempo em segundos a cada novo bloco (default: 5s)"
          value={blockTime.toString()}
          onChange={setBlockTime}
          placeholder="5"
          description="Tempo em segundos a cada novo bloco definido no genesis.json"
          type='number'
          //error={!isMetricsEndpointConnected}
        ></Input>

        {/* Block Explorer URL */}
        <Input
          label="Block Explorer URL (opcional)"
          value={explorerUrl}
          onChange={setExplorerUrl}
          placeholder="https://etherscan.io"
          description="URL do explorador de blocos"
          required={false}
        ></Input>

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
