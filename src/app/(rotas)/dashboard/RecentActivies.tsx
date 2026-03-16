export default function RecentActivities() {
    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-white mb-4">Atividades Recentes (apenas frontend no momento aqui, fazer depois)</h3>
            <div className="space-y-4">
                {[
                    { action: 'Deploy de Contrato', time: '2 min atrás', status: 'success' },
                    { action: 'Transação Confirmada', time: '15 min atrás', status: 'success' },
                    { action: 'Carteira Conectada', time: '1 hora atrás', status: 'info' },
                    { action: 'Falha na Transação', time: '2 horas atrás', status: 'error' },
                    { action: 'Verificação de Contrato', time: '3 horas atrás', status: 'success' },
                ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' :
                                activity.status === 'error' ? 'bg-red-500' :
                                    'bg-blue-500'
                                }`} />
                            <span className="text-white">{activity.action}</span>
                        </div>
                        <span className="text-slate-400">{activity.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
