import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProjectInfo } from './components/ProjectInfo';
import { BlockchainConfig } from './components/BlockchainConfig';
import { SmartContracts } from './components/SmartContracts';
import { WalletSection } from './components/WalletSection';
import { Transactions } from './components/Transactions';
import { ContractFunctions } from './components/ContractFunctions';
import { Dashboard } from './components/Dashboard';
import { AdvancedSettings } from './components/AdvancedSettings';
import { Security } from './components/Security';
import { CaliperTests } from './components/CaliperTests';
import { Toaster } from 'sonner@2.0.3';

export type ViewType = 
  | 'dashboard'
  | 'project-info'
  | 'blockchain'
  | 'contracts'
  | 'wallet'
  | 'transactions'
  | 'functions'
  | 'settings'
  | 'security'
  | 'caliper-tests';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'project-info':
        return <ProjectInfo />;
      case 'blockchain':
        return <BlockchainConfig />;
      case 'contracts':
        return <SmartContracts />;
      case 'wallet':
        return <WalletSection />;
      case 'transactions':
        return <Transactions />;
      case 'functions':
        return <ContractFunctions />;
      case 'settings':
        return <AdvancedSettings />;
      case 'security':
        return <Security />;
      case 'caliper-tests':
        return <CaliperTests />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Toaster position="top-right" theme="dark" />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}