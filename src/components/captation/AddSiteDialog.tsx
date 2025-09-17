import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import type { State, City, Category } from '@/types/captation'
import { createCaptationSite } from '@/services/captationService'
import { getCitiesByState } from '@/services/captationService'

interface AddSiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  states: State[]
  cities: City[]
  categories: Category[]
  onSiteAdded: () => void
}

export const AddSiteDialog = ({ 
  open, 
  onOpenChange, 
  states, 
  cities, 
  categories, 
  onSiteAdded 
}: AddSiteDialogProps) => {
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
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stateCities, setStateCities] = useState<City[]>([])

  useEffect(() => {
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
      
      await createCaptationSite({
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
        notes: formData.notes || undefined
      })

      // Reset form
      setFormData({
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
        proposal_status: 'pending',
        service_value: '',
        notes: ''
      })
      
      onSiteAdded()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Novo Site
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Ex: Advocacia Silva & Associados"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                placeholder="https://exemplo.com.br"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Select value={formData.state_id} onValueChange={handleStateChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Estado" />
                </SelectTrigger>
                <SelectContent>
                  {states
                    .filter(state => state.name !== 'Não identificada')
                    .map(state => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Select 
                value={formData.city_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, city_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {/* "Não identificada" sempre primeiro */}
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Categoria" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal_status">Status da Proposta</Label>
              <Select 
                value={formData.proposal_status} 
                onValueChange={(value: 'pending' | 'accepted' | 'rejected') => 
                  setFormData(prev => ({ ...prev, proposal_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="to_send">A Enviar</SelectItem>
                  <SelectItem value="accepted">Aceita</SelectItem>
                  <SelectItem value="rejected">Negada</SelectItem>
                  <SelectItem value="in_progress">Em Execução</SelectItem>
                  <SelectItem value="paid">Projeto Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Pessoa de Contato</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contato@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_link">Link de Contato</Label>
              <Input
                id="contact_link"
                type="url"
                value={formData.contact_link}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_link: e.target.value }))}
                placeholder="Link do WhatsApp, formulário, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal_link">Link da Proposta</Label>
              <Input
                id="proposal_link"
                type="url"
                value={formData.proposal_link}
                onChange={(e) => setFormData(prev => ({ ...prev, proposal_link: e.target.value }))}
                placeholder="Link da proposta enviada"
              />
            </div>
          </div>

          {formData.proposal_status === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="service_value">Valor do Serviço</Label>
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
              />
              <p className="text-xs text-gray-500">
                Valor total do projeto (obrigatório para status "Projeto Pago")
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Anotações adicionais sobre o contato, negociação, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 