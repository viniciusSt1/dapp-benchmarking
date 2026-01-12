"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    Activity
} from "lucide-react";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/project-info", label: "Informações do Projeto", icon: Info },
    { href: "/blockchain", label: "Configuração Blockchain", icon: Network },
    { href: "/contracts", label: "Smart Contracts", icon: FileCode },
    { href: "/wallet", label: "Carteira", icon: Wallet },
    { href: "/transactions", label: "Transações", icon: Receipt },
    { href: "/functions", label: "Funções do Contrato", icon: Code2 },
    { href: "/caliper-tests", label: "Testes Caliper", icon: Activity },
    { href: "/settings", label: "Configurações Avançadas", icon: Settings },
    { href: "/security", label: "Segurança", icon: Shield },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
            <nav className="flex-1 p-4">
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
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-purple-600 text-white"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
