import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Funnel,
  FunnelChart,
  LabelList
} from 'recharts'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  PieChartIcon,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import type { CaptationSite, CaptationStats } from '@/types/captation'

interface CaptationAnalyticsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: CaptationStats | null
  sites: CaptationSite[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#6B7280',
  to_send: '#F59E0B',
  accepted: '#10B981',
  rejected: '#EF4444',
  in_progress: '#3B82F6',
  paid: '#8B5CF6',
  contact_no_site: '#06B6D4'
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  to_send: 'A Enviar',
  accepted: 'Aceita',
  rejected: 'Negada',
  in_progress: 'Em Execução',
  paid: 'Pago',
  contact_no_site: 'Entrar em Contato (Sem site)'
}

export const CaptationAnalytics = ({ open, onOpenChange, stats, sites }: CaptationAnalyticsProps) => {
  const [loading, setLoading] = useState(false)
  
  if (!stats) return null

  // Dados para o gráfico de funil
  const funnelData = [
    { name: 'Pendente', value: stats.pending_proposals, fill: STATUS_COLORS.pending },
    { name: 'Entrar em Contato (Sem site)', value: stats.contact_no_site_proposals, fill: STATUS_COLORS.contact_no_site },
    { name: 'A Enviar', value: stats.to_send_proposals, fill: STATUS_COLORS.to_send },
    { name: 'Aceita', value: stats.accepted_proposals, fill: STATUS_COLORS.accepted },
    { name: 'Em Execução', value: stats.in_progress_proposals, fill: STATUS_COLORS.in_progress },
    { name: 'Pago', value: stats.paid_proposals, fill: STATUS_COLORS.paid },
  ].filter(item => item.value > 0)

  // Dados para gráfico de pizza por status
  const statusPieData = [
    { name: 'Pendente', value: stats.pending_proposals, fill: STATUS_COLORS.pending },
    { name: 'Entrar em Contato (Sem site)', value: stats.contact_no_site_proposals, fill: STATUS_COLORS.contact_no_site },
    { name: 'A Enviar', value: stats.to_send_proposals, fill: STATUS_COLORS.to_send },
    { name: 'Aceita', value: stats.accepted_proposals, fill: STATUS_COLORS.accepted },
    { name: 'Negada', value: stats.rejected_proposals, fill: STATUS_COLORS.rejected },
    { name: 'Em Execução', value: stats.in_progress_proposals, fill: STATUS_COLORS.in_progress },
    { name: 'Pago', value: stats.paid_proposals, fill: STATUS_COLORS.paid },
  ].filter(item => item.value > 0)

  // Dados por categoria (top 8)
  const categoryData = stats.sites_by_category.slice(0, 8).map(cat => ({
    name: cat.category_name.length > 15 ? cat.category_name.slice(0, 12) + '...' : cat.category_name,
    value: cat.count,
    fill: cat.category_color
  }))

  // Dados por cidade (top 8)
  const cityData = stats.sites_by_city.slice(0, 8).map(city => ({
    name: city.city_name.length > 15 ? city.city_name.slice(0, 12) + '...' : city.city_name,
    value: city.count
  }))

  // Evolução mensal (simulada baseada nos dados existentes - pode ser melhorada com dados reais)
  const getMonthlyData = () => {
    const monthCounts: Record<string, number> = {}
    
    sites.forEach(site => {
      if (site.created_at) {
        const date = new Date(site.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
      }
    })

    const sortedMonths = Object.keys(monthCounts).sort()
    return sortedMonths.slice(-6).map(month => {
      const [year, monthNum] = month.split('-')
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'short' })
      return {
        name: `${monthName}/${year.slice(-2)}`,
        captações: monthCounts[month]
      }
    })
  }

  const monthlyData = getMonthlyData()

  // Métricas calculadas
  const averageValue = stats.paid_proposals > 0 
    ? stats.total_paid_value / stats.paid_proposals 
    : 0

  const successRate = stats.total_sites > 0 
    ? ((stats.accepted_proposals + stats.in_progress_proposals + stats.paid_proposals) / stats.total_sites * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Analytics de Captação
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Visualize métricas e tendências da sua base de captação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Total Sites</p>
                    <p className="text-2xl font-bold text-blue-300">{stats.total_sites}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-emerald-300">{successRate.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400 font-medium">Valor Total</p>
                    <p className="text-2xl font-bold text-purple-300">
                      R$ {stats.total_paid_value.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-400 font-medium">Ticket Médio</p>
                    <p className="text-2xl font-bold text-amber-300">
                      R$ {averageValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de pizza - Status */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                  <PieChartIcon className="w-4 h-4" />
                  Distribuição por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value, 'Quantidade']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => <span className="text-xs">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de barras - Categorias */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                  <BarChart3 className="w-4 h-4" />
                  Top Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Sites']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de linha - Evolução mensal */}
            {monthlyData.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                    <TrendingUp className="w-4 h-4" />
                    Evolução Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Captações']}
                        contentStyle={{ borderRadius: '8px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="captações" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Gráfico de barras - Cidades */}
            {cityData.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                    <BarChart3 className="w-4 h-4" />
                    Top Cidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={cityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Sites']}
                        contentStyle={{ borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo do funil */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white">Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
                {funnelData.map((item, index) => (
                  <div key={item.name} className="flex items-center flex-1 min-w-[100px]">
                    <div 
                      className="flex-1 text-center p-3 rounded-lg"
                      style={{ backgroundColor: `${item.fill}20` }}
                    >
                      <p className="text-2xl font-bold" style={{ color: item.fill }}>
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-400">{item.name}</p>
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="text-slate-500 px-2">→</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-purple-400">{stats.rejected_proposals}</strong> propostas foram negadas 
                  ({stats.total_sites > 0 ? ((stats.rejected_proposals / stats.total_sites) * 100).toFixed(1) : 0}% do total)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

