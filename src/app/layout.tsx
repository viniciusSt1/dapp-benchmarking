import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dapp Benchmark Hyperledger Besu",
  description:
    "Deploy de contrato, testes e benchmark com Hyperledger Caliper em rede Besu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
