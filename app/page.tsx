import Image from "next/image";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 gap-20 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={10}
          priority
        />
        <p>Inicio projeto Benchmark utilizando Next</p>
        <a className="px-4 py-2 rounded-lg bg-indigo-600 text-white" href="rota1">Ir para rota1</a>
      </main>
    </div>
  );
}
