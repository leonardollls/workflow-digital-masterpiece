import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
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
  Send
} from 'lucide-react'
import type { 
  State, 
  City, 
  Category, 
  CaptationSite, 
  CaptationStats 
} from '@/types/captation'
import {
  getCaptationSites,
  getCaptationStats,
  getStates,
  getCities,
  getCitiesByState,
  getCategories,
  updateCaptationSite
} from '@/services/captationService'
import { AddSiteDialog } from './AddSiteDialog'
import { EditSiteDialog } from './EditSiteDialog'
import { StatusChangeDialog } from './StatusChangeDialog'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingSite, setEditingSite] = useState<CaptationSite | null>(null)
  const [statusChangeSite, setStatusChangeSite] = useState<CaptationSite | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Recarregar dados quando filtros mudarem
  useEffect(() => {
    if (!loading) {
      loadSitesAndStats()
    }
  }, [selectedState, selectedCity, selectedCategory])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to_send':
        return <Badge variant="default" className="bg-orange-500"><Send className="w-3 h-3 mr-1" />A Enviar</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aceita</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Negada</Badge>
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500"><PlayCircle className="w-3 h-3 mr-1" />Em Execução</Badge>
      case 'paid':
        return <Badge variant="default" className="bg-purple-500"><DollarSign className="w-3 h-3 mr-1" />Projeto Pago</Badge>
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
    }
  }

  const filteredSites = sites.filter(site => {
    if (!searchTerm) return true
    return (
      site.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.city?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const availableCities = selectedState !== 'all' ? stateCities : []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Erro: {error}</p>
        <Button onClick={loadInitialData} variant="outline" size="sm" className="mt-2">
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
          <h2 className="text-2xl font-bold text-gray-900">Checklists de Captação</h2>
          <p className="text-gray-600">Gerencie sites captados por estado, cidade e categoria</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Site
        </Button>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sites</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_sites}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_proposals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">A Enviar</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.to_send_proposals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceitas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.accepted_proposals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress_proposals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Pagos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.paid_proposals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Pago</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                R$ {stats.total_paid_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {states
                  .filter(state => state.name !== 'Não identificada')
                  .map(state => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Cidades</SelectItem>
                {availableCities
                  .sort((a, b) => {
                    if (a.name === 'Não identificada') return -1
                    if (b.name === 'Não identificada') return 1
                    return a.name.localeCompare(b.name)
                  })
                  .map(city => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name} {city.population ? `(${city.population.toLocaleString()} hab.)` : ''}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
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

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedState('all')
                setSelectedCity('all')
                setSelectedCategory('all')
                setSearchTerm('')
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sites */}
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Sites Captados ({filteredSites.length})
          </h3>
        </div>

        {filteredSites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum site encontrado com os filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSites.map(site => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{site.company_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(site.proposal_status)}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setStatusChangeSite(site)}
                      >
                        Alterar Status
                      </Button>
                      {site.service_value && site.proposal_status === 'paid' && (
                        <div className="text-sm font-medium text-green-600">
                          R$ {site.service_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {site.contact_person && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Contato</label>
                        <p className="text-sm text-gray-600">{site.contact_person}</p>
                      </div>
                    )}
                    {site.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Telefone</label>
                        <p className="text-sm text-gray-600">{site.phone}</p>
                      </div>
                    )}
                    {site.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">E-mail</label>
                        <p className="text-sm text-gray-600">{site.email}</p>
                      </div>
                    )}
                    {site.website_url && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <a 
                          href={site.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Ver site <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {site.contact_link && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={site.contact_link} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contato
                          </a>
                        </Button>
                      )}
                      {site.proposal_link && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={site.proposal_link} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-1" />
                            Proposta
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingSite(site)}
                    >
                      Editar
                    </Button>
                  </div>

                  {site.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <label className="text-sm font-medium text-gray-700">Observações</label>
                      <p className="text-sm text-gray-600 mt-1">{site.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
    </div>
  )
} 