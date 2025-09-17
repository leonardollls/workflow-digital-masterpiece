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
  Edit,
  Star,
  Palette,
  Settings,
  Monitor,
  Users
} from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import type { InstitutionalBriefing } from '@/services/briefingService'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EditBriefingDialog } from './EditBriefingDialog'
import { ProposalValueDialog } from './ProposalValueDialog'
import { deleteBriefing, deleteInstitutionalBriefing } from '@/services/briefingService'

interface BriefingCardProps {
  briefing: ClientBriefing | InstitutionalBriefing
  onUpdate?: (updatedBriefing: ClientBriefing | InstitutionalBriefing) => void
  onDelete?: (briefingId: string) => void
}

// Type guard para verificar se é um briefing institucional
const isInstitutionalBriefing = (briefing: ClientBriefing | InstitutionalBriefing): briefing is InstitutionalBriefing => {
  return 'website_goal' in briefing && 'website_type' in briefing
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

  // Calcular urgência baseado no deadline
  const getUrgency = () => {
    if (!briefing.deadline) return { text: 'Sem prazo', color: 'bg-gray-500' }
    
    const deadline = new Date(briefing.deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 10) return { text: 'Urgente', color: 'bg-red-500' }
    if (diffDays <= 20) return { text: 'Moderado', color: 'bg-yellow-500' }
    return { text: 'Flexível', color: 'bg-green-500' }
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
      console.log('🗑️ Iniciando exclusão do briefing:', {
        id: briefing.id,
        company: briefing.company_name
      })
      
      if (isInstitutionalBriefing(briefing)) {
        await deleteInstitutionalBriefing(briefing.id)
      } else {
      await deleteBriefing(briefing.id)
      }
      
      console.log('✅ Briefing excluído com sucesso, notificando componente pai')
      
      // Aguardar um pouco para garantir que a exclusão foi processada
      setTimeout(() => {
        onDelete?.(briefing.id!)
        alert('Briefing excluído com sucesso!')
      }, 500)
      
    } catch (error) {
      console.error('❌ Erro completo ao excluir briefing:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao excluir briefing: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = (updatedBriefing: ClientBriefing | InstitutionalBriefing) => {
    onUpdate?.(updatedBriefing)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {briefing.company_name || 'Nome não informado'}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{briefing.business_segment || 'Segmento não informado'}</span>
              </div>
              {/* Mostrar tipo de projeto */}
              <div className="flex items-center gap-2 mt-1">
                {isInstitutionalBriefing(briefing) ? (
                  <>
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Site Institucional</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">Landing Page</span>
                  </>
                )}
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
              <span className="font-medium">{briefing.budget || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{briefing.deadline || 'Prazo não informado'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-purple-600" />
              <span className="font-medium">{briefing.responsible_name || 'Responsável não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {isInstitutionalBriefing(briefing) ? (
                <>
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600 truncate">{briefing.website_goal || 'Objetivo não informado'}</span>
                </>
              ) : (
                <>
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-gray-600 truncate">{briefing.landing_page_goal || 'Objetivo não informado'}</span>
                </>
              )}
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
                  <DialogDescription className="space-y-1">
                    <div>Briefing completo recebido em {briefing.created_at && formatDate(briefing.created_at)}</div>
                    <div className="text-xs text-blue-600 font-medium">Desenvolvedor: Leonardo Lopes</div>
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-6 pr-4">
                    {isInstitutionalBriefing(briefing) ? (
                      // Detalhes para briefing institucional
                      <>
                        {/* Informações da Empresa */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Informações da Empresa
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Nome da Empresa</label>
                              <p className="text-gray-900">{briefing.company_name || 'Não informado'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Segmento de Atuação</label>
                              <p className="text-gray-900">{briefing.business_segment || 'Não informado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Descrição da Empresa</label>
                              <p className="text-gray-900 mt-1">{briefing.company_description || 'Não informado'}</p>
                            </div>
                            {briefing.company_history && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">História da Empresa</label>
                                <p className="text-gray-900 mt-1">{briefing.company_history}</p>
                              </div>
                            )}
                            {briefing.mission && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Missão</label>
                                <p className="text-gray-900 mt-1">{briefing.mission}</p>
                              </div>
                            )}
                            {briefing.vision && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Visão</label>
                                <p className="text-gray-900 mt-1">{briefing.vision}</p>
                              </div>
                            )}
                            {briefing.values && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Valores</label>
                                <p className="text-gray-900 mt-1">{briefing.values}</p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Objetivos do Site */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" />
                            Objetivos do Site Institucional
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Objetivo Principal</label>
                              <p className="text-gray-900">{briefing.website_goal || 'Não informado'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Tipo de Site</label>
                              <p className="text-gray-900">{briefing.website_type || 'Não informado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Funcionalidades Principais</label>
                              <p className="text-gray-900 mt-1">{briefing.main_functionalities || 'Não informado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Páginas Necessárias</label>
                              <p className="text-gray-900 mt-1">{briefing.required_pages || 'Não informado'}</p>
                            </div>
                            {briefing.navigation_structure && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Estrutura de Navegação</label>
                                <p className="text-gray-900 mt-1">{briefing.navigation_structure}</p>
                              </div>
                            )}
                            {briefing.content_hierarchy && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Hierarquia de Conteúdo</label>
                                <p className="text-gray-900 mt-1">{briefing.content_hierarchy}</p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Público e Diferencial */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Público e Diferencial
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Público-Alvo</label>
                              <p className="text-gray-900 mt-1">{briefing.target_audience || 'Não informado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Diferencial Competitivo</label>
                              <p className="text-gray-900 mt-1">{briefing.competitive_advantage || 'Não informado'}</p>
                            </div>
                          </div>
                        </section>

                        {/* Informações de Contato */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-orange-600" />
                            Informações de Contato
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Responsável</label>
                              <p className="text-gray-900">{briefing.responsible_name || 'Não informado'}</p>
                            </div>
                            {briefing.current_website && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Site Atual</label>
                                <p className="text-gray-900">
                                  <a href={briefing.current_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {briefing.current_website}
                                  </a>
                                </p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Conteúdo do Site */}
                        {(briefing.services_products || briefing.team_info || briefing.certifications || 
                          briefing.awards_recognition || briefing.case_studies || briefing.testimonials) && (
                          <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-green-600" />
                              Conteúdo do Site
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              {briefing.services_products && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Serviços/Produtos</label>
                                  <p className="text-gray-900 mt-1">{briefing.services_products}</p>
                                </div>
                              )}
                              {briefing.team_info && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Informações da Equipe</label>
                                  <p className="text-gray-900 mt-1">{briefing.team_info}</p>
                                </div>
                              )}
                              {briefing.certifications && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Certificações</label>
                                  <p className="text-gray-900 mt-1">{briefing.certifications}</p>
                                </div>
                              )}
                              {briefing.awards_recognition && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Prêmios e Reconhecimentos</label>
                                  <p className="text-gray-900 mt-1">{briefing.awards_recognition}</p>
                                </div>
                              )}
                              {briefing.case_studies && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Casos de Sucesso</label>
                                  <p className="text-gray-900 mt-1">{briefing.case_studies}</p>
                                </div>
                              )}
                              {briefing.testimonials && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Depoimentos</label>
                                  <p className="text-gray-900 mt-1">{briefing.testimonials}</p>
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Design e Identidade Visual */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-pink-600" />
                            Design e Identidade Visual
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            {briefing.brand_colors && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Cores da Marca</label>
                                <p className="text-gray-900 mt-1">{briefing.brand_colors}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium text-gray-700">Logo da Empresa</label>
                              <p className="text-gray-900 mt-1">{briefing.has_logo}</p>
                            </div>
                            {briefing.logo_files && briefing.logo_files.length > 0 && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Arquivos de Logo</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {briefing.logo_files.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Logo {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {briefing.visual_references && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Referências Visuais</label>
                                <p className="text-gray-900 mt-1">{briefing.visual_references}</p>
                              </div>
                            )}
                            {briefing.visual_files && briefing.visual_files.length > 0 && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Arquivos de Referências Visuais</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {briefing.visual_files.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Referência {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {briefing.design_style && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Estilo de Design</label>
                                <p className="text-gray-900 mt-1">{briefing.design_style}</p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Funcionalidades Técnicas */}
                        {(briefing.contact_forms || briefing.integrations || briefing.seo_requirements || 
                          briefing.analytics_tracking || briefing.domain_info || briefing.hosting_preferences) && (
                          <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Settings className="w-5 h-5 text-gray-600" />
                              Funcionalidades Técnicas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              {briefing.contact_forms && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Formulários de Contato</label>
                                  <p className="text-gray-900 mt-1">{briefing.contact_forms}</p>
                                </div>
                              )}
                              {briefing.integrations && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Integrações Necessárias</label>
                                  <p className="text-gray-900 mt-1">{briefing.integrations}</p>
                                </div>
                              )}
                              {briefing.seo_requirements && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Requisitos de SEO</label>
                                  <p className="text-gray-900 mt-1">{briefing.seo_requirements}</p>
                                </div>
                              )}
                              {briefing.analytics_tracking && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Ferramentas de Analytics</label>
                                  <p className="text-gray-900 mt-1">{briefing.analytics_tracking}</p>
                                </div>
                              )}
                              {briefing.domain_info && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Informações sobre Domínio</label>
                                  <p className="text-gray-900 mt-1">{briefing.domain_info}</p>
                                </div>
                              )}
                              {briefing.hosting_preferences && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Preferências de Hospedagem</label>
                                  <p className="text-gray-900 mt-1">{briefing.hosting_preferences}</p>
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Marketing e Comunicação */}
                        {(briefing.main_competitors || briefing.customer_pain_points || briefing.customer_objections || 
                          briefing.communication_tone || briefing.key_messages) && (
                          <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-indigo-600" />
                              Marketing e Comunicação
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              {briefing.main_competitors && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Principais Concorrentes</label>
                                  <p className="text-gray-900 mt-1">{briefing.main_competitors}</p>
                                </div>
                              )}
                              {briefing.customer_pain_points && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Dores do Cliente</label>
                                  <p className="text-gray-900 mt-1">{briefing.customer_pain_points}</p>
                                </div>
                              )}
                              {briefing.customer_objections && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Objeções dos Clientes</label>
                                  <p className="text-gray-900 mt-1">{briefing.customer_objections}</p>
                                </div>
                              )}
                              {briefing.communication_tone && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Tom de Comunicação</label>
                                  <p className="text-gray-900 mt-1">{briefing.communication_tone}</p>
                                </div>
                              )}
                              {briefing.key_messages && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Mensagens-Chave</label>
                                  <p className="text-gray-900 mt-1">{briefing.key_messages}</p>
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Requisitos e Materiais */}
                        {(briefing.specific_requirements || briefing.content_materials || briefing.material_files) && (
                          <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Settings className="w-5 h-5 text-teal-600" />
                              Requisitos e Materiais
                            </h3>
                            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                              {briefing.specific_requirements && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Requisitos Específicos</label>
                                  <p className="text-gray-900 mt-1">{briefing.specific_requirements}</p>
                                </div>
                              )}
                              {briefing.content_materials && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Materiais Próprios</label>
                                  <p className="text-gray-900 mt-1">{briefing.content_materials}</p>
                                </div>
                              )}
                              {briefing.material_files && briefing.material_files.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Arquivos de Materiais</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {briefing.material_files.map((url, index) => (
                                      <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                      >
                                        Material {index + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Timeline */}
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-600" />
                            Timeline
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Prazo de Entrega</label>
                              <p className="text-gray-900">{briefing.deadline}</p>
                            </div>
                            {briefing.budget && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Orçamento</label>
                                <p className="text-gray-900">{briefing.budget}</p>
                              </div>
                            )}
                            {briefing.start_date && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Data de Início</label>
                                <p className="text-gray-900">{briefing.start_date}</p>
                              </div>
                            )}
                            {briefing.additional_notes && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                                <p className="text-gray-900 mt-1">{briefing.additional_notes}</p>
                              </div>
                            )}
                          </div>
                        </section>
                      </>
                    ) : (
                      // Detalhes para briefing de landing page - REORGANIZADO NA ORDEM DO FORMULÁRIO
                      <>
                    {/* STEP 1: INFORMAÇÕES DA EMPRESA */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Step 1: Informações da Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">1. Nome da Empresa/Marca</label>
                          <p className="text-gray-900">{briefing.company_name || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">2. Segmento/Nicho</label>
                          <p className="text-gray-900">{briefing.business_segment || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">3. Descrição do Negócio</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.company_description || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">4. Público-Alvo</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.target_audience || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">5. Diferencial Competitivo</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.competitive_advantage || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">6. Objetivo da Landing Page</label>
                          <p className="text-gray-900 mt-1">{briefing.landing_page_goal || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">7. Principais Concorrentes</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.main_competitors || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">8. Principais Dores do Cliente</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.customer_pain_points || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">9. Histórias de Sucesso</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.success_stories || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">10. Prova Social Disponível</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.social_proof || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* STEP 2: PRODUTO/SERVIÇO */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Step 2: Produto/Serviço
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">11. Nome do Responsável</label>
                          <p className="text-gray-900">{briefing.responsible_name || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">12. Site Atual (se houver)</label>
                          <p className="text-gray-900">
                            {briefing.current_website ? (
                              <a href={briefing.current_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {briefing.current_website}
                              </a>
                            ) : 'Não informado'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">13. Nome do Produto/Serviço Principal</label>
                          <p className="text-gray-900">{briefing.product_name || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">14. Descrição Detalhada do Produto/Serviço</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.product_description || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">15. Principais Benefícios</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.main_benefits || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">16. Quantas Ofertas Terá na Landing Page?</label>
                          <p className="text-gray-900">{briefing.number_of_offers || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">18. Modelo de Cobrança</label>
                          <p className="text-gray-900">{briefing.pricing_model || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">17. Detalhes das Ofertas e Valores Exatos</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.offer_details || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">19. Garantias Oferecidas</label>
                          <p className="text-gray-900 mt-1">{briefing.guarantees || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">20. Resultados Esperados pelo Cliente</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.target_results || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">21. Fatores de Urgência</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.urgency_factors || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">22. Principais Objeções dos Clientes</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.objections || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* STEP 3: MARKETING & DESIGN */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-orange-600" />
                        Step 3: Marketing & Design
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">23. Call-to-Action Principal</label>
                          <p className="text-gray-900">{briefing.call_to_action || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">24. Para onde direcionar os leads?</label>
                          <p className="text-gray-900">{briefing.lead_destination || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">25. Cores da Marca</label>
                          <p className="text-gray-900">{briefing.brand_colors || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">26. Logo da Empresa</label>
                          <p className="text-gray-900">{briefing.has_logo || 'Não informado'}</p>
                        </div>
                        {briefing.logo_files && briefing.logo_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">27. Upload do Logo</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {briefing.logo_files.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Logo {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">28. Referências Visuais</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.visual_references || 'Não informado'}</p>
                        </div>
                        {briefing.visual_files && briefing.visual_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">29. Upload de Referências Visuais</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {briefing.visual_files.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Referência {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">30. Materiais Próprios para a Landing Page</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.content_materials || 'Não informado'}</p>
                        </div>
                        {briefing.material_files && briefing.material_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">31. Upload dos Seus Materiais</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {briefing.material_files.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Material {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">32. Personalidade da Marca</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.brand_personality || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">33. Tom de Comunicação</label>
                          <p className="text-gray-900">{briefing.communication_tone || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">34. Mensagens-Chave</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.key_messages || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">35. Seções da Landing Page</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.landing_page_sections || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">36. Requisitos Específicos</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.specific_requirements || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* STEP 4: CONFIGURAÇÕES TÉCNICAS */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        Step 4: Configurações Técnicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">37. Domínio Desejado</label>
                          <p className="text-gray-900">{briefing.desired_domain || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Informações de Domínio (Sistema)</label>
                          <p className="text-gray-900">{briefing.domain_info || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">38. Integrações Necessárias</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.integrations || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">39. Analytics e Tracking</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.analytics_tracking || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* STEP 5: TIMELINE & ORÇAMENTO */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-600" />
                        Step 5: Timeline & Orçamento
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">40. Prazo de Entrega</label>
                          <p className="text-gray-900">{briefing.deadline || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">41. Orçamento</label>
                          <p className="text-gray-900">{briefing.budget || 'Não informado'}</p>
                        </div>
                        {briefing.start_date && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Data de Início</label>
                            <p className="text-gray-900">{briefing.start_date}</p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">42. Observações Adicionais</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{briefing.additional_notes || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>
                      </>
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