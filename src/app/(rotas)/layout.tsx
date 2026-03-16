import Sidebar from "./Sidebar";
import MetricsProvider from "../../components/metrics/MetricsProvider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto max-w-7xl mx-auto p-6 lg:p-8">
        <MetricsProvider>{children}</MetricsProvider>
      </main>
    </div>
  );
}
