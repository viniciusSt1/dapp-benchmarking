export default function ResultCard({ label, value, icon: Icon, color = "text-purple-400" } : any) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-slate-300">{label}</span>
      </div>
      <p className="text-white text-2xl">{value}</p>
    </div>
  );
}