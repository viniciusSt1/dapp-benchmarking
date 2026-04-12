import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-200">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-950 top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <Image
              src="/next.svg"
              alt="Logo"
              width={90}
              height={24}
              className="dark:invert"
            />
          </div>

          <nav className="flex items-center gap-4">
            <span className="font-semibold text-lg">
              Besu Benchmark Dashboard
            </span>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              Abrir Dashboard
            </Link>

            <a
              href="https://github.com/viniciusSt1/dapp-benchmarking"
              target="_blank"
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Repositório
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-screen flex items-center">

        {/* Background Image */}
        <Image
          src="/images/lp.png"
          alt="Ethereum Background"
          fill
          sizes="100vw"
          priority
          unoptimized
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
              Benchmark e Monitoramento de Redes
              <span className="text-indigo-500"> Hyperledger Besu</span>
            </h1>

            <p className="text-lg text-zinc-300 max-w-xl">
              Plataforma para avaliação de desempenho de redes blockchain baseadas
              em <strong>Hyperledger Besu</strong>, utilizando
              <strong> Hyperledger Caliper</strong> para execução de workloads
              e coleta de métricas em tempo real.
            </p>

            <div className="mt-8 flex gap-4">

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
              >
                Acessar Dashboard
              </Link>

              <a
                href="https://github.com/viniciusSt1/Hyperledger-Besu"
                target="_blank"
                className="px-6 py-3 rounded-lg border border-zinc-600 hover:bg-zinc-900 text-white"
              >
                Criar Rede Besu
              </a>

            </div>
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-semibold mb-12 text-center">
          Funcionalidades da Plataforma
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col gap-4">

            <h3 className="font-semibold text-lg mb-2">
              Execução de Benchmarks
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400">
              Execução automatizada de workloads utilizando
              <strong> Hyperledger Caliper</strong> para medir throughput,
              latência e taxa de sucesso das transações.
            </p>

            <Link
              href="/caliper-tests"
              className="mt-auto self-end px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Executar benchmark
            </Link>

          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col h-full gap-4">

            <h3 className="font-semibold text-lg mb-2">
              Monitoramento em Tempo Real
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400">
              Coleta de métricas diretamente dos nós Besu via
              endpoints RPC e Prometheus para análise de desempenho da rede.
            </p>

            <Link
              href="/blockchain"
              className="mt-auto self-end px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Definir Endpoints
            </Link>

          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col gap-4">

            <h3 className="font-semibold text-lg mb-2">
              Dashboard de Resultados
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400">
              Visualização clara das métricas de performance,
              incluindo TPS, latência e taxa de sucesso das transações.
            </p>

            <Link
              href="/dashboard"
              className="mt-auto self-end px-4 py-1.5 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Ver Monitoramento
            </Link>

          </div>

        </div>

      </section>


      {/* MÉTRICAS */}
      <section className="bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-20">

          <h2 className="text-3xl font-semibold mb-10">
            Métricas Avaliadas
          </h2>

          <div className="grid md:grid-cols-2 gap-12">

            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li>Throughput da rede (TPS)</li>
              <li>Latência mínima, média e máxima</li>
              <li>Número de transações por bloco</li>
              <li>Uso de gás por bloco</li>
            </ul>

            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li>Número de peers conectados</li>
              <li>Tempo médio de geração de blocos</li>
              <li>Quantidade de blocos validados</li>
              <li>Métricas Prometheus da rede</li>
            </ul>

          </div>

        </div>
      </section>


      {/* COMO USAR */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-semibold mb-10">
          Como Utilizar a Plataforma
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <h3 className="font-semibold mb-2">1. Crie sua rede Besu</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Caso ainda não tenha uma rede Besu, crie utilizando o <a
                href="https://github.com/viniciusSt1/Hyperledger-Besu"
                target="_blank"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >repositório disponível no github</a> seguindo as instruções de criação no README.
            </p>
          </div>

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <h3 className="font-semibold mb-2">2. Inicie os nós</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Execute os containers Docker da rede Besu
              e verifique se os endpoints RPC e Metrics
              estão acessíveis.
            </p>
          </div>

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <h3 className="font-semibold mb-2">3. Conecte no Dashboard</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Insira os endpoints RPC, WebSocket e Metrics
              no dashboard e execute os benchmarks.
            </p>
          </div>

        </div>

      </section>


      {/* EXEMPLO DE ENDPOINTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <h2 className="text-3xl font-semibold mb-6">
          Endpoints Utilizados
        </h2>

        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          ⚠️ A aplicação não cria a rede automaticamente.
          É necessário executar sua rede Besu externamente para que o dashboard
          possa se conectar através dos endpoints RPC, WebSocket e Metrics.
          Ao criar a rede através do <a
                href="https://github.com/viniciusSt1/Hyperledger-Besu"
                target="_blank"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >repositório</a> de recomendação, certifique-se de que os nós estejam ativos e minerando corretamente para que as métricas sejam coletadas e os benchmarks possam ser executados com sucesso.
        </p>
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          A rede disponibilizada no repositório do github utiliza os seguintes endpoints por padrão, mas é possível configurar outros endpoints caso necessário.
        </p>

        <div className="bg-zinc-900 text-green-400 p-6 rounded-lg font-mono text-sm mt-6">
          <p className="mb-2">RPC Endpoint: http://localhost:8545 </p>
          <p className="mb-2">WebSocket Endpoint: ws://localhost:8545 </p>
          <p>Metrics Endpoint: http://localhost:9545/metrics</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-zinc-500">

          Besu Benchmark Dashboard — Plataforma para análise de desempenho
          de redes blockchain Hyperledger Besu.

        </div>

      </footer>

    </div>
  );
}