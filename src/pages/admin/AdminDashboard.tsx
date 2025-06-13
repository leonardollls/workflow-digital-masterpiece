import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getBriefings } from '@/services/briefingService'
import { BriefingCard } from '@/components/admin/BriefingCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LogOut,
  Search,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  Building2,
  Filter,
  Download,
  Workflow,
  Users,
  Calendar
} from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'

const AdminDashboard = () => {
  const { user, signOut } = useAuth()
  
  const [briefings, setBriefings] = useState<ClientBriefing[]>([])
  const [filteredBriefings, setFilteredBriefings] = useState<ClientBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [segmentFilter, setSegmentFilter] = useState('all')

  useEffect(() => {
    loadBriefings()
  }, [])

  useEffect(() => {
    filterBriefings()
  }, [briefings, searchTerm, budgetFilter, urgencyFilter, segmentFilter])

  const loadBriefings = async () => {
    try {
      console.log('🔄 Carregando briefings...')
      const data = await getBriefings()
      console.log('✅ Briefings carregados:', data)
      setBriefings(data || [])
      setError(null)
    } catch (error) {
      console.error('❌ Erro ao carregar briefings:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleBriefingUpdate = (updatedBriefing: ClientBriefing) => {
    setBriefings(prev => 
      prev.map(briefing => 
        briefing.id === updatedBriefing.id ? updatedBriefing : briefing
      )
    )
  }

  const handleBriefingDelete = (briefingId: string) => {
    setBriefings(prev => prev.filter(briefing => briefing.id !== briefingId))
  }

  const filterBriefings = () => {
    let filtered = briefings

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(briefing =>
        briefing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.business_segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por orçamento (apenas se o campo existir)
    if (budgetFilter !== 'all' && briefings.length > 0) {
      filtered = filtered.filter(briefing => 
        briefing.budget && briefing.budget.includes(budgetFilter)
      )
    }

    // Filtro por urgência
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(briefing => {
        const days = parseInt(briefing.deadline.match(/\d+/)?.[0] || '0')
        if (urgencyFilter === 'urgent') return days <= 10
        if (urgencyFilter === 'moderate') return days > 10 && days <= 20
        if (urgencyFilter === 'flexible') return days > 20
        return true
      })
    }

    // Filtro por segmento
    if (segmentFilter !== 'all') {
      filtered = filtered.filter(briefing => 
        briefing.business_segment.toLowerCase().includes(segmentFilter.toLowerCase())
      )
    }

    setFilteredBriefings(filtered)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      console.log('✅ Logout realizado')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const getStats = () => {
    const totalBriefings = briefings.length
    const urgentCount = briefings.filter(b => {
      const days = parseInt(b.deadline.match(/\d+/)?.[0] || '0')
      return days <= 10
    }).length
    
    // Calcular valor total das propostas
    const totalProposalValue = briefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Contar briefings com propostas
    const briefingsWithProposals = briefings.filter(b => b.proposal_value).length

    const segmentCounts = briefings.reduce((acc, b) => {
      acc[b.business_segment] = (acc[b.business_segment] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topSegment = Object.entries(segmentCounts).reduce((a, b) => 
      segmentCounts[a[0]] > segmentCounts[b[0]] ? a : b, ['', 0]
    )

    return {
      totalBriefings,
      urgentCount,
      totalProposalValue: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalProposalValue),
      briefingsWithProposals,
      topSegment: topSegment[0] || 'N/A'
    }
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadBriefings} className="mr-2">
            Tentar Novamente
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Fazer Logout
          </Button>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Workflow Digital</h1>
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Debug Info:</h3>
          <p className="text-blue-700">Total de briefings: {briefings.length}</p>
          <p className="text-blue-700">Usuário: {user?.email}</p>
          <p className="text-blue-700">Status: Dashboard carregado com sucesso!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Briefings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBriefings}</div>
              <p className="text-xs text-muted-foreground">
                Briefings recebidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgentCount}</div>
              <p className="text-xs text-muted-foreground">
                Prazo ≤ 10 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor das Propostas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalProposalValue}</div>
              <p className="text-xs text-muted-foreground">
                {stats.briefingsWithProposals} de {stats.totalBriefings} briefings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Segmento Principal</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.topSegment}</div>
              <p className="text-xs text-muted-foreground">
                Mais comum
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por empresa, segmento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por orçamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os orçamentos</SelectItem>
                  <SelectItem value="1000">R$ 1.000 - R$ 5.000</SelectItem>
                  <SelectItem value="5000">R$ 5.000 - R$ 10.000</SelectItem>
                  <SelectItem value="10000">R$ 10.000+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as urgências</SelectItem>
                  <SelectItem value="urgent">Urgente (≤ 10 dias)</SelectItem>
                  <SelectItem value="moderate">Moderado (11-20 dias)</SelectItem>
                  <SelectItem value="flexible">Flexível (&gt; 20 dias)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Briefings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Briefings ({filteredBriefings.length})
            </h2>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          {filteredBriefings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum briefing encontrado
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {briefings.length === 0 
                    ? "Ainda não há briefings enviados. Quando os clientes enviarem briefings, eles aparecerão aqui."
                    : "Nenhum briefing corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBriefings.map((briefing) => (
                <BriefingCard 
                  key={briefing.id} 
                  briefing={briefing} 
                  onUpdate={handleBriefingUpdate}
                  onDelete={handleBriefingDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 