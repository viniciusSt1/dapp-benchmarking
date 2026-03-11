import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Graphic({children, title, color, type, values}: {children: React.ReactNode, title: string, color: string, type: string, values: any[]}) {
    return (    // !! NÃO INCLUIDO NO PAGE, AJUSTAR
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                    {children}
                </div>
                <div>
                    <h3 className="text-white">{title}</h3>
                    <p className="text-sm text-slate-400">Atualização em tempo real</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={values}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    {type === 'line' && (
                        <Line
                            type="monotone"
                            dataKey="txCount"
                            stroke={color}
                            strokeWidth={2}
                        />
                    )}
                    {type === 'bar' && (
                        <Bar
                            dataKey="txCount"
                            fill={color}
                        />
                    )}
                    {type === 'area' && (
                        <Area
                            type="monotone"
                            dataKey="txCount"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.3}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}