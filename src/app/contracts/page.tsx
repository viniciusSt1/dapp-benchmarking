'use client'

import { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  XCircle,
  Rocket,
  ShieldCheck,
  Zap,
  Play,
  Book,
  Edit,
  FileCode,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractFunction {
  name: string;
  type: 'read' | 'write';
  inputs: { name: string; type: string }[];
  outputs?: { type: string }[];
}

export default function SmartContracts() {  // Separar componentes depois
  const [activeTab, setActiveTab] = useState<'deploy' | 'test'>('deploy');

  // Deploy states
  const [contractName, setContractName] = useState('');
  const [solidityVersion, setSolidityVersion] = useState('^0.8.33'); // fixed 
  const [solFile, setSolFile] = useState<File | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deployResult, setDeployResult] = useState<any>(null);
  const [contractSource, setContractSource] = useState('');

  const [deployError, setDeployError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [evmVersion, setEvmVersion] = useState("london");

  // Test states
  const [contractAddress, setContractAddress] = useState('');
  const [abiText, setAbiText] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [functions, setFunctions] = useState<ContractFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'read' | 'write'>('all');
  //const [expandedFunctions, setExpandedFunctions] = useState<Record<string, boolean>>({});
  //const [functionInputs, setFunctionInputs] = useState<Record<string, Record<string, string>>>({});
  //const [functionOutputs, setFunctionOutputs] = useState<Record<string, string>>({});
  //const [executingFunctions, setExecutingFunctions] = useState<Record<string, boolean>>({});

  // ----------------- Deploy
  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    setIsDeploying(true);
    setDeployResult(null);
    setDeployError(null);
    setDeployedAddress('');

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractName,
          contractSource,
          solidityVersion,
          privateKey: "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // --> Conta fe3b... -> Ajustar conexão com wallet do app depois
          rpcEndpoint: "http://127.0.0.1:8545"
        }),
      });

      const data = await res.json();
      setDeployResult(data);

      if (data.error || !data.address) {
        setDeployError(data.error || "Erro desconhecido durante o deploy.");
        toast.error("Erro ao implantar contrato.");
      } else {
        setDeployedAddress(data.address);
        toast.success("Contrato implantado com sucesso!");
      }

    } catch (error) {
      setDeployError("Falha na comunicação com o servidor.");
      toast.error("Falha durante o deploy.");
    }

    setIsDeploying(false);
  }

  //--------------- Functions

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSolFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.sol')) {
        toast.error('Por favor, selecione um arquivo .sol');
        return;
      }
      setSolFile(file);

      const reader = new FileReader();
      reader.onload = () => setContractSource(String(reader.result));
      reader.readAsText(file);

      toast.success('Arquivo .sol carregado com sucesso!');
    }
  };

  const handleAbiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAbiText(content);
        try {
          const parsedAbi = JSON.parse(content);
          const extractedFunctions = parsedAbi
            .filter((item: any) => item.type === 'function')
            .map((item: any) => ({
              name: item.name,
              type: item.stateMutability === 'view' || item.stateMutability === 'pure' ? 'read' : 'write',
              inputs: item.inputs || [],
              outputs: item.outputs || [],
            }));
          setFunctions(extractedFunctions);
          toast.success('ABI carregado e funções extraídas com sucesso!');
        } catch (error) {
          toast.error('Erro ao processar ABI');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAbiTextChange = (text: string) => {
    setAbiText(text);
    if (text.trim()) {
      try {
        const parsedAbi = JSON.parse(text);
        const extractedFunctions = parsedAbi
          .filter((item: any) => item.type === 'function')
          .map((item: any) => ({
            name: item.name,
            type: item.stateMutability === 'view' || item.stateMutability === 'pure' ? 'read' : 'write',
            inputs: item.inputs || [],
            outputs: item.outputs || [],
          }));
        setFunctions(extractedFunctions);
      } catch (error) {
        // Silently fail while typing
      }
    }
  };

  const handleVerify = () => {
    if (!contractAddress || !validateAddress(contractAddress)) {
      toast.error('Endereço de contrato inválido');
      return;
    }
    if (!abiText.trim()) {
      toast.error('Por favor, forneça a ABI do contrato');
      return;
    }

    setTimeout(() => {
      setIsVerified(true);
      toast.success('Contrato verificado com sucesso!');
    }, 1500);
  };

  const handleExecuteFunction = async () => {
    if (!selectedFunction) return;

    setIsExecuting(true);
    setOutput('');

    setTimeout(() => {
      if (selectedFunction.type === 'read') {
        setOutput('1000000000000000000000');
        toast.success('Consulta executada com sucesso!');
      } else {
        setOutput('0x8f3e...d2a1');
        toast.success('Transação enviada com sucesso!');
      }
      setIsExecuting(false);
    }, 1500);
  };

  const filteredFunctions = filter === 'all'
    ? functions
    : functions.filter(f => f.type === filter);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Smart Contracts</h2>
        <p className="text-slate-400">Faça deploy e teste seus contratos inteligentes</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'deploy'
              ? 'text-white border-b-2 border-purple-600 bg-slate-800/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
          >
            <Rocket className="w-5 h-5" />
            Deploy de Contrato
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'test'
              ? 'text-white border-b-2 border-purple-600 bg-slate-800/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
          >
            <Play className="w-5 h-5" />
            Testar Funções
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'deploy' ? (
            /* Deploy Tab Content */
            <div className="space-y-6">
              {/* Upload do arquivo .sol */}
              <div>
                <label className="block text-white mb-2">
                  Arquivo do Contrato (.sol) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".sol"
                    onChange={handleSolFileUpload}
                    className="hidden"
                    id="sol-upload"
                  />
                  <label
                    htmlFor="sol-upload"
                    className={`flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${solFile
                      ? 'border-green-600 bg-green-600/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                  >
                    {solFile ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div className="text-center">
                          <p className="text-white">{solFile.name}</p>
                          <p className="text-slate-400 text-sm">Clique para alterar</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileCode className="w-6 h-6 text-slate-400" />
                        <div className="text-center">
                          <p className="text-white">Clique para fazer upload do arquivo .sol</p>
                          <p className="text-slate-400 text-sm">Ou arraste e solte aqui</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Nome do Contrato */}
              <div>
                <label className="block text-white mb-2">
                  Nome do Contrato <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="Ex: MyToken, NFTContract, SimpleStorage"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Versão do Solidity */}
              <div>
                <label className="block text-white mb-2">
                  Versão do Solidity <span className="text-red-500">*</span>
                </label>

                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="v0.8.26+commit.8a97fa7a">^0.8.33</option>
                </select>

              </div>


              {/* EVM Version */}
              <div>
                <label className="block text-white mb-2">
                  Versão da EVM <span className="text-red-500">*</span>
                </label>
                <select
                  value={evmVersion}
                  onChange={(e) => setEvmVersion(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="shanghai">Shanghai</option>
                  <option value="paris">Paris</option>
                  <option value="london">London</option>
                  <option value="berlin">Berlin</option>
                  <option value="istanbul">Istanbul</option>
                </select>
              </div>

              {/* Gas Estimado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <p className="text-slate-400">Gas Estimado</p>
                  </div>
                  <p className="text-white">~2,500,000</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-400 mb-2">Custo (ETH)</p>
                  <p className="text-white">~0.05 ETH</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-400 mb-2">Custo (USD)</p>
                  <p className="text-white">~$125.00</p>
                </div>
              </div>

              {/* Botão Deploy */}
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Implantando Contrato...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Deploy do Contrato
                  </>
                )}
              </button>

              {/* Resultado do Deploy */}
              {deployError && (
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white mb-1">Erro ao implantar o contrato</p>
                      <p className="text-red-400 text-sm mb-2">{deployError}</p>
                      <button
                        className="text-red-400 text-sm underline"
                        onClick={() => setShowDetails((s) => !s)}
                      >
                        {showDetails ? "Ocultar detalhes" : "Mostrar detalhes"}
                      </button>
                    </div>
                  </div>

                  {showDetails && (
                    <pre className="mt-4 text-xs bg-zinc-950 p-4 rounded whitespace-pre-wrap break-all border border-red-800">
                      {JSON.stringify(deployResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              {deployedAddress && !deployError && (
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white mb-1">Contrato implantado com sucesso!</p>

                      {/* Endereço do contrato */}
                      <p className="text-slate-400 text-sm mb-2">Endereço do contrato:</p>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-green-400 break-all">
                        {deployedAddress}
                      </div>

                      {/* Botão para ver detalhes */}
                      <button
                        className="mt-3 text-green-400 text-sm underline"
                        onClick={() => setShowDetails((s) => !s)}
                      >
                        {showDetails ? "Ocultar detalhes" : "Mostrar detalhes"}
                      </button>
                    </div>
                  </div>

                  {showDetails && (
                    <pre className="mt-4 text-xs bg-zinc-950 p-4 rounded whitespace-pre-wrap break-all border border-green-800">
                      {JSON.stringify(deployResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* Test Tab Content */
            <div className="space-y-6">
              {/* Endereço do Contrato */}
              <div>
                <label className="block text-white mb-2">
                  Endereço do Contrato <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${contractAddress && validateAddress(contractAddress)
                      ? 'border-green-600 focus:ring-green-600'
                      : contractAddress
                        ? 'border-red-600 focus:ring-red-600'
                        : 'border-slate-700 focus:ring-purple-600'
                      }`}
                  />
                  {contractAddress && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validateAddress(contractAddress) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {contractAddress && !validateAddress(contractAddress) && (
                  <p className="text-red-400 mt-1 text-sm">Endereço inválido</p>
                )}
              </div>

              {/* ABI do Contrato */}
              <div>
                <label className="block text-white mb-2">
                  ABI do Contrato <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleAbiFileUpload}
                      className="hidden"
                      id="abi-upload"
                    />
                    <label
                      htmlFor="abi-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload ABI
                    </label>
                    <span className="text-slate-400 flex items-center">ou cole o ABI abaixo</span>
                  </div>
                  <textarea
                    onChange={(e) => handleAbiTextChange(e.target.value)}
                    placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"}]'
                    rows={6}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Status de Verificação */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  {isVerified ? (
                    <>
                      <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-white">Contrato Verificado</p>
                        <p className="text-slate-400 text-sm">Pronto para interagir com as funções</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-white">Não Verificado</p>
                        <p className="text-slate-400 text-sm">Verifique o contrato para continuar</p>
                      </div>
                    </>
                  )}
                </div>

                {!isVerified && (
                  <button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verificar Contrato
                  </button>
                )}
              </div>

              {/* Funções do Contrato */}
              {isVerified && functions.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">Funções do Contrato</h3>
                    <div className="flex gap-2">
                      {['all', 'read', 'write'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f as typeof filter)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === f
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                        >
                          {f === 'all' ? 'Todas' : f === 'read' ? 'Read' : 'Write'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredFunctions.map((func, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden"
                      >
                        {/* Header da Função */}
                        <button
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {func.type === 'read' ? (
                              <Book className="w-5 h-5 text-blue-400" />
                            ) : (
                              <Edit className="w-5 h-5 text-orange-400" />
                            )}
                            <div className="text-left">
                              <h4 className="text-white font-mono">{func.name}</h4>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${func.type === 'read'
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'bg-orange-600/20 text-orange-400'
                                }`}>
                                {func.type === 'read' ? 'Read Function' : 'Write Function'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {func.inputs.length > 0 && (
                              <span className="text-slate-400 text-sm">
                                {func.inputs.length} {func.inputs.length === 1 ? 'parâmetro' : 'parâmetros'}
                              </span>
                            )}
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          </div>
                        </button>


                        {/* Estimativa de Gas para Write Functions */}
                        {func.type === 'write' && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-200 text-sm">
                              Gas estimado: ~45,000 (~$2.25)
                            </span>
                          </div>
                        )}

                        {/* Botão de Execução */}
                        <button

                          className={`w-full px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${func.type === 'read'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                        >
                            <Play className="w-4 h-4" />
                            {func.type === 'read' ? 'Query' : 'Executar Transação'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}