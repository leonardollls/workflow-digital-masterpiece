import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getBriefings, getInstitutionalBriefings } from '@/services/briefingService'
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
  Calendar,
  Globe,
  MapPin,
  Upload
} from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import type { InstitutionalBriefing } from '@/services/briefingService'
import { supabase } from '@/lib/supabase'
import { CaptationDashboard } from '@/components/captation/CaptationDashboard'
import UploadsManagement from '@/components/admin/UploadsManagement'

const AdminDashboard = () => {
  const { user, signOut } = useAuth()
  
  const [briefings, setBriefings] = useState<ClientBriefing[]>([])
  const [institutionalBriefings, setInstitutionalBriefings] = useState<InstitutionalBriefing[]>([])
  const [filteredBriefings, setFilteredBriefings] = useState<ClientBriefing[]>([])
  const [filteredInstitutionalBriefings, setFilteredInstitutionalBriefings] = useState<InstitutionalBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('landing-pages')

  useEffect(() => {
    loadAllBriefings()
  }, [])

  useEffect(() => {
    filterBriefings()
  }, [briefings, institutionalBriefings, searchTerm, budgetFilter, urgencyFilter, segmentFilter, activeTab])

  const loadAllBriefings = async () => {
    try {
      console.log('🔄 [DEBUG] Carregando todos os briefings...')
      console.log('🔄 [DEBUG] Estado atual da autenticação:', { user: user?.email, isAuthenticated: !!user })
      
      // Carregar briefings de landing pages
      console.log('🔄 [DEBUG] Testando conexão direta com Supabase para landing pages...')
      const { data: testData, error: testError } = await supabase
        .from('client_briefings')
        .select('id, company_name, created_at')
        .limit(5)
      
      console.log('🔄 [DEBUG] Resultado do teste direto landing pages:', { testData, testError })
      
      // Carregar briefings institucionais
      console.log('🔄 [DEBUG] Testando conexão direta com Supabase para institucionais...')
      const { data: institutionalTestData, error: institutionalTestError } = await supabase
        .from('institutional_briefings')
        .select('id, company_name, created_at')
        .limit(5)
      
      console.log('🔄 [DEBUG] Resultado do teste direto institucionais:', { institutionalTestData, institutionalTestError })
      
      // Carregar dados via services
      const [landingPagesData, institutionalData] = await Promise.all([
        getBriefings(),
        getInstitutionalBriefings()
      ])
      
      console.log('✅ [DEBUG] Landing pages carregados:', landingPagesData?.length || 0)
      console.log('✅ [DEBUG] Briefings institucionais carregados:', institutionalData?.length || 0)
      
      setBriefings(landingPagesData || [])
      setInstitutionalBriefings(institutionalData || [])
      setError('')
    } catch (err: any) {
      console.error('❌ [DEBUG] Erro ao carregar briefings:', err)
      console.error('❌ [DEBUG] Stack trace:', err.stack)
      console.error('❌ [DEBUG] Detalhes completos:', {
        message: err.message,
        name: err.name,
        cause: err.cause
      })
      
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar briefings'
      setError(`Erro ao carregar briefings: ${errorMessage}`)
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

  const handleInstitutionalBriefingUpdate = (updatedBriefing: InstitutionalBriefing) => {
    setInstitutionalBriefings(prev => 
      prev.map(briefing => 
        briefing.id === updatedBriefing.id ? updatedBriefing : briefing
      )
    )
  }

  const handleBriefingDelete = async (briefingId: string) => {
    console.log('🗑️ AdminDashboard: Processando exclusão do briefing:', briefingId)
    
    // Remover do estado local imediatamente
    setBriefings(prev => {
      const filtered = prev.filter(briefing => briefing.id !== briefingId)
      console.log('📊 Briefings restantes após exclusão:', filtered.length)
      return filtered
    })
    
    // Também limpar do localStorage para garantir consistência
    try {
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const filteredLocal = localBriefings.filter((b: any) => b.id !== briefingId)
      localStorage.setItem('briefings', JSON.stringify(filteredLocal))
      console.log('✅ Briefing também removido do localStorage')
    } catch (error) {
      console.warn('⚠️ Erro ao limpar localStorage:', error)
    }
    
    // Aguardar um pouco antes de recarregar para evitar conflitos
    setTimeout(async () => {
      console.log('🔄 Recarregando dados após exclusão...')
      await loadAllBriefings()
    }, 1000)
  }

  const handleInstitutionalBriefingDelete = async (briefingId: string) => {
    console.log('🗑️ AdminDashboard: Processando exclusão do briefing institucional:', briefingId)
    
    // Remover do estado local imediatamente
    setInstitutionalBriefings(prev => {
      const filtered = prev.filter(briefing => briefing.id !== briefingId)
      console.log('📊 Briefings institucionais restantes após exclusão:', filtered.length)
      return filtered
    })
    
    // Também limpar do localStorage para garantir consistência
    try {
      const localBriefings = JSON.parse(localStorage.getItem('institutional_briefings') || '[]')
      const filteredLocal = localBriefings.filter((b: any) => b.id !== briefingId)
      localStorage.setItem('institutional_briefings', JSON.stringify(filteredLocal))
      console.log('✅ Briefing institucional também removido do localStorage')
    } catch (error) {
      console.warn('⚠️ Erro ao limpar localStorage:', error)
    }
    
    // Aguardar um pouco antes de recarregar para evitar conflitos
    setTimeout(async () => {
      console.log('🔄 Recarregando dados após exclusão...')
      await loadAllBriefings()
    }, 1000)
  }

  const filterBriefings = () => {
    // Filtrar briefings de landing pages
    let filtered = briefings

    if (searchTerm) {
      filtered = filtered.filter(briefing =>
        briefing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.business_segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (budgetFilter !== 'all' && briefings.length > 0) {
      filtered = filtered.filter(briefing => 
        briefing.budget && briefing.budget.includes(budgetFilter)
      )
    }

    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(briefing => {
        const days = parseInt(briefing.deadline.match(/\d+/)?.[0] || '0')
        if (urgencyFilter === 'urgent') return days <= 10
        if (urgencyFilter === 'moderate') return days > 10 && days <= 20
        if (urgencyFilter === 'flexible') return days > 20
        return true
      })
    }

    if (segmentFilter !== 'all') {
      filtered = filtered.filter(briefing => 
        briefing.business_segment.toLowerCase().includes(segmentFilter.toLowerCase())
      )
    }

    setFilteredBriefings(filtered)

    // Filtrar briefings institucionais
    let filteredInstitutional = institutionalBriefings

    if (searchTerm) {
      filteredInstitutional = filteredInstitutional.filter(briefing =>
        briefing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.business_segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (segmentFilter !== 'all') {
      filteredInstitutional = filteredInstitutional.filter(briefing => 
        briefing.business_segment.toLowerCase().includes(segmentFilter.toLowerCase())
      )
    }

    setFilteredInstitutionalBriefings(filteredInstitutional)
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
    const totalBriefings = briefings.length + institutionalBriefings.length
    const totalLandingPages = briefings.length
    const totalInstitutional = institutionalBriefings.length
    
    const urgentCount = briefings.filter(b => {
      const days = parseInt(b.deadline.match(/\d+/)?.[0] || '0')
      return days <= 10
    }).length
    
    // Calcular valor total das propostas (apenas landing pages por enquanto)
    const totalProposalValue = briefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Calcular valor total das propostas institucionais
    const totalInstitutionalProposalValue = institutionalBriefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Contar briefings com propostas
    const briefingsWithProposals = briefings.filter(b => b.proposal_value).length
    const institutionalBriefingsWithProposals = institutionalBriefings.filter(b => b.proposal_value).length

    // Combinar segmentos de ambos os tipos
    const allBriefings = [...briefings, ...institutionalBriefings]
    const segmentCounts = allBriefings.reduce((acc, b) => {
      acc[b.business_segment] = (acc[b.business_segment] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topSegment = Object.entries(segmentCounts).reduce((a, b) => 
      segmentCounts[a[0]] > segmentCounts[b[0]] ? a : b, ['', 0]
    )

    return {
      totalBriefings,
      totalLandingPages,
      totalInstitutional,
      urgentCount,
      totalProposalValue: totalProposalValue + totalInstitutionalProposalValue,
      briefingsWithProposals: briefingsWithProposals + institutionalBriefingsWithProposals,
      topSegment: topSegment[0] || 'Nenhum'
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
          <Button onClick={loadAllBriefings} className="mr-2">
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
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalProposalValue)}
              </div>
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

        {/* Abas para diferentes tipos de briefing */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="landing-pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Landing Pages ({stats.totalLandingPages})
            </TabsTrigger>
            <TabsTrigger value="institutional" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sites Institucionais ({stats.totalInstitutional})
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Uploads de Clientes
            </TabsTrigger>
            <TabsTrigger value="captation" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Checklists de Captação
            </TabsTrigger>
          </TabsList>

          {/* Tab de Landing Pages */}
          <TabsContent value="landing-pages">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
                  Briefings de Landing Pages ({filteredBriefings.length})
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
                      Nenhum briefing de landing page encontrado
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {briefings.length === 0 
                        ? "Ainda não há briefings de landing pages enviados. Quando os clientes enviarem briefings, eles aparecerão aqui."
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
          </TabsContent>

          {/* Tab de Sites Institucionais */}
          <TabsContent value="institutional">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Briefings de Sites Institucionais ({filteredInstitutionalBriefings.length})
                </h2>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              {filteredInstitutionalBriefings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Globe className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum briefing institucional encontrado
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {institutionalBriefings.length === 0 
                        ? "Ainda não há briefings de sites institucionais enviados. Quando os clientes enviarem briefings, eles aparecerão aqui."
                        : "Nenhum briefing corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredInstitutionalBriefings.map((briefing) => (
                    <BriefingCard 
                      key={briefing.id} 
                      briefing={briefing} 
                      onUpdate={handleInstitutionalBriefingUpdate}
                      onDelete={handleInstitutionalBriefingDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab de Uploads de Clientes */}
          <TabsContent value="uploads">
            <UploadsManagement />
          </TabsContent>

          {/* Tab de Checklists de Captação */}
          <TabsContent value="captation">
            <CaptationDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard 