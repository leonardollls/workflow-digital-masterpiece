import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Edit2, Trash2, DollarSign, Star, Map, Calendar, Tags, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { State, City, Category, CaptationSite, Tag } from '@/types/captation'
import { updateCaptationSite, deleteCaptationSite, getCitiesByState, addStatusHistory, getTags, getSiteTagIds, updateSiteTags } from '@/services/captationService'
import { StatusHistory } from './StatusHistory'

interface EditSiteDialogProps {
  site: CaptationSite
  open: boolean
  onOpenChange: (open: boolean) => void
  states: State[]
  cities: City[]
  categories: Category[]
  onSiteUpdated: () => void
}

export const EditSiteDialog = ({ 
  site,
  open, 
  onOpenChange, 
  states, 
  cities, 
  categories, 
  onSiteUpdated 
}: EditSiteDialogProps) => {
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    state_id: '',
    city_id: '',
    category_id: '',
    contact_person: '',
    phone: '',
    email: '',
    contact_link: '',
    proposal_link: '',
    proposal_status: 'pending' as const,
    service_value: '',
    notes: '',
    google_rating: '',
    google_reviews_count: '',
    google_maps_url: '',
    next_contact_date: '',
    priority: 'normal' as const
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [stateCities, setStateCities] = useState<City[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [loadingTags, setLoadingTags] = useState(false)

  // Carregar tags disponíveis e tags do site
  useEffect(() => {
    if (open && site) {
      loadTagsData()
    }
  }, [open, site])

  const loadTagsData = async () => {
    try {
      setLoadingTags(true)
      const [tags, siteTagIds] = await Promise.all([
        getTags(),
        getSiteTagIds(site.id)
      ])
      setAvailableTags(tags)
      setSelectedTagIds(siteTagIds)
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    } finally {
      setLoadingTags(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  // Initialize form data when site changes and load cities
  useEffect(() => {
    const initializeFormData = async () => {
      if (site) {
        const stateId = site.city?.state_id || site.city?.state?.id || ''
        
        // Carregar cidades do estado antes de definir o formData completo
        if (stateId) {
          try {
            const citiesResult = await getCitiesByState(stateId)
            setStateCities(citiesResult)
          } catch (err) {
            console.error('Erro ao carregar cidades:', err)
          }
        }
        
        setFormData({
          company_name: site.company_name || '',
          website_url: site.website_url || '',
          state_id: stateId,
          city_id: site.city_id || '',
          category_id: site.category_id || '',
          contact_person: site.contact_person || '',
          phone: site.phone || '',
          email: site.email || '',
          contact_link: site.contact_link || '',
          proposal_link: site.proposal_link || '',
          proposal_status: site.proposal_status || 'pending',
          service_value: site.service_value ? `R$ ${site.service_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
          notes: site.notes || '',
          google_rating: site.google_rating?.toString() || '',
          google_reviews_count: site.google_reviews_count?.toString() || '',
          google_maps_url: site.google_maps_url || '',
          next_contact_date: site.next_contact_date || '',
          priority: site.priority || 'normal'
        })
      }
    }
    
    initializeFormData()
  }, [site])

  // Recarregar cidades quando o estado muda manualmente (não na inicialização)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  useEffect(() => {
    // Na inicialização, as cidades já foram carregadas no useEffect acima
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }
    
    const loadCities = async () => {
      if (!formData.state_id) {
        setStateCities([])
        return
      }
      try {
        const result = await getCitiesByState(formData.state_id)
        setStateCities(result)
      } catch (err) {
        console.error('Erro ao carregar cidades:', err)
      }
    }

    loadCities()
  }, [formData.state_id])

  const availableCities = stateCities

  const handleStateChange = (stateId: string) => {
    setFormData(prev => ({
      ...prev,
      state_id: stateId,
      city_id: '' // Reset city when state changes
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.company_name || !formData.city_id || !formData.category_id) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (formData.proposal_status === 'paid' && !formData.service_value) {
      setError('O valor do serviço é obrigatório para status "Projeto Pago"')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Verificar se o status mudou para registrar no histórico
      const statusChanged = formData.proposal_status !== site.proposal_status
      
      await updateCaptationSite({
        id: site.id,
        company_name: formData.company_name,
        website_url: formData.website_url || undefined,
        city_id: formData.city_id,
        category_id: formData.category_id,
        contact_person: formData.contact_person || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        contact_link: formData.contact_link || undefined,
        proposal_link: formData.proposal_link || undefined,
        proposal_status: formData.proposal_status,
        service_value: formData.service_value ? parseFloat(formData.service_value.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
        notes: formData.notes || undefined,
        google_rating: formData.google_rating ? parseFloat(formData.google_rating) : undefined,
        google_reviews_count: formData.google_reviews_count ? parseInt(formData.google_reviews_count) : undefined,
        google_maps_url: formData.google_maps_url || undefined,
        next_contact_date: formData.next_contact_date || undefined,
        priority: formData.priority || 'normal'
      })
      
      // Registrar alteração de status no histórico
      if (statusChanged) {
        await addStatusHistory(site.id, site.proposal_status, formData.proposal_status)
      }

      // Atualizar tags do site
      await updateSiteTags(site.id, selectedTagIds)
      
      onSiteUpdated()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError(null)
      
      await deleteCaptationSite(site.id)
      
      onSiteUpdated()
      onOpenChange(false)
      setShowDeleteConfirm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    if (!loading && !deleting) {
      onOpenChange(false)
      setError(null)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            Editar Site: {site?.company_name}
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-md">
              <h3 className="font-semibold text-red-400">Confirmar Exclusão</h3>
              <p className="text-red-300 mt-2">
                Tem certeza que deseja excluir o site <strong className="text-white">{site?.company_name}</strong>? 
                Esta ação não pode ser desfeita.
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-slate-200">Nome da Empresa *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Ex: Advocacia Silva & Associados"
                  required
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-slate-200">Website</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://exemplo.com.br"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-200">Estado *</Label>
                <Select value={formData.state_id} onValueChange={handleStateChange} required>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecionar Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {states
                      .filter(state => state.name !== 'Não identificada')
                      .map(state => (
                        <SelectItem key={state.id} value={state.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                          {state.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-200">Cidade *</Label>
                <Select 
                  value={formData.city_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city_id: value }))}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecionar Cidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {availableCities
                      .sort((a, b) => {
                        if (a.name === 'Não identificada') return -1
                        if (b.name === 'Não identificada') return 1
                        return a.name.localeCompare(b.name)
                      })
                      .map(city => (
                        <SelectItem key={city.id} value={city.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                          {city.name} {city.population ? `(${city.population.toLocaleString()} hab.)` : ''}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-200">Categoria *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecionar Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
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

              <div className="space-y-2">
                <Label htmlFor="proposal_status" className="text-slate-200">Status da Proposta</Label>
                <Select 
                  value={formData.proposal_status} 
                  onValueChange={(value: 'pending' | 'accepted' | 'rejected') => 
                    setFormData(prev => ({ ...prev, proposal_status: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="pending" className="text-slate-200 focus:bg-slate-700 focus:text-white">Pendente</SelectItem>
                    <SelectItem value="to_send" className="text-slate-200 focus:bg-slate-700 focus:text-white">A Enviar</SelectItem>
                    <SelectItem value="accepted" className="text-slate-200 focus:bg-slate-700 focus:text-white">Aceita</SelectItem>
                    <SelectItem value="rejected" className="text-slate-200 focus:bg-slate-700 focus:text-white">Negada</SelectItem>
                    <SelectItem value="in_progress" className="text-slate-200 focus:bg-slate-700 focus:text-white">Em Execução</SelectItem>
                    <SelectItem value="paid" className="text-slate-200 focus:bg-slate-700 focus:text-white">Projeto Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person" className="text-slate-200">Pessoa de Contato</Label>  
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="Nome do responsável"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-200">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@exemplo.com"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_link" className="text-slate-200">Link de Contato</Label>
                <Input
                  id="contact_link"
                  type="url"
                  value={formData.contact_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_link: e.target.value }))}
                  placeholder="Link do WhatsApp, formulário, etc."
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposal_link" className="text-slate-200">Link da Proposta</Label>
                <Input
                  id="proposal_link"
                  type="url"
                  value={formData.proposal_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposal_link: e.target.value }))}
                  placeholder="Link da proposta enviada"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Campos do Google Maps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="google_rating" className="flex items-center gap-2 text-slate-200">
                  <Star className="w-4 h-4 text-amber-500" />
                  Avaliação Google
                </Label>
                <Input
                  id="google_rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.google_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, google_rating: e.target.value }))}
                  placeholder="4.5"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_reviews_count" className="text-slate-200">Qtd. Avaliações</Label>
                <Input
                  id="google_reviews_count"
                  type="number"
                  min="0"
                  value={formData.google_reviews_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, google_reviews_count: e.target.value }))}
                  placeholder="150"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_maps_url" className="flex items-center gap-2 text-slate-200">
                  <Map className="w-4 h-4 text-blue-500" />
                  Link Google Maps
                </Label>
                <Input
                  id="google_maps_url"
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, google_maps_url: e.target.value }))}
                  placeholder="https://www.google.com/maps/place/..."
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Campos de Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next_contact_date" className="flex items-center gap-2 text-slate-200">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Próximo Contato
                </Label>
                <Input
                  id="next_contact_date"
                  type="date"
                  value={formData.next_contact_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_contact_date: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
                <p className="text-xs text-slate-500">
                  Agende a data do próximo follow-up
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-slate-200">Prioridade</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="low" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        Baixa
                      </div>
                    </SelectItem>
                    <SelectItem value="normal" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Normal
                      </div>
                    </SelectItem>
                    <SelectItem value="high" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seção de Tags */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-slate-200">
                <Tags className="w-4 h-4 text-indigo-500" />
                Tags
              </Label>
              {loadingTags ? (
                <p className="text-sm text-slate-400">Carregando tags...</p>
              ) : availableTags.length === 0 ? (
                <p className="text-sm text-slate-400">Nenhuma tag disponível. Crie tags no gerenciador de tags.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => {
                    const isSelected = selectedTagIds.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                          isSelected 
                            ? 'text-white shadow-sm' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                        style={isSelected ? { backgroundColor: tag.color } : undefined}
                      >
                        {tag.name}
                        {isSelected && <X className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              )}
              {selectedTagIds.length > 0 && (
                <p className="text-xs text-slate-400">
                  {selectedTagIds.length} tag{selectedTagIds.length > 1 ? 's' : ''} selecionada{selectedTagIds.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {formData.proposal_status === 'paid' && (
              <div className="space-y-2">
                <Label htmlFor="service_value" className="flex items-center gap-2 text-slate-200">
                  <DollarSign className="w-4 h-4" />
                  Valor do Serviço
                </Label>
                <Input
                  id="service_value"
                  type="text"
                  value={formData.service_value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,]/g, '')
                    const formatted = value ? `R$ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''
                    setFormData(prev => ({ ...prev, service_value: formatted }))
                  }}
                  placeholder="R$ 0,00"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500">
                  Valor total do projeto (obrigatório para status "Projeto Pago")
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-200">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Anotações adicionais sobre o contato, negociação, etc."
                rows={3}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* Histórico de Status */}
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800">
              <StatusHistory siteId={site.id} />
            </div>

            <DialogFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Site
              </Button>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 