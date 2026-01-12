import { 
  LayoutDashboard, 
  Info, 
  Network, 
  FileCode, 
  Wallet, 
  Receipt, 
  Code2, 
  Settings, 
  Shield,
  Blocks,
  Activity
} from 'lucide-react';
import type { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'project-info' as ViewType, label: 'Informações do Projeto', icon: Info },
  { id: 'blockchain' as ViewType, label: 'Configuração Blockchain', icon: Network },
  { id: 'contracts' as ViewType, label: 'Smart Contracts', icon: FileCode },
  { id: 'wallet' as ViewType, label: 'Carteira', icon: Wallet },
  { id: 'transactions' as ViewType, label: 'Transações', icon: Receipt },
  { id: 'functions' as ViewType, label: 'Funções do Contrato', icon: Code2 },
  { id: 'caliper-tests' as ViewType, label: 'Testes Caliper', icon: Activity },
  { id: 'settings' as ViewType, label: 'Configurações Avançadas', icon: Settings },
  { id: 'security' as ViewType, label: 'Segurança', icon: Shield },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br to-blue-600 rounded-lg flex items-center justify-center">
            <img src="https://www.cpqd.com.br/wp-content/uploads/2022/12/CPQD_Logo_Positivo_RGB-1030x368-1.webp"></img>
          </div>
          <div>
            <h1 className="text-white">dApp Aplicativo</h1>
            <p className="text-slate-400">Blockchain Cpqd</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 mb-2">Status da Rede</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white">Conectado</span>
          </div>
        </div>
      </div>
    </aside>
  );
}