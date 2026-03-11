import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import MetricsProvider from "../components/metrics/MetricsProvider";
/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  title: "Dapp Benchmark Hyperledger Besu",
  description: "faz deploy de contrato, testa função de contrato, faz benchmark com caliper, tudo na rede besu :D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex bg-slate-950 min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto max-w-7xl mx-auto p-6 lg:p-8">
            <MetricsProvider>{children}</MetricsProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
