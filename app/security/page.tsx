'use client'

import { Shield, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Lock } from 'lucide-react';

export default function Security() {
  const permissions = [
    { name: 'Leitura de Saldo', status: 'granted', risk: 'low' },
    { name: 'Assinatura de Mensagens', status: 'granted', risk: 'medium' },
    { name: 'Envio de Transações', status: 'granted', risk: 'high' },
    { name: 'Modificação de Allowances', status: 'pending', risk: 'high' },
  ];

  const securityChecks = [
    {
      title: 'Contrato Auditado',
      status: 'pass',
      description: 'Auditoria de segurança realizada por CertiK',
      date: '15/11/2024',
    },
    {
      title: 'Código-fonte Verificado',
      status: 'pass',
      description: 'Código verificado no Etherscan',
      date: '10/11/2024',
    },
    {
      title: 'Multisig Ativo',
      status: 'warning',
      description: '2 de 3 assinaturas necessárias',
      date: '-',
    },
    {
      title: 'Timelock Configurado',
      status: 'fail',
      description: 'Nenhum timelock configurado para mudanças críticas',
      date: '-',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: string) => {
    const styles = {
      low: 'bg-green-600/20 text-green-400 border-green-600/30',
      medium: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      high: 'bg-red-600/20 text-red-400 border-red-600/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full border ${styles[risk as keyof typeof styles]}`}>
        {risk === 'low' ? 'Baixo Risco' : risk === 'medium' ? 'Médio Risco' : 'Alto Risco'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Segurança</h2>
        <p className="text-slate-400">Informações de segurança e auditoria do seu dApp</p>
      </div>

      {/* Status Geral de Segurança */}
      <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">Status de Segurança: Bom</h3>
            <p className="text-green-200">
              Seu dApp possui boas práticas de segurança implementadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-white mb-1">Score de Segurança</div>
            <div className="text-green-400">8.5/10</div>
          </div>
        </div>
      </div>

      {/* Verificações de Segurança */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Verificações de Segurança</h3>
        <div className="space-y-4">
          {securityChecks.map((check, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white">{check.title}</h4>
                    {check.status === 'pass' && (
                      <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                        Aprovado
                      </span>
                    )}
                    {check.status === 'warning' && (
                      <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                        Atenção
                      </span>
                    )}
                    {check.status === 'fail' && (
                      <span className="px-2 py-0.5 bg-red-600/20 text-red-400 rounded text-xs">
                        Falhou
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mb-1">{check.description}</p>
                  {check.date !== '-' && (
                    <p className="text-slate-500">Data: {check.date}</p>
                  )}
                </div>
              </div>
              {check.status === 'pass' && (
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Permissões Solicitadas */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-purple-400" />
          <h3 className="text-white">Permissões Solicitadas</h3>
        </div>
        <div className="space-y-3">
          {permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-white mb-1">{permission.name}</p>
                <p className="text-slate-400">
                  {permission.status === 'granted' ? 'Permissão concedida' : 'Aguardando aprovação'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getRiskBadge(permission.risk)}
                {permission.status === 'granted' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avisos de Segurança */}
      <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-xl p-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="text-white mb-2">Avisos de Segurança</h3>
            <ul className="space-y-2 text-yellow-200">
              <li>• Sempre verifique os endereços de contrato antes de interagir</li>
              <li>• Nunca compartilhe suas chaves privadas ou frases de recuperação</li>
              <li>• Revise cuidadosamente todas as transações antes de assinar</li>
              <li>• Use carteiras de hardware para grandes quantidades</li>
              <li>• Mantenha seu software de carteira sempre atualizado</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Relatórios de Auditoria */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white mb-4">Relatórios de Auditoria</h3>
        <div className="space-y-3">
          {[
            { auditor: 'CertiK', date: '15/11/2024', score: '9.2/10', status: 'Aprovado' },
            { auditor: 'OpenZeppelin', date: '01/11/2024', score: '8.8/10', status: 'Aprovado' },
            { auditor: 'Trail of Bits', date: '20/10/2024', score: '8.5/10', status: 'Aprovado' },
          ].map((audit, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white">{audit.auditor}</p>
                  <p className="text-slate-400">{audit.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white">{audit.score}</p>
                  <p className="text-green-400">{audit.status}</p>
                </div>
                <a
                  href="#"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Ver Relatório
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
