'use client';
import { CheckCircle2, XCircle, Book, Edit, ChevronDown, Play, Zap, Upload, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContractFunction {
    name: string;
    type: 'read' | 'write';
    inputs: { name: string; type: string }[];
    outputs?: { type: string }[];
}

export default function Functions() {   // !!!!!!!!!!!! IMPLEMENTAR FUTURAMENTE !!!!!!!!!!!!!!!
    const [contractAddress, setContractAddress] = useState('');
    const [abiText, setAbiText] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [functions, setFunctions] = useState<ContractFunction[]>([]);
    const [filter, setFilter] = useState<'all' | 'read' | 'write'>('all');

    const validateAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
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


    const filteredFunctions = filter === 'all'
        ? functions
        : functions.filter(f => f.type === filter);

    return (
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
    );
}