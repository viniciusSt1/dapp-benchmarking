import { useState } from 'react';
import { 
  Play, 
  Square, 
  Download, 
  Clock, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Settings2,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

// Mock data para resultados de benchmark
const tpsData = [
  { time: '0s', tps: 0 },
  { time: '10s', tps: 145 },
  { time: '20s', tps: 289 },
  { time: '30s', tps: 312 },
  { time: '40s', tps: 298 },
  { time: '50s', tps: 325 },
  { time: '60s', tps: 315 },
];

const latencyData = [
  { metric: 'Min', value: 12 },
  { metric: 'Avg', value: 45 },
  { metric: 'Max', value: 156 },
  { metric: 'P95', value: 98 },
  { metric: 'P99', value: 132 },
];

const testScenarios = [
  { id: 1, name: 'Token Transfer Test', duration: '60s', txCount: 1000, status: 'completed' },
  { id: 2, name: 'Smart Contract Deployment', duration: '120s', txCount: 500, status: 'completed' },
  { id: 3, name: 'Query Performance Test', duration: '90s', txCount: 2000, status: 'running' },
  { id: 4, name: 'Load Stress Test', duration: '180s', txCount: 5000, status: 'pending' },
];

export function CaliperTests() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState('transfer');

  const handleStartTest = () => {
    setIsRunning(true);
    setProgress(0);
    toast.success('Teste de benchmark iniciado com Hyperledger Caliper');
    
    // Simular progresso do teste
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          toast.success('Teste concluído com sucesso!');
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const handleStopTest = () => {
    setIsRunning(false);
    setProgress(0);
    toast.info('Teste interrompido');
  };

  const handleDownloadReport = () => {
    toast.success('Relatório de benchmark baixado');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Testes de Performance - Hyperledger Caliper</h2>
        <p className="text-slate-400">Execute benchmarks e análises de performance da sua blockchain</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">TPS Médio</p>
                <p className="text-white">305 tx/s</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Latência Média</p>
                <p className="text-white">45 ms</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Taxa de Sucesso</p>
                <p className="text-white">99.8%</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Testes Executados</p>
                <p className="text-white">127</p>
              </div>
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Configuração do Teste */}
        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Configurar Teste de Benchmark</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome do Teste</Label>
                  <Input 
                    placeholder="Meu Teste de Performance"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Cenário</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="transfer">Token Transfer</SelectItem>
                      <SelectItem value="deploy">Smart Contract Deploy</SelectItem>
                      <SelectItem value="query">Query Performance</SelectItem>
                      <SelectItem value="stress">Stress Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Número de Transações</Label>
                  <Input 
                    type="number"
                    placeholder="1000"
                    defaultValue="1000"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Duração (segundos)</Label>
                  <Input 
                    type="number"
                    placeholder="60"
                    defaultValue="60"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Taxa de Envio (TPS)</Label>
                  <Input 
                    type="number"
                    placeholder="100"
                    defaultValue="100"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Workers</Label>
                  <Input 
                    type="number"
                    placeholder="5"
                    defaultValue="5"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Configuração Customizada (YAML)</Label>
                <Textarea 
                  placeholder="Adicione configurações customizadas em formato YAML..."
                  className="bg-slate-800 border-slate-700 text-white font-mono h-32"
                />
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Progresso do Teste</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-3">
                {!isRunning ? (
                  <Button 
                    onClick={handleStartTest}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Teste
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopTest}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Parar Teste
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  Configurações Avançadas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cenários de Teste */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Cenários de Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testScenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white">{scenario.name}</h4>
                          <Badge 
                            variant={
                              scenario.status === 'completed' ? 'default' :
                              scenario.status === 'running' ? 'secondary' :
                              'outline'
                            }
                            className={
                              scenario.status === 'completed' ? 'bg-green-600/20 text-green-400 border-green-600/30' :
                              scenario.status === 'running' ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' :
                              'bg-slate-600/20 text-slate-400 border-slate-600/30'
                            }
                          >
                            {scenario.status === 'completed' ? 'Concluído' :
                             scenario.status === 'running' ? 'Em Execução' :
                             'Pendente'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {scenario.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {scenario.txCount} transações
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {scenario.status === 'completed' && (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                        {scenario.status === 'running' && (
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        )}
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700"
                        >
                          {scenario.status === 'completed' ? 'Ver Resultados' : 
                           scenario.status === 'running' ? 'Pausar' : 
                           'Executar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resultados */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Throughput (TPS)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={tpsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tps" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      dot={{ fill: '#a855f7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Latência (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="metric" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Detalhadas */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Métricas Detalhadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-slate-400">Throughput</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Máximo TPS:</span>
                      <span className="text-white">325 tx/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Médio TPS:</span>
                      <span className="text-white">305 tx/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Mínimo TPS:</span>
                      <span className="text-white">145 tx/s</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-slate-400">Latência</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Mínima:</span>
                      <span className="text-white">12 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Média:</span>
                      <span className="text-white">45 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Máxima:</span>
                      <span className="text-white">156 ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-slate-400">Recursos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">CPU Médio:</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Memória:</span>
                      <span className="text-white">2.3 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">I/O Disk:</span>
                      <span className="text-white">128 MB/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Relatórios de Benchmark</CardTitle>
              <Button 
                onClick={handleDownloadReport}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Token Transfer Test - 12/01/2026', size: '2.4 MB', format: 'HTML', status: 'success' },
                  { name: 'Smart Contract Deployment - 11/01/2026', size: '1.8 MB', format: 'JSON', status: 'success' },
                  { name: 'Query Performance Test - 10/01/2026', size: '3.1 MB', format: 'HTML', status: 'success' },
                  { name: 'Load Stress Test - 09/01/2026', size: '4.5 MB', format: 'PDF', status: 'warning' },
                ].map((report, index) => (
                  <div 
                    key={index}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {report.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                      <div>
                        <h4 className="text-white mb-1">{report.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>{report.size}</span>
                          <span>•</span>
                          <Badge variant="outline" className="bg-slate-700/50">
                            {report.format}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700"
                      onClick={handleDownloadReport}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Caliper */}
          <Card className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-purple-600/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white mb-2">Sobre o Hyperledger Caliper</h4>
                  <p className="text-slate-300 mb-4">
                    O Hyperledger Caliper é uma ferramenta de benchmark que permite medir o desempenho de implementações blockchain. 
                    Ele testa métricas como taxa de transações (TPS), latência, e uso de recursos.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                      Suporte Multi-Blockchain
                    </Badge>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                      Testes Customizáveis
                    </Badge>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                      Relatórios Detalhados
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
