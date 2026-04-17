'use client';
import { Book, CheckCircle2, ChevronDown, Edit, Play, ShieldCheck, Upload, XCircle } from 'lucide-react';
import { BrowserProvider, Contract, JsonRpcProvider, Wallet } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/src/store/useAppStore';
import Link from 'next/link';

interface ContractFunction {
    key: string;
    name: string;
    type: 'read' | 'write';
    stateMutability: string;
    inputs: { name: string; type: string }[];
    outputs?: { type: string }[];
}

export default function Functions() {
    const [filter, setFilter] = useState<'all' | 'read' | 'write'>('all');

    const {
        contractAddress,
        abiText,
        isVerified,
        functions,
        inputValues,
        functionResults,
        loadingFunction,
    } = useAppStore((state) => state.contractFunctions);

    const setContractFunctions = useAppStore((state) => state.setContractFunctions);
    const { privateKey, publicKey } = useAppStore((state) => state.wallet);
    const rpcEndpoint = useAppStore((state) => state.blockchain.rpcEndpoint);
    const rpcConnected = useAppStore((state) => state.blockchain.rpcEndpointConnected);

    const handleClear = () => {
        setContractFunctions({
            contractAddress: '',
            abiText: '',
            isVerified: false,
            functions: [],
            inputValues: {},
            functionResults: {},
            loadingFunction: null,
        });
    };

    const validateAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

    useEffect(() => {
        if (!rpcConnected) {
            handleClear();
        }
    }, []);

    const parseAbi = (text: string) => {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
            throw new Error('ABI inválida');
        }

        return parsed
            .filter((item: any) => item.type === 'function')
            .map((item: any, index: number) => ({
                key: `${item.name}-${index}`,
                name: item.name,
                type: item.stateMutability === 'view' || item.stateMutability === 'pure' ? 'read' : 'write',
                stateMutability: item.stateMutability || 'nonpayable',
                inputs: item.inputs || [],
                outputs: item.outputs || [],
            })) as ContractFunction[];
    };

    const handleAbiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setContractFunctions({ abiText: content });
            try {
                const parsedFunctions = parseAbi(content);
                setContractFunctions({ functions: parsedFunctions });
                toast.success('ABI carregada e funções extraídas com sucesso!');
            } catch {
                toast.error('Erro ao processar ABI');
            }
        };
        reader.readAsText(file);
    };

    const handleAbiTextChange = (text: string) => {
        setContractFunctions({ abiText: text });
        if (!text.trim()) {
            setContractFunctions({ functions: [] });
            return;
        }

        try {
            const parsedFunctions = parseAbi(text);
            setContractFunctions({ functions: parsedFunctions });
        } catch {
            setContractFunctions({ functions: [] });
        }
    };

    const handleVerify = async () => {
        if (!contractAddress || !validateAddress(contractAddress)) {
            toast.error('Endereço de contrato inválido');
            return;
        }

        if (!abiText.trim()) {
            toast.error('Por favor, forneça a ABI do contrato');
            return;
        }

        try {
            // Primeiro, verificar se o contrato existe na rede
            const provider = getProvider();
            const code = await provider.getCode(contractAddress);

            if (code === '0x') {
                toast.error('Nenhum contrato encontrado neste endereço na rede');
                return;
            }

            // Tentar parsear a ABI
            const parsedFunctions = parseAbi(abiText);
            if (parsedFunctions.length === 0) {
                toast.error('A ABI não contém funções públicas.');
                return;
            }

            setContractFunctions({ functions: parsedFunctions, isVerified: true });
            toast.success('Contrato verificado e validado na rede!');
        } catch (error: any) {
            toast.error(`Erro ao verificar contrato`);
        }
    };

    const getProvider = () => {
        if (rpcEndpoint) {
            return new JsonRpcProvider(rpcEndpoint);
        }

        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            throw new Error('Nenhum provedor disponível para leitura de contrato.');
        }

        return new BrowserProvider(ethereum);
    };

    const getContract = async (useSigner: boolean) => {
        if (!validateAddress(contractAddress)) {
            throw new Error('Endereço de contrato inválido');
        }

        const provider = getProvider();
        const abi = JSON.parse(abiText);

        if (useSigner) {
            if (!privateKey) {
                throw new Error('Chave privada não configurada.');
            }
            const wallet = new Wallet(privateKey, provider);
            return new Contract(contractAddress, abi, wallet);
        }

        return new Contract(contractAddress, abi, provider);
    };

    const parseInputValue = (type: string, value: string): any => {
        const trimmed = value.trim();

        if (type.endsWith('[]')) {
            return trimmed.length === 0 ? [] : trimmed.split(',').map((item) => parseInputValue(type.replace(/\[\]$/, ''), item.trim()));
        }

        if (type.startsWith('uint') || type.startsWith('int')) {
            return trimmed;
        }

        if (type === 'bool') {
            return trimmed.toLowerCase() === 'true';
        }

        return trimmed;
    };

    const handleInputChange = (funcKey: string, inputIndex: number, value: string) => {
        const current = inputValues[funcKey] ?? [];
        const next = [...current];
        next[inputIndex] = value;
        setContractFunctions({ inputValues: { ...inputValues, [funcKey]: next } });
    };

    const formatResult = (result: any) => {
        if (result === undefined || result === null) return 'Nenhum resultado retornado.';
        if (typeof result === 'string') return result;
        if (typeof result === 'bigint') return result.toString();
        if (typeof result === 'object') {
            try {
                return JSON.stringify(result, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2);
            } catch {
                return String(result);
            }
        }
        return String(result);
    };

    const executeFunction = async (func: ContractFunction) => {
        if (loadingFunction) {
            toast.error('Aguarde a conclusão da outra operação.');
            return;
        }

        setContractFunctions({ loadingFunction: func.key, functionResults: { ...functionResults, [func.key]: '' } });

        try {
            const contract = await getContract(func.type === 'write');
            const args = (func.inputs || []).map((input, idx) => {
                const value = inputValues[func.key]?.[idx] ?? '';
                return parseInputValue(input.type, value);
            });

            if (func.type === 'read') {
                const result = await contract[func.name](...args);
                setContractFunctions({ functionResults: { ...functionResults, [func.key]: formatResult(result) } });
                toast.success('Consulta realizada com sucesso!');
            } else {
                if (!privateKey) {
                    throw new Error('Chave privada não configurada.');
                }
                const tx = await contract[func.name](...args);
                const receipt = await tx.wait();
                setContractFunctions({ functionResults: { ...functionResults, [func.key]: `Transação enviada\nHash: ${tx.hash}\nStatus: ${receipt.status}` } });
                toast.success('Transação enviada com sucesso!');
            }
        } catch (error: any) {
            const message = error?.message ?? 'Erro ao executar a função';
            setContractFunctions({ functionResults: { ...functionResults, [func.key]: `Erro: ${message}` } });
            toast.error(message);
        } finally {
            setContractFunctions({ loadingFunction: null });
        }
    };

    const filteredFunctions = filter === 'all' ? functions : functions.filter((f) => f.type === filter);

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-white mb-2">
                    Endereço do Contrato <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractFunctions({ contractAddress: e.target.value })}
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

            <div>
                <label className="block text-white mb-2">
                    ABI do Contrato <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleAbiFileUpload}
                        className="hidden"
                        id="abi-upload"
                    />
                    <label
                        htmlFor="abi-upload"
                        className={`flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${abiText
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                            }`}
                    >
                        {abiText ? (
                            <>
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <div className="text-center">
                                    <p className="text-white">ABI carregada</p>
                                    <p className="text-slate-400 text-sm">Clique para alterar</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-slate-400" />
                                <div className="text-center">
                                    <p className="text-white">Clique para fazer upload da ABI</p>
                                    <p className="text-slate-400 text-sm">Ou arraste e solte aqui</p>
                                </div>
                            </>
                        )}
                    </label>
                    <span className="text-slate-400 flex items-center">ou cole a ABI abaixo</span>
                    <textarea
                        value={abiText}
                        onChange={(e) => handleAbiTextChange(e.target.value)}
                        placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"}]'
                        rows={6}
                        className="custom-scrollbar w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none font-mono text-sm overflow-y-auto"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 text-sm">
                        {publicKey ? `Carteira: ${publicKey}` : 'Chave privada não configurada no Zustand'}
                    </div>
                    {(contractAddress || abiText || isVerified) && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Limpar
                        </button>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={handleVerify}
                            disabled={
                                !contractAddress ||
                                !validateAddress(contractAddress) ||
                                !abiText.trim() ||
                                !rpcConnected
                            }
                            className="px-8 py-2 text-white rounded-lg transition-colors
                                bg-gradient-to-r from-purple-600 to-purple-700
                                hover:from-purple-700 hover:to-purple-800
                                disabled:from-purple-800 disabled:to-purple-900
                                disabled:cursor-not-allowed"
                        >
                            Verificar Contrato
                        </button>
                    </div>
                </div>
            </div>

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

            {isVerified && functions.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                        <h3 className="text-white">Funções do Contrato</h3>
                        <div className="flex gap-2 flex-wrap">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFunctions.map((func) => (
                            <div key={func.key} className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors">
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
                                </div>

                                <div className="space-y-3 px-6 pb-4 pt-2">
                                    {func.inputs.length > 0 ? (
                                        func.inputs.map((input, inputIndex) => (
                                            <label key={inputIndex} className="block text-white text-sm">
                                                <span className="text-slate-400 text-xs uppercase tracking-[0.1em]">{input.name || `arg${inputIndex}`} — {input.type}</span>
                                                <input
                                                    type="text"
                                                    value={inputValues[func.key]?.[inputIndex] || ''}
                                                    onChange={(e) => handleInputChange(func.key, inputIndex, e.target.value)}
                                                    placeholder={input.type.includes('[]') ? 'valor1, valor2, valor3' : 'Digite o valor aqui'}
                                                    className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                />
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm">Nenhum parâmetro necessário.</p>
                                    )}

                                    <button
                                        disabled={loadingFunction === func.key}
                                        onClick={() => executeFunction(func)}
                                        className={`w-full px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${func.type === 'read'
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-orange-600 hover:bg-orange-700'
                                            } ${loadingFunction === func.key ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <Play className="w-4 h-4" />
                                        {func.type === 'read' ? 'Consultar' : 'Executar Transação'}
                                    </button>

                                    {functionResults[func.key] && (
                                        <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-950/80 border border-slate-700 p-3 text-xs text-slate-200">{functionResults[func.key]}</pre>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
