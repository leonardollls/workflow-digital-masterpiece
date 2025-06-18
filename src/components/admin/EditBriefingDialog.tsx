import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Edit, Save, X } from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import { updateBriefing } from '@/services/briefingService'

interface EditBriefingDialogProps {
  briefing: ClientBriefing
  onUpdate: (updatedBriefing: ClientBriefing) => void
}

export const EditBriefingDialog = ({ briefing, onUpdate }: EditBriefingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ClientBriefing>>(briefing)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedBriefing = await updateBriefing(briefing.id!, formData)
      onUpdate(updatedBriefing)
      setIsOpen(false)
      console.log('✅ Briefing atualizado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao atualizar briefing:', error)
      alert('Erro ao atualizar briefing. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ClientBriefing, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Briefing - {briefing.company_name}
          </DialogTitle>
          <DialogDescription>
            Edite as informações do briefing conforme necessário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ScrollArea className="flex-1 max-h-[70vh] pr-4">
            <div className="space-y-6 pb-4">
              {/* Informações da Empresa */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Nome da Empresa *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_segment">Segmento *</Label>
                    <Select
                      value={formData.business_segment || ''}
                      onValueChange={(value) => handleInputChange('business_segment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="consultoria">Consultoria</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="moda">Moda e Beleza</SelectItem>
                        <SelectItem value="imobiliario">Imobiliário</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="company_description">Descrição do Negócio *</Label>
                    <Textarea
                      id="company_description"
                      value={formData.company_description || ''}
                      onChange={(e) => handleInputChange('company_description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="target_audience">Público-Alvo *</Label>
                    <Textarea
                      id="target_audience"
                      value={formData.target_audience || ''}
                      onChange={(e) => handleInputChange('target_audience', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="competitive_advantage">Diferencial Competitivo *</Label>
                    <Textarea
                      id="competitive_advantage"
                      value={formData.competitive_advantage || ''}
                      onChange={(e) => handleInputChange('competitive_advantage', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="landing_page_goal">Objetivo da Landing Page *</Label>
                    <Textarea
                      id="landing_page_goal"
                      value={formData.landing_page_goal || ''}
                      onChange={(e) => handleInputChange('landing_page_goal', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Produto/Serviço */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Produto/Serviço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible_name">Responsável *</Label>
                    <Input
                      id="responsible_name"
                      value={formData.responsible_name || ''}
                      onChange={(e) => handleInputChange('responsible_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product_name">Nome do Produto/Serviço *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name || ''}
                      onChange={(e) => handleInputChange('product_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="product_description">Descrição do Produto *</Label>
                    <Textarea
                      id="product_description"
                      value={formData.product_description || ''}
                      onChange={(e) => handleInputChange('product_description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="main_benefits">Principais Benefícios *</Label>
                    <Textarea
                      id="main_benefits"
                      value={formData.main_benefits || ''}
                      onChange={(e) => handleInputChange('main_benefits', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_range">Faixa de Preço</Label>
                    <Input
                      id="price_range"
                      value={formData.price_range || ''}
                      onChange={(e) => handleInputChange('price_range', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="call_to_action">Call-to-Action *</Label>
                    <Input
                      id="call_to_action"
                      value={formData.call_to_action || ''}
                      onChange={(e) => handleInputChange('call_to_action', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_destination">Destino dos Leads *</Label>
                    <Input
                      id="lead_destination"
                      value={formData.lead_destination || ''}
                      onChange={(e) => handleInputChange('lead_destination', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="number_of_offers">Quantidade de Ofertas</Label>
                    <Input
                      id="number_of_offers"
                      value={formData.number_of_offers || ''}
                      onChange={(e) => handleInputChange('number_of_offers', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="offer_details">Detalhes das Ofertas</Label>
                    <Textarea
                      id="offer_details"
                      value={formData.offer_details || ''}
                      onChange={(e) => handleInputChange('offer_details', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricing_model">Modelo de Cobrança</Label>
                    <Input
                      id="pricing_model"
                      value={formData.pricing_model || ''}
                      onChange={(e) => handleInputChange('pricing_model', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guarantees">Garantias</Label>
                    <Input
                      id="guarantees"
                      value={formData.guarantees || ''}
                      onChange={(e) => handleInputChange('guarantees', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Design & Branding */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Design & Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand_colors">Cores da Marca</Label>
                    <Input
                      id="brand_colors"
                      value={formData.brand_colors || ''}
                      onChange={(e) => handleInputChange('brand_colors', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="has_logo">Possui Logo</Label>
                    <Select
                      value={formData.has_logo || ''}
                      onValueChange={(value) => handleInputChange('has_logo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="brand_personality">Personalidade da Marca</Label>
                    <Textarea
                      id="brand_personality"
                      value={formData.brand_personality || ''}
                      onChange={(e) => handleInputChange('brand_personality', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="communication_tone">Tom de Comunicação</Label>
                    <Textarea
                      id="communication_tone"
                      value={formData.communication_tone || ''}
                      onChange={(e) => handleInputChange('communication_tone', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="visual_references">Referências Visuais</Label>
                    <Textarea
                      id="visual_references"
                      value={formData.visual_references || ''}
                      onChange={(e) => handleInputChange('visual_references', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Configurações Técnicas */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Configurações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="domain_info">Informações do Domínio *</Label>
                    <Textarea
                      id="domain_info"
                      value={formData.domain_info || ''}
                      onChange={(e) => handleInputChange('domain_info', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="desired_domain">Domínio Desejado</Label>
                    <Input
                      id="desired_domain"
                      value={formData.desired_domain || ''}
                      onChange={(e) => handleInputChange('desired_domain', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="integrations">Integrações</Label>
                    <Textarea
                      id="integrations"
                      value={formData.integrations || ''}
                      onChange={(e) => handleInputChange('integrations', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="analytics_tracking">Analytics & Tracking</Label>
                    <Textarea
                      id="analytics_tracking"
                      value={formData.analytics_tracking || ''}
                      onChange={(e) => handleInputChange('analytics_tracking', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Timeline */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deadline">Prazo de Entrega *</Label>
                    <Input
                      id="deadline"
                      value={formData.deadline || ''}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_date">Data de Início</Label>
                    <Input
                      id="start_date"
                      value={formData.start_date || ''}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Orçamento</Label>
                    <Input
                      id="budget"
                      value={formData.budget || ''}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Observações */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Observações</h3>
                <div>
                  <Label htmlFor="additional_notes">Observações Adicionais</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes || ''}
                    onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 