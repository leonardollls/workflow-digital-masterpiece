import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Building2,
  DollarSign,
  Calendar,
  Eye,
  Trash2,
  Target,
  Sparkles,
  User,
  Palette,
  MessageSquare,
  CheckCircle,
  Image as ImageIcon,
  Globe,
  TrendingUp,
  ShoppingBag,
  LayoutGrid,
  FileCheck
} from 'lucide-react'
import type { LandingPageBriefing } from '@/services/briefingService'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { deleteLandingPageBriefing, addLandingPageProposalValue } from '@/services/briefingService'
import { Input } from '@/components/ui/input'

interface LandingPageBriefingCardProps {
  briefing: LandingPageBriefing
  onUpdate?: (updatedBriefing: LandingPageBriefing) => void
  onDelete?: (briefingId: string) => void
}

export const LandingPageBriefingCard = ({ briefing, onUpdate, onDelete }: LandingPageBriefingCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const [proposalValue, setProposalValue] = useState(briefing.proposal_value?.toString() || '')
  const [isSavingProposal, setIsSavingProposal] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      })
    } catch {
      return dateString
    }
  }

  const formatShortDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", {
        locale: ptBR
      })
    } catch {
      return dateString
    }
  }

  const getUrgency = () => {
    if (!briefing.deadline) return { text: 'Flexível', color: 'bg-green-600' }
    
    const deadline = new Date(briefing.deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 10) return { text: 'Urgente', color: 'bg-red-500' }
    if (diffDays <= 20) return { text: 'Moderado', color: 'bg-yellow-500' }
    return { text: 'Flexível', color: 'bg-green-600' }
  }

  const urgency = getUrgency()

  const handleDelete = async () => {
    if (!briefing.id) {
      console.error('❌ ID do briefing não encontrado para exclusão')
      alert('Erro: ID do briefing não encontrado')
      return
    }

    setIsDeleting(true)
    
    try {
      await deleteLandingPageBriefing(briefing.id)
      console.log('✅ Briefing de landing page excluído com sucesso')
      
      setTimeout(() => {
        onDelete?.(briefing.id!)
        alert('Briefing excluído com sucesso!')
      }, 500)
      
    } catch (error) {
      console.error('❌ Erro ao excluir briefing:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao excluir briefing: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveProposal = async () => {
    if (!proposalValue || isNaN(parseFloat(proposalValue))) {
      alert('Por favor, insira um valor válido.')
      return
    }

    setIsSavingProposal(true)
    
    try {
      const updatedBriefing = await addLandingPageProposalValue(briefing.id, parseFloat(proposalValue))
      onUpdate?.(updatedBriefing)
      setIsProposalDialogOpen(false)
      alert('Proposta salva com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao salvar proposta:', error)
      alert('Erro ao salvar proposta. Tente novamente.')
    } finally {
      setIsSavingProposal(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-slate-900 border border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-white mb-1">
              {briefing.company_name || 'Nome não informado'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Building2 className="w-4 h-4" />
              <span>{briefing.business_segment || 'Segmento não informado'}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-purple-500 font-medium">Landing Page</span>
            </div>
          </div>
          <Badge className={`${urgency.color} text-white`}>
            {urgency.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-200 truncate text-xs">
              {briefing.budget || 'Valor Acordado na Workana'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-200 text-xs">{formatShortDate(briefing.created_at)}</span>
          </div>
        </div>

        <div className="space-y-2">
          {briefing.responsible_name && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 truncate">{briefing.responsible_name}</span>
            </div>
          )}
          {briefing.landing_page_goal && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400 truncate">{briefing.landing_page_goal}</span>
            </div>
          )}
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {formatShortDate(briefing.created_at)}
            </span>
            {briefing.proposal_value && (
              <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-400 border border-emerald-700">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(briefing.proposal_value)}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-purple-400" />
                    {briefing.company_name || 'Nome não informado'}
                  </DialogTitle>
                  <DialogDescription className="space-y-1 text-slate-400">
                    <div>Briefing recebido em {formatDate(briefing.created_at)}</div>
                    <div className="text-xs text-emerald-500 font-medium">Desenvolvedor: Leonardo Lopes</div>
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh] pr-4">
                  <div className="space-y-6">
                    {/* Seção 1: Informações da Empresa */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Building2 className="w-5 h-5 text-purple-400" />
                        Step 1: Informações da Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">1. Nome da Empresa/Marca</label>
                          <p className="text-white mt-1">{briefing.company_name || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">2. Segmento/Nicho</label>
                          <p className="text-white mt-1">{briefing.business_segment || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">3. Descrição do Negócio</label>
                          <p className="text-white mt-1">{briefing.business_description || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">4. Público-Alvo</label>
                          <p className="text-white mt-1">{briefing.target_audience || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">5. Diferencial Competitivo</label>
                          <p className="text-white mt-1">{briefing.competitive_differential || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">6. Objetivo da Landing Page</label>
                          <p className="text-white mt-1">{briefing.landing_page_goal || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* Seção 2: Estratégia & Mercado */}
                    {(briefing.main_competitors || briefing.customer_pain_points || briefing.success_stories || briefing.social_proof) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          Step 2: Estratégia & Mercado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          {briefing.main_competitors && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">7. Principais Concorrentes</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.main_competitors}</p>
                            </div>
                          )}
                          
                          {briefing.customer_pain_points && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">8. Principais Dores do Cliente</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.customer_pain_points}</p>
                            </div>
                          )}
                          
                          {briefing.success_stories && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">9. Histórias de Sucesso</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.success_stories}</p>
                            </div>
                          )}
                          
                          {briefing.social_proof && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">10. Prova Social Disponível</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.social_proof}</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Seção 3: Produto/Serviço */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        Step 3: Produto/Serviço
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {briefing.responsible_name && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">11. Responsável</label>
                            <p className="text-white mt-1">{briefing.responsible_name}</p>
                          </div>
                        )}
                        
                        {briefing.current_website && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">12. Site Atual</label>
                            <a 
                              href={briefing.current_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 mt-1 block"
                            >
                              {briefing.current_website}
                            </a>
                          </div>
                        )}
                        
                        {briefing.product_name && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">13. Nome do Produto</label>
                            <p className="text-white mt-1">{briefing.product_name}</p>
                          </div>
                        )}
                        
                        {briefing.product_description && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">14. Descrição Detalhada</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.product_description}</p>
                          </div>
                        )}
                        
                        {briefing.main_benefits && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">15. Principais Benefícios</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.main_benefits}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Seção 4: Conversão & Argumentos */}
                    {(briefing.call_to_action || briefing.lead_destination || briefing.sales_arguments) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <Target className="w-5 h-5 text-orange-400" />
                          Step 4: Conversão & Argumentos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          {briefing.call_to_action && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">16. CTA Principal</label>
                              <p className="text-white mt-1">{briefing.call_to_action}</p>
                            </div>
                          )}
                          
                          {briefing.lead_destination && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">17. Destino dos Leads</label>
                              <p className="text-white mt-1">{briefing.lead_destination}</p>
                            </div>
                          )}
                          
                          {briefing.sales_arguments && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">18. Principais Argumentos de Venda</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.sales_arguments}</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Seção 5: Design & Identidade */}
                    {(briefing.brand_colors || briefing.has_logo || briefing.brand_personality) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <Palette className="w-5 h-5 text-pink-400" />
                          Step 5: Design & Identidade
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          {briefing.brand_colors && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">19. Cores da Marca</label>
                              <p className="text-white mt-1">{briefing.brand_colors}</p>
                            </div>
                          )}
                          
                          {briefing.has_logo && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">20. Logo</label>
                              <p className="text-white mt-1">{briefing.has_logo}</p>
                            </div>
                          )}
                          
                          {briefing.brand_personality && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">21. Personalidade da Marca</label>
                              <p className="text-white mt-1">{briefing.brand_personality}</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Seção 6: Estrutura & Funcionalidades */}
                    {(briefing.landing_page_sections || briefing.specific_requirements) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <LayoutGrid className="w-5 h-5 text-cyan-400" />
                          Step 6: Estrutura & Funcionalidades
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          {briefing.landing_page_sections && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">22. Seções da Landing Page</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.landing_page_sections}</p>
                            </div>
                          )}
                          
                          {briefing.specific_requirements && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">23. Requisitos Específicos</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.specific_requirements}</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Seção 7: Finalização */}
                    {briefing.additional_notes && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <FileCheck className="w-5 h-5 text-green-400" />
                          Step 7: Finalização
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">24. Observações Adicionais</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.additional_notes}</p>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Informações de Proposta */}
                    {briefing.proposal_value && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <DollarSign className="w-5 h-5 text-emerald-400" />
                          Proposta Comercial
                        </h3>
                        <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Valor da Proposta:</span>
                            <span className="text-2xl font-bold text-emerald-400">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(briefing.proposal_value)}
                            </span>
                          </div>
                          {briefing.proposal_date && (
                            <p className="text-sm text-slate-400 mt-2">
                              Proposta enviada em {formatDate(briefing.proposal_date)}
                            </p>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            {/* Botão de Adicionar Proposta */}
            <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-300"
                >
                  <DollarSign className="w-4 h-4" />
                  {briefing.proposal_value ? 'Editar' : 'Proposta'}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Valor da Proposta</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Insira o valor da proposta para {briefing.company_name || 'este briefing'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">R$</span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={proposalValue}
                      onChange={(e) => setProposalValue(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProposal}
                    disabled={isSavingProposal}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSavingProposal ? 'Salvando...' : 'Salvar Proposta'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      Tem certeza que deseja excluir o briefing de <strong>{briefing.company_name || 'esta landing page'}</strong>? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir Briefing
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
