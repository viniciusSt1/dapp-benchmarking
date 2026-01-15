'use client'

import { useState } from 'react';
import { Upload, CheckCircle2, XCircle, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartContracts() {
  const [contractAddress, setContractAddress] = useState('');
  const [contractName, setContractName] = useState('');
  const [solidityVersion, setSolidityVersion] = useState('0.8.20');
  const [abiText, setAbiText] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAbiText(event.target?.result as string);
        toast.success('ABI carregado com sucesso!');
      };
      reader.readAsText(file);
    }
  };

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleDeploy = () => {
    if (!contractName.trim()) {
      toast.error('Por favor, insira o nome do contrato');
      return;
    }
    
    setIsDeploying(true);
    setTimeout(() => {
      setContractAddress('0x' + Math.random().toString(16).slice(2, 42));
      setIsDeploying(false);
      toast.success('Contrato implantado com sucesso!');
    }, 2000);
  };

  const handleVerify = () => {
    if (!contractAddress || !validateAddress(contractAddress)) {
      toast.error('Endereço de contrato inválido');
      return;
    }
    
    setTimeout(() => {
      setIsVerified(true);
      toast.success('Contrato verificado com sucesso!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Smart Contracts</h2>
        <p className="text-slate-400">Gerencie e implante seus contratos inteligentes</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
        {/* Nome do Contrato */}
        <div>
          <label className="block text-white mb-2">
            Nome do Contrato <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="Ex: MyToken"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Endereço do Contrato */}
        <div>
          <label className="block text-white mb-2">Endereço do Contrato</label>
          <div className="relative">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                contractAddress && validateAddress(contractAddress)
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
            <p className="text-red-400 mt-1">Endereço inválido</p>
          )}
        </div>

        {/* Versão do Solidity */}
        <div>
          <label className="block text-white mb-2">Versão do Solidity</label>
          <select
            value={solidityVersion}
            onChange={(e) => setSolidityVersion(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="0.8.20">0.8.20</option>
            <option value="0.8.19">0.8.19</option>
            <option value="0.8.18">0.8.18</option>
            <option value="0.8.17">0.8.17</option>
            <option value="0.7.6">0.7.6</option>
          </select>
        </div>

        {/* ABI do Contrato */}
        <div>
          <label className="block text-white mb-2">ABI do Contrato</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="abi-upload"
              />
              <label
                htmlFor="abi-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload JSON
              </label>
              <span className="text-slate-400 flex items-center">ou cole o ABI abaixo</span>
            </div>
            <textarea
              value={abiText}
              onChange={(e) => setAbiText(e.target.value)}
              placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"}]'
              rows={8}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none font-mono"
            />
          </div>
        </div>

        {/* Status de Verificação */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <>
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-white">Contrato Verificado</p>
                  <p className="text-slate-400">Código-fonte verificado no explorer</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-white">Não Verificado</p>
                  <p className="text-slate-400">Contrato não verificado</p>
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

        {/* Gas Estimado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-slate-400">Gas Estimado</p>
            </div>
            <p className="text-white">~2,500,000</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 mb-2">Custo (ETH)</p>
            <p className="text-white">~0.05 ETH</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 mb-2">Custo (USD)</p>
            <p className="text-white">~$125.00</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Implantando...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Deploy Contract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
