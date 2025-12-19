import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  MapPin, 
  Building2, 
  TrendingUp, 
  Users, 
  Plus, 
  Search, 
  Filter,
  ExternalLink,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  DollarSign,
  Send,
  FileJson,
  Upload,
  Star,
  Map,
  CheckSquare,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Phone,
  Download,
  Calendar,
  AlertCircle,
  LayoutGrid,
  LayoutList,
  Tags,
  BarChart3,
  Edit2,
  Trash2
} from 'lucide-react'
import type { 
  State, 
  City, 
  Category, 
  CaptationSite, 
  CaptationStats,
  ProposalStatus,
  SortField,
  SortOrder
} from '@/types/captation'
import {
  getCaptationSites,
  getCaptationStats,
  getStates,
  getCities,
  getCitiesByState,
  getCategories,
  updateCaptationSite,
  bulkUpdateStatus,
  bulkDeleteSites,
  deleteCaptationSite
} from '@/services/captationService'
import { AddSiteDialog } from './AddSiteDialog'
import { EditSiteDialog } from './EditSiteDialog'
import { StatusChangeDialog } from './StatusChangeDialog'
import { JsonImportDialog } from './JsonImportDialog'
import { BulkStatusDialog } from './BulkStatusDialog'
import { ExportDialog } from './ExportDialog'
import { TagsManager } from './TagsManager'
import { CaptationAnalytics } from './CaptationAnalytics'
import { ProposalTemplates } from './ProposalTemplates'
import { BulkDeleteDialog } from './BulkDeleteDialog'
import { DeleteSiteDialog } from './DeleteSiteDialog'
import { EditableField } from './EditableField'

export const CaptationDashboard = () => {
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [stateCities, setStateCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [sites, setSites] = useState<CaptationSite[]>([])
  const [stats, setStats] = useState<CaptationStats | null>(null)
  
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const ITEMS_PER_PAGE = 25
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showTagsManager, setShowTagsManager] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showProposalTemplates, setShowProposalTemplates] = useState(false)
  const [editingSite, setEditingSite] = useState<CaptationSite | null>(null)
  const [statusChangeSite, setStatusChangeSite] = useState<CaptationSite | null>(null)
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingSite, setDeletingSite] = useState<CaptationSite | null>(null)
  const [singleDeleting, setSingleDeleting] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Recarregar dados quando filtros mudarem
  useEffect(() => {
    if (!loading) {
      loadSitesAndStats()
      setCurrentPage(1) // Reset para primeira página quando filtros mudam
    }
  }, [selectedState, selectedCity, selectedCategory, selectedStatus])

  // Filtrar cidades quando estado mudar
  useEffect(() => {
    if (selectedState && selectedState !== 'all') {
      const stateCities = cities.filter(city => city.state_id === selectedState)
      if (stateCities.length > 0 && selectedCity !== 'all' && !stateCities.find(c => c.id === selectedCity)) {
        setSelectedCity('all')
      }
    }
  }, [selectedState, cities, selectedCity])

  // Carregar cidades quando selectedState mudar
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState === 'all') {
        setStateCities([])
        return
      }
      try {
        const data = await getCitiesByState(selectedState)
        setStateCities(data)
      } catch (err) {
        console.error('Erro ao carregar cidades:', err)
      }
    }

    fetchCities()
  }, [selectedState])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [statesData, categoriesData] = await Promise.all([
        getStates(),
        getCategories()
      ])
      
      setStates(statesData)
      setCategories(categoriesData)
      
      await loadSitesAndStats()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadSitesAndStats = async () => {
    try {
      const filters = {
        stateId: selectedState !== 'all' ? selectedState : undefined,
        cityId: selectedCity !== 'all' ? selectedCity : undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined
      }

      const [sitesData, statsData] = await Promise.all([
        getCaptationSites(filters),
        getCaptationStats(filters)
      ])

      setSites(sitesData)
      setStats(statsData)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleStatusChange = async (newStatus: 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid', serviceValue?: number) => {
    if (!statusChangeSite) return
    
    try {
      const updatedSite = await updateCaptationSite({
        id: statusChangeSite.id,
        proposal_status: newStatus,
        service_value: serviceValue
      })

      // Atualizar estado local
      setSites(prev => prev.map(site => 
        site.id === statusChangeSite.id ? updatedSite : site
      ))

      // Recarregar estatísticas
      await loadSitesAndStats()
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err)
    }
  }

  // Funções de seleção em massa
  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedSites.length === paginatedSites.length) {
      setSelectedSites([])
    } else {
      setSelectedSites(paginatedSites.map(site => site.id))
    }
  }

  const handleBulkStatusChange = async (newStatus: 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid', serviceValue?: number) => {
    if (selectedSites.length === 0) return
    
    try {
      setBulkUpdating(true)
      await bulkUpdateStatus(selectedSites, newStatus, serviceValue)
      setSelectedSites([])
      await loadSitesAndStats()
    } catch (err: any) {
      console.error('Erro ao atualizar status em massa:', err)
    } finally {
      setBulkUpdating(false)
      setShowBulkStatusDialog(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSites.length === 0) return
    
    try {
      setBulkDeleting(true)
      await bulkDeleteSites(selectedSites)
      setSelectedSites([])
      await loadSitesAndStats()
    } catch (err: any) {
      console.error('Erro ao excluir sites em massa:', err)
    } finally {
      setBulkDeleting(false)
      setShowBulkDeleteDialog(false)
    }
  }

  const handleSingleDelete = async () => {
    if (!deletingSite) return
    
    try {
      setSingleDeleting(true)
      await deleteCaptationSite(deletingSite.id)
      await loadSitesAndStats()
    } catch (err: any) {
      console.error('Erro ao excluir site:', err)
    } finally {
      setSingleDeleting(false)
      setDeletingSite(null)
    }
  }

  const handleQuickUpdate = async (siteId: string, field: string, value: string) => {
    try {
      const updatedSite = await updateCaptationSite({
        id: siteId,
        [field]: value || null
      })
      
      // Atualizar estado local
      setSites(prev => prev.map(site => 
        site.id === siteId ? { ...site, [field]: value || null } : site
      ))
    } catch (err: any) {
      console.error(`Erro ao atualizar ${field}:`, err)
      throw err
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500"><PlayCircle className="w-3 h-3 mr-1" />Em Execução</Badge>
      case 'to_send':
        return <Badge variant="default" className="bg-orange-500"><Send className="w-3 h-3 mr-1" />A Enviar</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aceito</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Negado</Badge>
      case 'paid':
        return <Badge variant="default" className="bg-purple-500"><DollarSign className="w-3 h-3 mr-1" />Pago</Badge>
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
    }
  }

  // Filtrar sites
  const filteredSites = sites
    .filter(site => {
      // Filtro por status
      if (selectedStatus !== 'all' && site.proposal_status !== selectedStatus) {
        return false
      }
      // Filtro por busca
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          site.company_name.toLowerCase().includes(search) ||
          site.city?.name.toLowerCase().includes(search) ||
          site.category?.name.toLowerCase().includes(search) ||
          site.contact_person?.toLowerCase().includes(search) ||
          site.phone?.includes(search)
        )
      }
      return true
    })
    // Ordenar
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'company_name':
          comparison = a.company_name.localeCompare(b.company_name)
          break
        case 'google_rating':
          comparison = (a.google_rating || 0) - (b.google_rating || 0)
          break
        case 'proposal_status':
          const statusOrder = ['pending', 'in_progress', 'to_send', 'accepted', 'rejected', 'paid']
          comparison = statusOrder.indexOf(a.proposal_status) - statusOrder.indexOf(b.proposal_status)
          break
        case 'next_contact_date':
          const dateA = a.next_contact_date ? new Date(a.next_contact_date).getTime() : Infinity
          const dateB = b.next_contact_date ? new Date(b.next_contact_date).getTime() : Infinity
          comparison = dateA - dateB
          break
        case 'created_at':
        default:
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Paginação
  const totalPages = Math.ceil(filteredSites.length / ITEMS_PER_PAGE)
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const availableCities = selectedState !== 'all' ? stateCities : []

  // Função auxiliar para verificar se contato está atrasado
  const isContactOverdue = (site: CaptationSite) => {
    if (!site.next_contact_date) return false
    return new Date(site.next_contact_date) < new Date()
  }

  // Função para verificar se site é novo (< 7 dias)
  const isNewSite = (site: CaptationSite) => {
    if (!site.created_at) return false
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return new Date(site.created_at) > sevenDaysAgo
  }

  // Função para abrir WhatsApp
  const openWhatsApp = (site: CaptationSite) => {
    if (!site.phone) return
    const phone = site.phone.replace(/\D/g, '')
    const template = site.category?.whatsapp_template || 
      `Olá! Vi seu estabelecimento ${site.company_name} e gostaria de apresentar uma proposta de otimização para seu site.`
    const message = encodeURIComponent(template)
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
        <p className="text-red-300">Erro: {error}</p>
        <Button onClick={loadInitialData} variant="outline" size="sm" className="mt-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Checklists de Captação</h2>
          <p className="text-slate-400">Gerencie sites captados por estado, cidade e categoria</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAnalytics(true)} 
            variant="outline"
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={!stats}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button 
            onClick={() => setShowProposalTemplates(true)} 
            variant="outline"
            size="icon"
            title="Templates de Proposta"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => setShowTagsManager(true)} 
            variant="outline"
            size="icon"
            title="Gerenciar Tags"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Tags className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => setShowExportDialog(true)} 
            variant="outline"
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={filteredSites.length === 0}
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button 
            onClick={() => setShowImportDialog(true)} 
            variant="outline"
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <FileJson className="w-4 h-4" />
            Importar JSON
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            Adicionar Site
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total de Sites</CardTitle>
              <Building2 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total_sites}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.pending_proposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Em Execução</CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.in_progress_proposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">A Enviar</CardTitle>
              <Send className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{stats.to_send_proposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Aceitos</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.accepted_proposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Pagos</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.paid_proposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Valor Total Pago</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-400">
                R$ {stats.total_paid_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Linha 1: Busca e Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, cidade, telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os Estados</SelectItem>
                {states
                  .filter(state => state.name !== 'Não identificada')
                  .map(state => (
                    <SelectItem key={state.id} value={state.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      {state.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todas as Cidades</SelectItem>
                {availableCities
                  .sort((a, b) => {
                    if (a.name === 'Não identificada') return -1
                    if (b.name === 'Não identificada') return 1
                    return a.name.localeCompare(b.name)
                  })
                  .map(city => (
                    <SelectItem key={city.id} value={city.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      {city.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todas as Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Linha 2: Status, Ordenação e Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ProposalStatus | 'all')}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os Status</SelectItem>
                <SelectItem value="pending" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" /> Pendente
                  </div>
                </SelectItem>
                <SelectItem value="in_progress" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-3 h-3 text-blue-400" /> Em Execução
                  </div>
                </SelectItem>
                <SelectItem value="to_send" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <Send className="w-3 h-3 text-orange-400" /> A Enviar
                  </div>
                </SelectItem>
                <SelectItem value="accepted" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Aceito
                  </div>
                </SelectItem>
                <SelectItem value="rejected" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-400" /> Negado
                  </div>
                </SelectItem>
                <SelectItem value="paid" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-purple-400" /> Pago
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="created_at" className="text-slate-200 focus:bg-slate-700 focus:text-white">Data de Criação</SelectItem>
                <SelectItem value="company_name" className="text-slate-200 focus:bg-slate-700 focus:text-white">Nome da Empresa</SelectItem>
                <SelectItem value="google_rating" className="text-slate-200 focus:bg-slate-700 focus:text-white">Avaliação Google</SelectItem>
                <SelectItem value="proposal_status" className="text-slate-200 focus:bg-slate-700 focus:text-white">Status</SelectItem>
                <SelectItem value="next_contact_date" className="text-slate-200 focus:bg-slate-700 focus:text-white">Próximo Contato</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="desc" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="w-3 h-3" /> Decrescente
                  </div>
                </SelectItem>
                <SelectItem value="asc" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="w-3 h-3" /> Crescente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('cards')}
                title="Visualização em cards"
                className={viewMode === 'cards' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
                title="Visualização em tabela"
                className={viewMode === 'table' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedState('all')
                setSelectedCity('all')
                setSelectedCategory('all')
                setSelectedStatus('all')
                setSearchTerm('')
                setSortField('created_at')
                setSortOrder('desc')
                setCurrentPage(1)
              }}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sites */}
      <div className="grid gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-lg font-semibold text-white">
              Sites Captados ({filteredSites.length})
            </h3>
            {totalPages > 1 && (
              <span className="text-sm text-slate-400">
                Página {currentPage} de {totalPages}
              </span>
            )}
            {paginatedSites.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSites.length === paginatedSites.length && paginatedSites.length > 0}
                  onCheckedChange={toggleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all" className="text-sm text-slate-400 cursor-pointer">
                  Selecionar página
                </label>
              </div>
            )}
          </div>
          {selectedSites.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                {selectedSites.length} selecionado{selectedSites.length > 1 ? 's' : ''}
              </Badge>
              <Button 
                size="sm" 
                onClick={() => setShowBulkStatusDialog(true)}
                disabled={bulkUpdating || bulkDeleting}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <CheckSquare className="w-4 h-4" />
                Alterar Status em Massa
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setShowBulkDeleteDialog(true)}
                disabled={bulkUpdating || bulkDeleting}
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Selecionados
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedSites([])}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Limpar Seleção
              </Button>
            </div>
          )}
        </div>

        {filteredSites.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="text-center py-8">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum site encontrado com os filtros aplicados</p>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          /* Visualização em Tabela */
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                      <th className="p-3 text-left">
                        <Checkbox
                          checked={selectedSites.length === paginatedSites.length && paginatedSites.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Empresa</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Localização</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Categoria</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Telefone</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Avaliação</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Status</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedSites.map(site => (
                      <tr 
                        key={site.id} 
                        className={`hover:bg-slate-800 ${selectedSites.includes(site.id) ? 'bg-purple-900/30' : ''} ${isContactOverdue(site) ? 'border-l-4 border-l-red-500' : ''}`}
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={selectedSites.includes(site.id)}
                            onCheckedChange={() => toggleSiteSelection(site.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-slate-200">{site.company_name}</span>
                            {isNewSite(site) && (
                              <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-400 text-xs">
                                Novo
                              </Badge>
                            )}
                          </div>
                          {site.website_url && (
                            <a 
                              href={site.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:underline"
                            >
                              {site.website_url.replace(/^https?:\/\//, '').slice(0, 30)}...
                            </a>
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-400">
                          {site.city?.name}, {site.city?.state?.abbreviation}
                        </td>
                        <td className="p-3">
                          {site.category && (
                            <Badge 
                              variant="outline"
                              style={{ borderColor: site.category.color, color: site.category.color }}
                              className="text-xs"
                            >
                              {site.category.name}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-400">
                          {site.phone || '-'}
                        </td>
                        <td className="p-3">
                          {site.google_rating ? (
                            <span className="flex items-center gap-1 text-sm text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {site.google_rating}
                            </span>
                          ) : <span className="text-slate-500">-</span>}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(site.proposal_status)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {site.phone && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800"
                                onClick={() => openWhatsApp(site)}
                                title="WhatsApp"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                              onClick={() => setEditingSite(site)}
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                              onClick={() => setDeletingSite(site)}
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Visualização em Cards */
          <div className="grid gap-4">
            {paginatedSites.map(site => (
              <Card 
                key={site.id} 
                className={`bg-slate-900 border-slate-800 hover:shadow-lg transition-shadow ${selectedSites.includes(site.id) ? 'ring-2 ring-purple-500 bg-purple-900/20' : ''} ${isContactOverdue(site) ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedSites.includes(site.id)}
                        onCheckedChange={() => toggleSiteSelection(site.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-white">{site.company_name}</h4>
                          {isNewSite(site) && (
                            <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-400 text-xs">
                              Novo
                            </Badge>
                          )}
                          {isContactOverdue(site) && (
                            <Badge variant="destructive" className="text-xs bg-red-900/50 text-red-400">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Contato atrasado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {site.city?.name}, {site.city?.state?.abbreviation}
                          </span>
                          <span 
                            className="flex items-center gap-1"
                            style={{ color: site.category?.color }}
                          >
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: site.category?.color }}
                            />
                            {site.category?.name}
                          </span>
                          {site.google_rating && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="w-4 h-4 fill-amber-400" />
                              {site.google_rating}/5
                              {site.google_reviews_count && (
                                <span className="text-slate-500">
                                  ({site.google_reviews_count} avaliações)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(site.proposal_status)}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setStatusChangeSite(site)}
                        className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      >
                        Alterar Status
                      </Button>
                      {site.service_value && site.proposal_status === 'paid' && (
                        <div className="text-sm font-medium text-emerald-400">
                          R$ {site.service_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {site.contact_person && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Contato</label>
                        <p className="text-sm text-slate-300">{site.contact_person}</p>
                      </div>
                    )}
                    <EditableField
                      label="Telefone"
                      value={site.phone}
                      onSave={(value) => handleQuickUpdate(site.id, 'phone', value)}
                      type="phone"
                      placeholder="Não informado"
                    />
                    {site.email && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">E-mail</label>
                        <p className="text-sm text-slate-300">{site.email}</p>
                      </div>
                    )}
                    <EditableField
                      label="Website"
                      value={site.website_url}
                      onSave={(value) => handleQuickUpdate(site.id, 'website_url', value)}
                      type="url"
                      placeholder="Não informado"
                      showLink={true}
                    />
                    {site.google_maps_url && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Google Maps</label>
                        <a 
                          href={site.google_maps_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Map className="w-3 h-3" />
                          Ver no Maps
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {site.phone && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-emerald-900/50 text-emerald-400 border-emerald-600 hover:bg-emerald-800/50"
                          onClick={() => openWhatsApp(site)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                      )}
                      {site.contact_link && (
                        <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" asChild>
                          <a href={site.contact_link} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contato
                          </a>
                        </Button>
                      )}
                      {site.proposal_link && (
                        <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" asChild>
                          <a href={site.proposal_link} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-1" />
                            Proposta
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingSite(site)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setDeletingSite(site)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-800 rounded-md">
                    <EditableField
                      label="Observações"
                      value={site.notes}
                      onSave={(value) => handleQuickUpdate(site.id, 'notes', value)}
                      type="textarea"
                      placeholder="Adicionar observações..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:bg-slate-800/50"
            >
              Primeira
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:bg-slate-800/50"
            >
              Anterior
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Mostrar primeira, última, atual e 2 páginas ao redor
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - currentPage) <= 2
                })
                .map((page, idx, arr) => (
                  <span key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-slate-500">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] ${currentPage === page ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {page}
                    </Button>
                  </span>
                ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:bg-slate-800/50"
            >
              Próxima
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:bg-slate-800/50"
            >
              Última
            </Button>
          </div>
        )}
      </div>

      {/* Diálogos */}
      <AddSiteDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        states={states}
        cities={cities}
        categories={categories}
        onSiteAdded={loadSitesAndStats}
      />

      {editingSite && (
        <EditSiteDialog
          site={editingSite}
          open={!!editingSite}
          onOpenChange={(open) => !open && setEditingSite(null)}
          states={states}
          cities={cities}  
          categories={categories}
          onSiteUpdated={loadSitesAndStats}
        />
      )}

      {statusChangeSite && (
        <StatusChangeDialog
          open={!!statusChangeSite}
          onOpenChange={(open) => !open && setStatusChangeSite(null)}
          currentStatus={statusChangeSite.proposal_status}
          onStatusChange={handleStatusChange}
          companyName={statusChangeSite.company_name}
        />
      )}

      <JsonImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        states={states}
        categories={categories}
        onImportComplete={() => {
          loadSitesAndStats()
          loadInitialData()
        }}
      />

      <BulkStatusDialog
        open={showBulkStatusDialog}
        onOpenChange={setShowBulkStatusDialog}
        selectedCount={selectedSites.length}
        onStatusChange={handleBulkStatusChange}
        loading={bulkUpdating}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        sites={filteredSites}
      />

      <TagsManager
        open={showTagsManager}
        onOpenChange={setShowTagsManager}
        onTagsUpdated={loadSitesAndStats}
      />

      <CaptationAnalytics
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
        stats={stats}
        sites={sites}
      />

      <ProposalTemplates
        open={showProposalTemplates}
        onOpenChange={setShowProposalTemplates}
        categories={categories}
      />

      <BulkDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        selectedCount={selectedSites.length}
        onConfirmDelete={handleBulkDelete}
        loading={bulkDeleting}
      />

      {deletingSite && (
        <DeleteSiteDialog
          open={!!deletingSite}
          onOpenChange={(open) => !open && setDeletingSite(null)}
          siteName={deletingSite.company_name}
          onConfirmDelete={handleSingleDelete}
          loading={singleDeleting}
        />
      )}
    </div>
  )
} 