import { useState } from 'react';
import { Play, Book, Edit, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContractFunction {
  name: string;
  type: 'read' | 'write';
  inputs: { name: string; type: string }[];
  outputs?: { type: string }[];
}

const mockFunctions: ContractFunction[] = [
  {
    name: 'balanceOf',
    type: 'read',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'totalSupply',
    type: 'read',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'write',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'approve',
    type: 'write',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'allowance',
    type: 'read',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
];

export function ContractFunctions() {
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'read' | 'write'>('all');

  const filteredFunctions = filter === 'all' 
    ? mockFunctions 
    : mockFunctions.filter(f => f.type === filter);

  const handleExecute = async () => {
    if (!selectedFunction) return;

    setIsExecuting(true);
    setOutput('');

    // Simulando execução
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

  const estimatedGas = selectedFunction?.type === 'write' ? '45,000' : '0';
  const estimatedCost = selectedFunction?.type === 'write' ? '~$2.25' : 'Free';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Funções do Smart Contract</h2>
        <p className="text-slate-400">Interaja com as funções do seu contrato</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Funções */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div className="flex gap-2 mb-4">
              {['all', 'read', 'write'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                    filter === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'read' ? 'Read' : 'Write'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredFunctions.map((func, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedFunction(func);
                    setInputValues({});
                    setOutput('');
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedFunction?.name === func.name
                      ? 'bg-purple-600/20 border-2 border-purple-600'
                      : 'bg-slate-800 hover:bg-slate-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-mono">{func.name}</span>
                    {func.type === 'read' ? (
                      <Book className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Edit className="w-4 h-4 text-orange-400" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    func.type === 'read'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-orange-600/20 text-orange-400'
                  }`}>
                    {func.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes e Execução */}
        <div className="lg:col-span-2">
          {selectedFunction ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white mb-1 font-mono">{selectedFunction.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full ${
                    selectedFunction.type === 'read'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                  }`}>
                    {selectedFunction.type === 'read' ? 'Read Function' : 'Write Function'}
                  </span>
                </div>
                
                {selectedFunction.type === 'write' && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <Zap className="w-4 h-4" />
                      <span>Gas Estimado</span>
                    </div>
                    <p className="text-white">{estimatedGas}</p>
                    <p className="text-slate-400">{estimatedCost}</p>
                  </div>
                )}
              </div>

              {/* Parâmetros de Entrada */}
              {selectedFunction.inputs.length > 0 && (
                <div>
                  <label className="block text-white mb-3">Parâmetros de Entrada</label>
                  <div className="space-y-3">
                    {selectedFunction.inputs.map((input, index) => (
                      <div key={index}>
                        <label className="block text-slate-400 mb-1">
                          {input.name} <span className="text-purple-400">({input.type})</span>
                        </label>
                        <input
                          type="text"
                          value={inputValues[input.name] || ''}
                          onChange={(e) =>
                            setInputValues({ ...inputValues, [input.name]: e.target.value })
                          }
                          placeholder={`Enter ${input.type}`}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão Executar */}
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className={`w-full px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                  selectedFunction.type === 'read'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {selectedFunction.type === 'read' ? 'Query' : 'Executar Transação'}
                  </>
                )}
              </button>

              {/* Resultado */}
              {output && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <label className="block text-slate-400 mb-2">
                    {selectedFunction.type === 'read' ? 'Resultado' : 'Hash da Transação'}
                  </label>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-green-400 break-all">
                    {output}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400">
                Selecione uma função na lista ao lado para interagir
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
