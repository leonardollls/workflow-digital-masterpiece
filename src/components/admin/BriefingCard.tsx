import React from 'react'
import { useState } from 'react'
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
  Target,
  DollarSign,
  Calendar,
  Eye,
  Download,
  FileText,
  Clock,
  User,
  Globe,
  Trash2,
  Edit
} from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EditBriefingDialog } from './EditBriefingDialog'
import { ProposalValueDialog } from './ProposalValueDialog'
import { deleteBriefing } from '@/services/briefingService'

interface BriefingCardProps {
  briefing: ClientBriefing
  onUpdate?: (updatedBriefing: ClientBriefing) => void
  onDelete?: (briefingId: string) => void
}

export const BriefingCard = ({ briefing, onUpdate, onDelete }: BriefingCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      })
    } catch {
      return dateString
    }
  }

  const getDeadlineUrgency = (deadline: string) => {
    const days = parseInt(deadline.match(/\d+/)?.[0] || '0')
    if (days <= 10) return { color: 'bg-red-500', text: 'Urgente' }
    if (days <= 20) return { color: 'bg-yellow-500', text: 'Moderado' }
    return { color: 'bg-green-500', text: 'Flexível' }
  }

  const urgency = getDeadlineUrgency(briefing.deadline)

  const handleDelete = async () => {
    if (!briefing.id) {
      console.error('❌ ID do briefing não encontrado para exclusão')
      alert('Erro: ID do briefing não encontrado')
      return
    }

    setIsDeleting(true)
    
    try {
      console.log('🗑️ Iniciando exclusão do briefing:', {
        id: briefing.id,
        company: briefing.company_name
      })
      
      await deleteBriefing(briefing.id)
      
      console.log('✅ Briefing excluído com sucesso, notificando componente pai')
      onDelete?.(briefing.id)
      
      alert('Briefing excluído com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro completo ao excluir briefing:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao excluir briefing: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = (updatedBriefing: ClientBriefing) => {
    onUpdate?.(updatedBriefing)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {briefing.company_name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{briefing.business_segment}</span>
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
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium">{briefing.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{briefing.deadline}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-purple-600" />
              <span className="font-medium">{briefing.responsible_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-gray-600 truncate">{briefing.landing_page_goal}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {briefing.created_at && formatDate(briefing.created_at)}
              </span>
              {briefing.proposal_value && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
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
                  <Button variant="outline" size="sm" className="gap-2 flex-1">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {briefing.company_name}
                  </DialogTitle>
                  <DialogDescription>
                    Briefing completo recebido em {briefing.created_at && formatDate(briefing.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-6 pr-4">
                    {/* Informações da Empresa */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Informações da Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nome da Empresa</label>
                          <p className="text-gray-900">{briefing.company_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Segmento</label>
                          <p className="text-gray-900">{briefing.business_segment}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Descrição do Negócio</label>
                          <p className="text-gray-900 mt-1">{briefing.company_description}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Público-Alvo</label>
                          <p className="text-gray-900 mt-1">{briefing.target_audience}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Diferencial Competitivo</label>
                          <p className="text-gray-900 mt-1">{briefing.competitive_advantage}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Objetivo da Landing Page</label>
                          <p className="text-gray-900 mt-1">{briefing.landing_page_goal}</p>
                        </div>
                      </div>
                    </section>

                    {/* Produto/Serviço */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Produto/Serviço
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Responsável</label>
                          <p className="text-gray-900">{briefing.responsible_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                          <p className="text-gray-900">{briefing.product_name}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Descrição do Produto</label>
                          <p className="text-gray-900 mt-1">{briefing.product_description}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Principais Benefícios</label>
                          <p className="text-gray-900 mt-1">{briefing.main_benefits}</p>
                        </div>
                        {briefing.price_range && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Faixa de Preço</label>
                            <p className="text-gray-900">{briefing.price_range}</p>
                          </div>
                        )}
                        {briefing.guarantees && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Garantias</label>
                            <p className="text-gray-900">{briefing.guarantees}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Marketing & Design */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Marketing & Design
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Call-to-Action</label>
                          <p className="text-gray-900">{briefing.call_to_action}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Destino dos Leads</label>
                          <p className="text-gray-900">{briefing.lead_destination}</p>
                        </div>
                        {briefing.brand_colors && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Cores da Marca</label>
                            <p className="text-gray-900">{briefing.brand_colors}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-700">Possui Logo</label>
                          <p className="text-gray-900">{briefing.has_logo}</p>
                        </div>
                        {briefing.visual_references && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Referências Visuais</label>
                            <p className="text-gray-900 mt-1">{briefing.visual_references}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Configurações Técnicas */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-orange-600" />
                        Configurações Técnicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Informações do Domínio</label>
                          <p className="text-gray-900 mt-1">{briefing.domain_info}</p>
                        </div>
                        {briefing.integrations && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Integrações</label>
                            <p className="text-gray-900 mt-1">{briefing.integrations}</p>
                          </div>
                        )}
                        {briefing.analytics_tracking && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Analytics & Tracking</label>
                            <p className="text-gray-900 mt-1">{briefing.analytics_tracking}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Timeline & Orçamento */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-600" />
                        Timeline & Orçamento
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Prazo</label>
                          <p className="text-gray-900">{briefing.deadline}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Orçamento</label>
                          <p className="text-gray-900">{briefing.budget}</p>
                        </div>
                        {briefing.start_date && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Data de Início</label>
                            <p className="text-gray-900">{briefing.start_date}</p>
                          </div>
                        )}
                        {briefing.additional_notes && (
                          <div className="md:col-span-3">
                            <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                            <p className="text-gray-900 mt-1">{briefing.additional_notes}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Arquivos */}
                    {(briefing.logo_files?.length || briefing.visual_files?.length || briefing.material_files?.length) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Download className="w-5 h-5 text-indigo-600" />
                          Arquivos Enviados
                        </h3>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          {briefing.logo_files?.length && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Logos</label>
                              <div className="flex flex-wrap gap-2">
                                {briefing.logo_files.map((file, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open(file, '_blank')}
                                  >
                                    <Download className="w-4 h-4" />
                                    Logo {index + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          {briefing.visual_files?.length && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Referências Visuais</label>
                              <div className="flex flex-wrap gap-2">
                                {briefing.visual_files.map((file, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open(file, '_blank')}
                                  >
                                    <Download className="w-4 h-4" />
                                    Referência {index + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          {briefing.material_files?.length && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Materiais</label>
                              <div className="flex flex-wrap gap-2">
                                {briefing.material_files.map((file, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open(file, '_blank')}
                                  >
                                    <Download className="w-4 h-4" />
                                    Material {index + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            {onUpdate && (
              <EditBriefingDialog 
                briefing={briefing} 
                onUpdate={handleUpdate} 
              />
            )}
            
            {onUpdate && (
              <ProposalValueDialog 
                briefing={briefing} 
                onUpdate={handleUpdate} 
              />
            )}
            
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
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o briefing de <strong>{briefing.company_name}</strong>? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
    </>
  )
} 