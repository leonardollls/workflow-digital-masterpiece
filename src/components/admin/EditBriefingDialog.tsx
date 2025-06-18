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
              {/* Página 1: Sua Empresa */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-pink-800">Página 1: Sua Empresa</h3>
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
                    <Label htmlFor="business_segment">Segmento de Atuação *</Label>
                    <Select
                      value={formData.business_segment || ''}
                      onValueChange={(value) => handleInputChange('business_segment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="consultoria">Consultoria</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="company_description">Descrição da Empresa *</Label>
                    <Textarea
                      id="company_description"
                      value={formData.company_description || ''}
                      onChange={(e) => handleInputChange('company_description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="target_audience">Público-Alvo *</Label>
                    <Textarea
                      id="target_audience"
                      value={formData.target_audience || ''}
                      onChange={(e) => handleInputChange('target_audience', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="competitive_advantage">Diferencial Competitivo *</Label>
                    <Textarea
                      id="competitive_advantage"
                      value={formData.competitive_advantage || ''}
                      onChange={(e) => handleInputChange('competitive_advantage', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="landing_page_goal">Objetivo da Landing Page *</Label>
                    <Select
                      value={formData.landing_page_goal || ''}
                      onValueChange={(value) => handleInputChange('landing_page_goal', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qual o principal objetivo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendas">Aumentar Vendas</SelectItem>
                        <SelectItem value="leads">Capturar Leads</SelectItem>
                        <SelectItem value="agendamentos">Gerar Agendamentos</SelectItem>
                        <SelectItem value="cadastros">Aumentar Cadastros</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="main_competitors">Principais Concorrentes</Label>
                    <Textarea
                      id="main_competitors"
                      value={formData.main_competitors || ''}
                      onChange={(e) => handleInputChange('main_competitors', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="customer_pain_points">Principais Dores do Cliente</Label>
                    <Textarea
                      id="customer_pain_points"
                      value={formData.customer_pain_points || ''}
                      onChange={(e) => handleInputChange('customer_pain_points', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="success_stories">Histórias de Sucesso</Label>
                    <Textarea
                      id="success_stories"
                      value={formData.success_stories || ''}
                      onChange={(e) => handleInputChange('success_stories', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="social_proof">Prova Social Disponível</Label>
                    <Textarea
                      id="social_proof"
                      value={formData.social_proof || ''}
                      onChange={(e) => handleInputChange('social_proof', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Página 2: Produto/Serviço */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-green-800">Página 2: Produto/Serviço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible_name">Nome do Responsável *</Label>
                    <Input
                      id="responsible_name"
                      value={formData.responsible_name || ''}
                      onChange={(e) => handleInputChange('responsible_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_website">Site Atual (se houver)</Label>
                    <Input
                      id="current_website"
                      value={formData.current_website || ''}
                      onChange={(e) => handleInputChange('current_website', e.target.value)}
                      placeholder="https://seusite.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="product_name">Nome do Produto/Serviço Principal *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name || ''}
                      onChange={(e) => handleInputChange('product_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="product_description">Descrição Detalhada do Produto/Serviço *</Label>
                    <Textarea
                      id="product_description"
                      value={formData.product_description || ''}
                      onChange={(e) => handleInputChange('product_description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="main_benefits">Principais Benefícios *</Label>
                    <Textarea
                      id="main_benefits"
                      value={formData.main_benefits || ''}
                      onChange={(e) => handleInputChange('main_benefits', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="number_of_offers">Quantas Ofertas Terá na Landing Page?</Label>
                    <Select
                      value={formData.number_of_offers || ''}
                      onValueChange={(value) => handleInputChange('number_of_offers', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 oferta (mais simples)</SelectItem>
                        <SelectItem value="2">2 ofertas (básica + premium)</SelectItem>
                        <SelectItem value="3">3 ofertas (básica + intermediária + premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="offer_details">Detalhes das Ofertas e Valores Exatos</Label>
                    <Textarea
                      id="offer_details"
                      value={formData.offer_details || ''}
                      onChange={(e) => handleInputChange('offer_details', e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricing_model">Modelo de Precificação</Label>
                    <Select
                      value={formData.pricing_model || ''}
                      onValueChange={(value) => handleInputChange('pricing_model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Como será a precificação?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagamento-unico">Pagamento único</SelectItem>
                        <SelectItem value="parcelado">Parcelado</SelectItem>
                        <SelectItem value="assinatura">Assinatura mensal</SelectItem>
                        <SelectItem value="assinatura-anual">Assinatura anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="call_to_action">Call-to-Action Principal *</Label>
                    <Input
                      id="call_to_action"
                      value={formData.call_to_action || ''}
                      onChange={(e) => handleInputChange('call_to_action', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_destination">Para onde direcionar os leads? *</Label>
                    <Select
                      value={formData.lead_destination || ''}
                      onValueChange={(value) => handleInputChange('lead_destination', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="formulario">Formulário de contato</SelectItem>
                        <SelectItem value="email">Email direto</SelectItem>
                        <SelectItem value="checkout">Página de checkout</SelectItem>
                        <SelectItem value="agendamento">Sistema de agendamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Página 3: Visual & Marketing */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-purple-800">Página 3: Visual & Marketing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="brand_colors">Cores da Marca</Label>
                    <Input
                      id="brand_colors"
                      value={formData.brand_colors || ''}
                      onChange={(e) => handleInputChange('brand_colors', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="has_logo">Logo da Empresa</Label>
                    <Select
                      value={formData.has_logo || ''}
                      onValueChange={(value) => handleInputChange('has_logo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Você tem logo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tem-logo">Sim, tenho logo profissional</SelectItem>
                        <SelectItem value="logo-simples">Tenho algo simples que pode ser melhorado</SelectItem>
                        <SelectItem value="sem-logo">Não tenho logo, preciso criar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="visual_references">Referências Visuais</Label>
                    <Textarea
                      id="visual_references"
                      value={formData.visual_references || ''}
                      onChange={(e) => handleInputChange('visual_references', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="content_materials">Materiais Próprios para a Landing Page</Label>
                    <Textarea
                      id="content_materials"
                      value={formData.content_materials || ''}
                      onChange={(e) => handleInputChange('content_materials', e.target.value)}
                      rows={3}
                    />
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
                  <div>
                    <Label htmlFor="communication_tone">Tom de Comunicação</Label>
                    <Select
                      value={formData.communication_tone || ''}
                      onValueChange={(value) => handleInputChange('communication_tone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Como prefere se comunicar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal e profissional</SelectItem>
                        <SelectItem value="informal">Informal e próximo</SelectItem>
                        <SelectItem value="emocional">Emocional e inspirador</SelectItem>
                        <SelectItem value="direto">Direto e objetivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="key_messages">Mensagens-Chave</Label>
                    <Textarea
                      id="key_messages"
                      value={formData.key_messages || ''}
                      onChange={(e) => handleInputChange('key_messages', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="landing_page_sections">Seções da Landing Page</Label>
                    <Textarea
                      id="landing_page_sections"
                      value={formData.landing_page_sections || ''}
                      onChange={(e) => handleInputChange('landing_page_sections', e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specific_requirements">Requisitos Específicos</Label>
                    <Textarea
                      id="specific_requirements"
                      value={formData.specific_requirements || ''}
                      onChange={(e) => handleInputChange('specific_requirements', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Página 4: Configurações Técnicas */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-800">Página 4: Configurações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="desired_domain">Domínio Desejado</Label>
                    <Input
                      id="desired_domain"
                      value={formData.desired_domain || ''}
                      onChange={(e) => handleInputChange('desired_domain', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="integrations">Integrações Necessárias</Label>
                    <Textarea
                      id="integrations"
                      value={formData.integrations || ''}
                      onChange={(e) => handleInputChange('integrations', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="analytics_tracking">Analytics e Tracking</Label>
                    <Textarea
                      id="analytics_tracking"
                      value={formData.analytics_tracking || ''}
                      onChange={(e) => handleInputChange('analytics_tracking', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Página 5: Timeline */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-red-800">Página 5: Timeline</h3>
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
                  <div className="md:col-span-2">
                    <Label htmlFor="additional_notes">Observações Adicionais</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes || ''}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      rows={4}
                    />
                  </div>
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