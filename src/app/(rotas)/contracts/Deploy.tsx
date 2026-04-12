'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileCode, Rocket, Zap, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/src/store/useAppStore';
import Input from '@/src/components/ui/Input';
import Link from 'next/link';

export default function Deploy() {
    const [contractName, setContractName] = useState('');
    const [solidityVersion, setSolidityVersion] = useState('^0.8.33'); // fixed 
    const [solFile, setSolFile] = useState<File | null>(null);
    //const [isDeploying, setIsDeploying] = useState(false);
    //const [deployedAddress, setDeployedAddress] = useState('');
    //const [deployResult, setDeployResult] = useState<any>(null);
    const [contractSource, setContractSource] = useState('');
    const [contracts, setContracts] = useState<any>({});

    //const [deployError, setDeployError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [evmVersion, setEvmVersion] = useState<any>('shanghai');
    const [selectedContract, setSelectedContract] = useState<string | null>(null);

    const { rpcEndpoint } = useAppStore((state) => state.blockchain);
    const checkRpc = useAppStore((s) => s.checkRpcEndpointConnection)
    const rpcConnected = useAppStore((s) => s.blockchain.rpcEndpointConnected)

    const lastContractDeploy = useAppStore((s) => s.lastContractDeploy);
    const setLastContractDeploy = useAppStore((s) => s.setContract);

    const wallet = useAppStore((s) => s.wallet);

    useEffect(() => {
        async function loadAllContracts() {
            const files = [
                { key: 'simple', file: 'simple.sol', description: 'Contrato simples com operações básicas de conta', displayName: 'Simple' },
                { key: 'MyERC20', file: 'MyERC20.sol', description: 'Token ERC20 personalizado com suprimento inicial', displayName: 'ERC20' },
                { key: 'MyERC721', file: 'MyERC721.sol', description: 'NFT ERC721 personalizado com mint automático', displayName: 'ERC721' }
            ];

            const entries = await Promise.all(
                files.map(async ({ key, file, description, displayName }) => {
                    const res = await fetch(`/contracts/${file}`);
                    const source = await res.text();

                    return [key, { name: key, source, description, displayName }];
                })
            );

            setContracts(Object.fromEntries(entries));
        }

        loadAllContracts();
    }, []);

    async function handleDeploy(e: React.FormEvent) {
        e.preventDefault();
        //setIsDeploying(true);
        //setDeployResult(null);
        //setDeployError(null);
        //setDeployedAddress('');

        setLastContractDeploy({isDeploing: true});

        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contractName,
                    contractSource,
                    solidityVersion,
                    evmVersion,
                    privateKey: wallet.privateKey,
                    rpcEndpoint
                }),
            });

            const data = await res.json();
            //setDeployResult(data);
            setLastContractDeploy({deployResult: data });

            if (data.error || !data.address) {
                //setDeployError(data.error || "Erro desconhecido durante o deploy.");
                setLastContractDeploy({errorDeploy: data.error || "Erro desconhecido durante o deploy."});
                toast.error("Erro ao implantar contrato.");
            } else {
                //setDeployedAddress(data.address);
                setLastContractDeploy({address: data.address, name: contractName, abi: data.abi, errorDeploy: null});
                toast.success("Contrato implantado com sucesso!");
            }

        } catch (error) {
            //setDeployError("Falha na comunicação com o servidor.");
            setLastContractDeploy({errorDeploy: "Falha na comunicação com o servidor."});
            toast.error("Falha durante o deploy.");
        }

        //setIsDeploying(false);
        setLastContractDeploy({isDeploing: false});
    }

    function handleSelectContract(key: string) {
        if (!(key in contracts)) return;

        const contract = contracts[key];

        setSelectedContract(key);
        setContractName(contract.name);
        setContractSource(contract.source);
        setEvmVersion(contract.name == "simple" ? "shanghai" : "cancun");
        setSolFile(null);
    }

    const handleSolFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.sol')) {
                toast.error('Por favor, selecione um arquivo .sol');
                return;
            }
            setSolFile(file);
            setSelectedContract(null); // desmarcar contrato pré-implementado

            const reader = new FileReader();
            reader.onload = () => setContractSource(String(reader.result));
            reader.readAsText(file);

            toast.success('Arquivo .sol carregado com sucesso!');
        }
    };

    function truncate(text: string, max = 120) {
        if (!text) return ''
        return text.length > max ? text.slice(0, max) + '...' : text
    }

    return (
        <div className="space-y-6">
            {/* Contratos Pré-implementados */}
            <div>
                <label className="block text-white mb-2">Contratos Pré-implementados</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(contracts).map(([key, contract]: [string, any]) => (
                        <div
                            key={key}
                            onClick={() => handleSelectContract(key)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors duration-200
                                        ${selectedContract === key
                                    ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500'
                                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <FileCode className="w-5 h-5 text-slate-400" />
                                <p className="text-white font-medium">{contract.displayName}</p>
                            </div>
                            <p className="text-slate-400 text-sm">{contract.description}</p>
                        </div>
                    ))}
                </div>
            </div>

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
            <Input label="Nome do Contrato"
                value={contractName}
                onChange={setContractName}
                placeholder="Ex: MyToken, NFTContract, SimpleStorage"
                required={true}
                disabled={!!selectedContract} />

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
                    disabled={!!selectedContract}
                    className={`w-full border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-800 border-slate-700
                            ${selectedContract && 'bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 border-slate-700 focus:ring-purple-600 opacity-50 cursor-not-allowed'}`}
                >
                    <option value="cancun">Cancun</option>
                    <option value="shanghai">Shanghai</option>
                    <option value="paris">Paris</option>
                    <option value="london">London</option>
                    <option value="berlin">Berlin</option>
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
                disabled={lastContractDeploy.isDeploing || !rpcConnected}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {lastContractDeploy.isDeploing ? (
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

            {!rpcConnected && (
                <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl mb-4">
                    <p className="text-red-400 font-medium mb-3">
                        Não foi possível conectar ao Rpc Endpoint, verifique sua url. <i>(  {rpcEndpoint}  )</i>
                    </p>
                    <Link
                        href="/blockchain"
                        className="inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                    >
                        Configurar Endpoints
                    </Link>
                </div>)}

            {/* Resultado do Deploy */}
            {lastContractDeploy.errorDeploy && (
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-white mb-1">Erro ao implantar o contrato</p>
                            <p className="text-red-400 text-sm mb-2 line-clamp-2">{truncate(lastContractDeploy.errorDeploy, 300)}</p>
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
                            {JSON.stringify(lastContractDeploy.deployResult, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            {lastContractDeploy.address && !lastContractDeploy.errorDeploy && (
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-white mb-1">Contrato implantado com sucesso!</p>

                            {/* Endereço do contrato */}
                            <p className="text-slate-400 text-sm mb-2">Endereço do contrato:</p>
                            <div className="bg-slate-900 rounded-lg p-3 font-mono text-green-400 break-all">
                                {lastContractDeploy.address}
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
                            {JSON.stringify(lastContractDeploy.deployResult, null, 2)}
                        </pre>
                    )}
                </div>
            )}

        </div>
    );
}