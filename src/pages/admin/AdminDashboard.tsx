import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getBriefings, getInstitutionalBriefings, getLogoBriefings, deleteLogoBriefing, getDentalBriefings, deleteDentalBriefing, getLandingPageBriefings, deleteLandingPageBriefing } from '@/services/briefingService'
import type { LandingPageBriefing } from '@/services/briefingService'
import { BriefingCard } from '@/components/admin/BriefingCard'
import { DentalBriefingCard } from '@/components/admin/DentalBriefingCard'
import { LandingPageBriefingCard } from '@/components/admin/LandingPageBriefingCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LogOut,
  Search,
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
  Upload,
  Palette,
  MessageSquare
} from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import type { InstitutionalBriefing, LogoBriefing, DentalBriefing } from '@/services/briefingService'
import { supabase } from '@/lib/supabase'
import { CaptationDashboard } from '@/components/captation/CaptationDashboard'
import UploadsManagement from '@/components/admin/UploadsManagement'
import { WhatsAppScriptsDashboard } from '@/components/scripts'
import { exportMultipleBriefingsToJSON, exportBriefingToMarkdown } from '@/utils/exportBriefing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileJson, FileText } from 'lucide-react'

const AdminDashboard = () => {
  const { user, signOut } = useAuth()
  
  const [briefings, setBriefings] = useState<ClientBriefing[]>([])
  const [landingPageBriefings, setLandingPageBriefings] = useState<LandingPageBriefing[]>([])
  const [institutionalBriefings, setInstitutionalBriefings] = useState<InstitutionalBriefing[]>([])
  const [logoBriefings, setLogoBriefings] = useState<LogoBriefing[]>([])
  const [dentalBriefings, setDentalBriefings] = useState<DentalBriefing[]>([])
  const [filteredBriefings, setFilteredBriefings] = useState<ClientBriefing[]>([])
  const [filteredLandingPageBriefings, setFilteredLandingPageBriefings] = useState<LandingPageBriefing[]>([])
  const [filteredInstitutionalBriefings, setFilteredInstitutionalBriefings] = useState<InstitutionalBriefing[]>([])
  const [filteredLogoBriefings, setFilteredLogoBriefings] = useState<LogoBriefing[]>([])
  const [filteredDentalBriefings, setFilteredDentalBriefings] = useState<DentalBriefing[]>([])
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
  }, [briefings, landingPageBriefings, institutionalBriefings, logoBriefings, dentalBriefings, searchTerm, budgetFilter, urgencyFilter, segmentFilter, activeTab])

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
      const [landingPagesData, newLandingPageData, institutionalData, logoData, dentalData] = await Promise.all([
        getBriefings(),
        getLandingPageBriefings(),
        getInstitutionalBriefings(),
        getLogoBriefings(),
        getDentalBriefings()
      ])
      
      console.log('✅ [DEBUG] Landing pages (antigos) carregados:', landingPagesData?.length || 0)
      console.log('✅ [DEBUG] Landing pages (novos) carregados:', newLandingPageData?.length || 0)
      console.log('✅ [DEBUG] Briefings institucionais carregados:', institutionalData?.length || 0)
      console.log('✅ [DEBUG] Briefings de logo carregados:', logoData?.length || 0)
      console.log('✅ [DEBUG] Briefings odontológicos carregados:', dentalData?.length || 0)
      
      setBriefings(landingPagesData || [])
      setLandingPageBriefings(newLandingPageData || [])
      setInstitutionalBriefings(institutionalData || [])
      setLogoBriefings(logoData || [])
      setDentalBriefings(dentalData || [])
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

  const handleLogoBriefingUpdate = (updatedBriefing: LogoBriefing) => {
    setLogoBriefings(prev => 
      prev.map(briefing => 
        briefing.id === updatedBriefing.id ? updatedBriefing : briefing
      )
    )
  }

  const handleDentalBriefingUpdate = (updatedBriefing: DentalBriefing) => {
    setDentalBriefings(prev => 
      prev.map(briefing => 
        briefing.id === updatedBriefing.id ? updatedBriefing : briefing
      )
    )
  }

  const handleLandingPageBriefingUpdate = (updatedBriefing: LandingPageBriefing) => {
    setLandingPageBriefings(prev => 
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

  const handleLogoBriefingDelete = async (briefingId: string) => {
    console.log('🗑️ AdminDashboard: Processando exclusão do briefing de logo:', briefingId)
    
    try {
      // Excluir do banco de dados primeiro
      await deleteLogoBriefing(briefingId)
      console.log('✅ Briefing de logo excluído do banco de dados')
      
      // Remover do estado local
      setLogoBriefings(prev => {
        const filtered = prev.filter(briefing => briefing.id !== briefingId)
        console.log('📊 Briefings de logo restantes após exclusão:', filtered.length)
        return filtered
      })
      
      // Também limpar do localStorage para garantir consistência
      try {
        const localBriefings = JSON.parse(localStorage.getItem('logo_briefings') || '[]')
        const filteredLocal = localBriefings.filter((b: any) => b.id !== briefingId)
        localStorage.setItem('logo_briefings', JSON.stringify(filteredLocal))
        console.log('✅ Briefing de logo também removido do localStorage')
      } catch (error) {
        console.warn('⚠️ Erro ao limpar localStorage:', error)
      }
    } catch (error) {
      console.error('❌ Erro ao excluir briefing de logo:', error)
      alert('Erro ao excluir briefing. Tente novamente.')
    }
    
    // Aguardar um pouco antes de recarregar para evitar conflitos
    setTimeout(async () => {
      console.log('🔄 Recarregando dados após exclusão...')
      await loadAllBriefings()
    }, 1000)
  }

  const handleDentalBriefingDelete = async (briefingId: string) => {
    console.log('🗑️ AdminDashboard: Processando exclusão do briefing odontológico:', briefingId)
    
    try {
      // Excluir do banco de dados primeiro
      await deleteDentalBriefing(briefingId)
      console.log('✅ Briefing odontológico excluído do banco de dados')
      
      // Remover do estado local
      setDentalBriefings(prev => {
        const filtered = prev.filter(briefing => briefing.id !== briefingId)
        console.log('📊 Briefings odontológicos restantes após exclusão:', filtered.length)
        return filtered
      })
      
      // Também limpar do localStorage para garantir consistência
      try {
        const localBriefings = JSON.parse(localStorage.getItem('dental_briefings') || '[]')
        const filteredLocal = localBriefings.filter((b: any) => b.id !== briefingId)
        localStorage.setItem('dental_briefings', JSON.stringify(filteredLocal))
        console.log('✅ Briefing odontológico também removido do localStorage')
      } catch (error) {
        console.warn('⚠️ Erro ao limpar localStorage:', error)
      }
    } catch (error) {
      console.error('❌ Erro ao excluir briefing odontológico:', error)
      alert('Erro ao excluir briefing. Tente novamente.')
    }
    
    // Aguardar um pouco antes de recarregar para evitar conflitos
    setTimeout(async () => {
      console.log('🔄 Recarregando dados após exclusão...')
      await loadAllBriefings()
    }, 1000)
  }

  const handleLandingPageBriefingDelete = async (briefingId: string) => {
    console.log('🗑️ AdminDashboard: Processando exclusão do briefing de landing page (novo):', briefingId)
    
    try {
      // Excluir do banco de dados primeiro
      await deleteLandingPageBriefing(briefingId)
      console.log('✅ Briefing de landing page excluído do banco de dados')
      
      // Remover do estado local
      setLandingPageBriefings(prev => {
        const filtered = prev.filter(briefing => briefing.id !== briefingId)
        console.log('📊 Briefings de landing page restantes após exclusão:', filtered.length)
        return filtered
      })
    } catch (error) {
      console.error('❌ Erro ao excluir briefing de landing page:', error)
      alert('Erro ao excluir briefing. Tente novamente.')
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

    // Filtrar novos briefings de landing page (da tabela landing_page_briefings)
    let filteredNewLandingPages = landingPageBriefings

    if (searchTerm) {
      filteredNewLandingPages = filteredNewLandingPages.filter(briefing =>
        briefing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.business_segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (segmentFilter !== 'all') {
      filteredNewLandingPages = filteredNewLandingPages.filter(briefing => 
        briefing.business_segment.toLowerCase().includes(segmentFilter.toLowerCase())
      )
    }

    setFilteredLandingPageBriefings(filteredNewLandingPages)

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

    // Filtrar briefings de logo
    let filteredLogo = logoBriefings

    if (searchTerm) {
      filteredLogo = filteredLogo.filter(briefing =>
        briefing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.business_segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (segmentFilter !== 'all') {
      filteredLogo = filteredLogo.filter(briefing => 
        briefing.business_segment.toLowerCase().includes(segmentFilter.toLowerCase())
      )
    }

    setFilteredLogoBriefings(filteredLogo)

    // Filtrar briefings odontológicos
    let filteredDental = dentalBriefings

    if (searchTerm) {
      filteredDental = filteredDental.filter(briefing =>
        briefing.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (briefing.responsible_name && briefing.responsible_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredDentalBriefings(filteredDental)
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
    const totalBriefings = briefings.length + landingPageBriefings.length + institutionalBriefings.length + logoBriefings.length + dentalBriefings.length
    const totalLandingPages = briefings.length + landingPageBriefings.length
    const totalInstitutional = institutionalBriefings.length
    const totalLogos = logoBriefings.length
    const totalDental = dentalBriefings.length
    
    const urgentCount = briefings.filter(b => {
      const days = parseInt(b.deadline.match(/\d+/)?.[0] || '0')
      return days <= 10
    }).length
    
    // Calcular valor total das propostas (landing pages antigas)
    const totalProposalValue = briefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Calcular valor total das propostas de landing pages novas
    const totalNewLandingPageProposalValue = landingPageBriefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Calcular valor total das propostas institucionais
    const totalInstitutionalProposalValue = institutionalBriefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Calcular valor total das propostas de logo
    const totalLogoProposalValue = logoBriefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Calcular valor total das propostas odontológicas
    const totalDentalProposalValue = dentalBriefings.reduce((sum, b) => {
      return sum + (b.proposal_value || 0)
    }, 0)

    // Contar briefings com propostas
    const briefingsWithProposals = briefings.filter(b => b.proposal_value).length
    const newLandingPageBriefingsWithProposals = landingPageBriefings.filter(b => b.proposal_value).length
    const institutionalBriefingsWithProposals = institutionalBriefings.filter(b => b.proposal_value).length
    const logoBriefingsWithProposals = logoBriefings.filter(b => b.proposal_value).length
    const dentalBriefingsWithProposals = dentalBriefings.filter(b => b.proposal_value).length

    // Combinar segmentos de todos os tipos
    const allBriefings = [...briefings, ...landingPageBriefings, ...institutionalBriefings, ...logoBriefings, ...dentalBriefings.map(d => ({ ...d, business_segment: 'odontologia' }))]
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
      totalLogos,
      totalDental,
      urgentCount,
      totalProposalValue: totalProposalValue + totalNewLandingPageProposalValue + totalInstitutionalProposalValue + totalLogoProposalValue + totalDentalProposalValue,
      briefingsWithProposals: briefingsWithProposals + newLandingPageBriefingsWithProposals + institutionalBriefingsWithProposals + logoBriefingsWithProposals + dentalBriefingsWithProposals,
      topSegment: topSegment[0] || 'Nenhum'
    }
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Erro no Dashboard</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={loadAllBriefings} className="mr-2 bg-purple-600 hover:bg-purple-700">
            Tentar Novamente
          </Button>
          <Button variant="outline" onClick={handleLogout} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Fazer Logout
          </Button>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Workflow Digital</h1>
                <p className="text-sm text-slate-400">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-200">{user?.email}</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
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
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total de Briefings</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalBriefings}</div>
              <p className="text-xs text-slate-400">
                Briefings recebidos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Urgentes</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.urgentCount}</div>
              <p className="text-xs text-slate-400">
                Prazo ≤ 10 dias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Valor das Propostas</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalProposalValue)}
              </div>
              <p className="text-xs text-slate-400">
                {stats.briefingsWithProposals} de {stats.totalBriefings} briefings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Segmento Principal</CardTitle>
              <Building2 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize text-white">{stats.topSegment}</div>
              <p className="text-xs text-slate-400">
                Mais comum
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por empresa, segmento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
                />
              </div>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Filtrar por orçamento" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os orçamentos</SelectItem>
                  <SelectItem value="1000" className="text-slate-200 focus:bg-slate-700 focus:text-white">R$ 1.000 - R$ 5.000</SelectItem>
                  <SelectItem value="5000" className="text-slate-200 focus:bg-slate-700 focus:text-white">R$ 5.000 - R$ 10.000</SelectItem>
                  <SelectItem value="10000" className="text-slate-200 focus:bg-slate-700 focus:text-white">R$ 10.000+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Filtrar por urgência" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todas as urgências</SelectItem>
                  <SelectItem value="urgent" className="text-slate-200 focus:bg-slate-700 focus:text-white">Urgente (≤ 10 dias)</SelectItem>
                  <SelectItem value="moderate" className="text-slate-200 focus:bg-slate-700 focus:text-white">Moderado (11-20 dias)</SelectItem>
                  <SelectItem value="flexible" className="text-slate-200 focus:bg-slate-700 focus:text-white">Flexível (&gt; 20 dias)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Filtrar por segmento" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os segmentos</SelectItem>
                  <SelectItem value="tecnologia" className="text-slate-200 focus:bg-slate-700 focus:text-white">Tecnologia</SelectItem>
                  <SelectItem value="saude" className="text-slate-200 focus:bg-slate-700 focus:text-white">Saúde</SelectItem>
                  <SelectItem value="educacao" className="text-slate-200 focus:bg-slate-700 focus:text-white">Educação</SelectItem>
                  <SelectItem value="comercio" className="text-slate-200 focus:bg-slate-700 focus:text-white">Comércio</SelectItem>
                  <SelectItem value="servicos" className="text-slate-200 focus:bg-slate-700 focus:text-white">Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Abas para diferentes tipos de briefing */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-900 border border-slate-800">
            <TabsTrigger value="landing-pages" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              Landing Pages ({stats.totalLandingPages})
            </TabsTrigger>
            <TabsTrigger value="institutional" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Globe className="w-4 h-4" />
              Sites ({stats.totalInstitutional + stats.totalDental})
            </TabsTrigger>
            <TabsTrigger value="logos" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Palette className="w-4 h-4" />
              Logos ({stats.totalLogos})
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Upload className="w-4 h-4" />
              Uploads de Clientes
            </TabsTrigger>
            <TabsTrigger value="captation" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <MapPin className="w-4 h-4" />
              Checklists de Captação
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-2 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4" />
              Scripts WhatsApp
            </TabsTrigger>
          </TabsList>

          {/* Tab de Landing Pages */}
          <TabsContent value="landing-pages">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
                  Briefings de Landing Pages ({filteredBriefings.length + filteredLandingPageBriefings.length})
                  <span className="ml-3 text-sm font-normal text-slate-400">
                    Novos: {filteredLandingPageBriefings.length} | Antigos: {filteredBriefings.length}
                  </span>
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem 
                  onClick={() => {
                    if (filteredLandingPageBriefings.length > 0) {
                      exportMultipleBriefingsToJSON(filteredLandingPageBriefings)
                    }
                  }}
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  disabled={filteredLandingPageBriefings.length === 0}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Exportar Todos como JSON ({filteredLandingPageBriefings.length})
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    filteredLandingPageBriefings.forEach((briefing, index) => {
                      setTimeout(() => {
                        exportBriefingToMarkdown(briefing)
                      }, index * 300)
                    })
                  }}
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  disabled={filteredLandingPageBriefings.length === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar Todos como MD ({filteredLandingPageBriefings.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredBriefings.length === 0 && filteredLandingPageBriefings.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhum briefing de landing page encontrado
                </h3>
                <p className="text-slate-400 text-center max-w-md">
                  {briefings.length === 0 && landingPageBriefings.length === 0
                        ? "Ainda não há briefings de landing pages enviados. Quando os clientes enviarem briefings, eles aparecerão aqui."
                    : "Nenhum briefing corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Novos briefings de landing page (tabela landing_page_briefings) */}
              {filteredLandingPageBriefings.map((briefing) => (
                <div key={briefing.id} className="relative">
                  <Badge className="absolute -top-2 -right-2 z-10 bg-purple-600 hover:bg-purple-700">
                    Novo Formulário
                  </Badge>
                  <LandingPageBriefingCard 
                    briefing={briefing} 
                    onUpdate={handleLandingPageBriefingUpdate}
                    onDelete={handleLandingPageBriefingDelete}
                  />
                </div>
              ))}
              {/* Briefings antigos (tabela client_briefings) */}
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
                <h2 className="text-2xl font-bold text-white">
                  Briefings de Sites ({filteredInstitutionalBriefings.length + filteredDentalBriefings.length})
                  <span className="ml-3 text-sm font-normal text-slate-400">
                    Institucionais: {filteredInstitutionalBriefings.length} | Odontológicos: {filteredDentalBriefings.length}
                  </span>
                </h2>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              {filteredInstitutionalBriefings.length === 0 && filteredDentalBriefings.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Globe className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhum briefing encontrado
                    </h3>
                    <p className="text-slate-400 text-center max-w-md">
                      {institutionalBriefings.length === 0 && dentalBriefings.length === 0
                        ? "Ainda não há briefings de sites enviados. Quando os clientes enviarem briefings, eles aparecerão aqui."
                        : "Nenhum briefing corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Briefings Odontológicos - usando componente dedicado */}
                  {filteredDentalBriefings.map((briefing) => (
                    <DentalBriefingCard 
                      key={briefing.id}
                      briefing={briefing}
                      onUpdate={handleDentalBriefingUpdate}
                      onDelete={handleDentalBriefingDelete}
                    />
                  ))}
                  {/* Briefings Institucionais */}
                  {filteredInstitutionalBriefings.map((briefing) => (
                    <div key={briefing.id} className="relative">
                      <Badge className="absolute -top-2 -right-2 z-10 bg-blue-600 hover:bg-blue-700">
                        Institucional
                      </Badge>
                      <BriefingCard 
                        briefing={briefing} 
                        onUpdate={handleInstitutionalBriefingUpdate}
                        onDelete={handleInstitutionalBriefingDelete}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab de Logos */}
          <TabsContent value="logos">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Briefings de Logos ({filteredLogoBriefings.length})
                </h2>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              {filteredLogoBriefings.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Palette className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhum briefing de logo encontrado
                    </h3>
                    <p className="text-slate-400 text-center max-w-md">
                      {logoBriefings.length === 0 
                        ? "Ainda não há briefings de logos enviados. Quando os clientes enviarem briefings de logo, eles aparecerão aqui."
                        : "Nenhum briefing corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLogoBriefings.map((briefing) => (
                    <BriefingCard 
                      key={briefing.id} 
                      briefing={briefing as any} 
                      onUpdate={handleLogoBriefingUpdate}
                      onDelete={handleLogoBriefingDelete}
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

          {/* Tab de Scripts WhatsApp */}
          <TabsContent value="scripts">
            <WhatsAppScriptsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard 