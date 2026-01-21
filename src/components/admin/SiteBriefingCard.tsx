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
  Globe,
  Settings,
  Award,
  Image as ImageIcon,
  Download
} from 'lucide-react'
import type { SiteBriefing } from '@/services/briefingService'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { deleteSiteBriefing, addSiteProposalValue } from '@/services/briefingService'
import { Input } from '@/components/ui/input'
import { exportBriefingToJSON, exportBriefingToMarkdown } from '@/utils/exportBriefing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileJson, FileText } from 'lucide-react'

interface SiteBriefingCardProps {
  briefing: SiteBriefing
  onUpdate?: (updatedBriefing: SiteBriefing) => void
  onDelete?: (briefingId: string) => void
}

export const SiteBriefingCard = ({ briefing, onUpdate, onDelete }: SiteBriefingCardProps) => {
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

  const handleDelete = async () => {
    if (!briefing.id) {
      console.error('❌ ID do briefing não encontrado para exclusão')
      alert('Erro: ID do briefing não encontrado')
      return
    }

    setIsDeleting(true)
    
    try {
      await deleteSiteBriefing(briefing.id)
      console.log('✅ Briefing de site excluído com sucesso')
      
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
      const updatedBriefing = await addSiteProposalValue(briefing.id, parseFloat(proposalValue))
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
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">Site Institucional</span>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white">
            Novo
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
          {briefing.website_goal && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400 truncate">{briefing.website_goal}</span>
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
                    <Globe className="w-5 h-5 text-blue-400" />
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
                        Informações da Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Nome da Empresa</label>
                          <p className="text-white mt-1">{briefing.company_name || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Segmento</label>
                          <p className="text-white mt-1">{briefing.business_segment || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Responsável</label>
                          <p className="text-white mt-1">{briefing.responsible_name || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Descrição da Empresa</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.company_description || 'Não informado'}</p>
                        </div>
                        
                        {briefing.company_history && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">História da Empresa</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.company_history}</p>
                          </div>
                        )}
                        
                        {briefing.mission && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Missão</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.mission}</p>
                          </div>
                        )}
                        
                        {briefing.vision && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Visão</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.vision}</p>
                          </div>
                        )}
                        
                        {briefing.values && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Valores</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.values}</p>
                          </div>
                        )}
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Público-Alvo</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.target_audience || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Diferencial Competitivo</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.competitive_advantage || 'Não informado'}</p>
                        </div>
                        
                        {briefing.current_website && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Site Atual</label>
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
                      </div>
                    </section>

                    {/* Seção 2: Objetivos e Estrutura do Site */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Objetivos e Estrutura do Site
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div>
                          <label className="text-sm font-medium text-slate-400">Objetivo do Site</label>
                          <p className="text-white mt-1">{briefing.website_goal || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Tipo de Site</label>
                          <p className="text-white mt-1">{briefing.website_type || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Principais Funcionalidades</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.main_functionalities || 'Não informado'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Páginas Obrigatórias</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.required_pages || 'Não informado'}</p>
                        </div>
                        
                        {briefing.navigation_structure && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Estrutura de Navegação</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.navigation_structure}</p>
                          </div>
                        )}
                        
                        {briefing.content_hierarchy && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Hierarquia de Conteúdo</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.content_hierarchy}</p>
                          </div>
                        )}
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Serviços/Produtos</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.services_products || 'Não informado'}</p>
                        </div>
                      </div>
                    </section>

                    {/* Conteúdo Adicional */}
                    {(briefing.team_info || briefing.certifications || briefing.awards_recognition || briefing.case_studies || briefing.testimonials) && (
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                          <Award className="w-5 h-5 text-amber-400" />
                          Conteúdo Adicional
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          {briefing.team_info && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">Informações da Equipe</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.team_info}</p>
                            </div>
                          )}
                          
                          {briefing.certifications && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">Certificações</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.certifications}</p>
                            </div>
                          )}
                          
                          {briefing.awards_recognition && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">Prêmios e Reconhecimentos</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.awards_recognition}</p>
                            </div>
                          )}
                          
                          {briefing.case_studies && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">Casos de Sucesso</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.case_studies}</p>
                            </div>
                          )}
                          
                          {briefing.testimonials && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-400">Depoimentos</label>
                              <p className="text-white mt-1 whitespace-pre-wrap">{briefing.testimonials}</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Seção 3: Design e Identidade Visual */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Palette className="w-5 h-5 text-pink-400" />
                        Design e Identidade Visual
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {briefing.design_style && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Estilo de Design</label>
                            <p className="text-white mt-1">{briefing.design_style}</p>
                          </div>
                        )}
                        
                        {briefing.brand_colors && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Cores da Marca</label>
                            <p className="text-white mt-1">{briefing.brand_colors}</p>
                          </div>
                        )}
                        
                        {briefing.has_logo && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Logo</label>
                            <p className="text-white mt-1">{briefing.has_logo}</p>
                          </div>
                        )}
                        
                        {briefing.communication_tone && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Tom de Comunicação</label>
                            <p className="text-white mt-1">{briefing.communication_tone}</p>
                          </div>
                        )}
                        
                        {/* Arquivos de Logo */}
                        {briefing.logo_files && briefing.logo_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Arquivos de Logo</label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                              {briefing.logo_files.map((fileUrl, index) => (
                                <div key={index} className="relative group">
                                  <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                                    {fileUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                                      <img 
                                        src={fileUrl} 
                                        alt={`Logo ${index + 1}`}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                      </div>
                                    )}
                                  </div>
                                  <a 
                                    href={fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                                  >
                                    Ver arquivo
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {briefing.visual_references && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Referências Visuais</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.visual_references}</p>
                          </div>
                        )}
                        
                        {/* Arquivos de Referências Visuais */}
                        {briefing.visual_files && briefing.visual_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Arquivos de Referências</label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                              {briefing.visual_files.map((fileUrl, index) => (
                                <div key={index} className="relative group">
                                  <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                                    {fileUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                                      <img 
                                        src={fileUrl} 
                                        alt={`Referência ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                      </div>
                                    )}
                                  </div>
                                  <a 
                                    href={fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                                  >
                                    Ver arquivo
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {briefing.main_competitors && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Principais Concorrentes</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.main_competitors}</p>
                          </div>
                        )}
                        
                        {briefing.customer_pain_points && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Dores do Cliente</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.customer_pain_points}</p>
                          </div>
                        )}
                        
                        {briefing.customer_objections && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Objeções dos Clientes</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.customer_objections}</p>
                          </div>
                        )}
                        
                        {briefing.key_messages && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Mensagens-Chave</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.key_messages}</p>
                          </div>
                        )}
                        
                        {briefing.specific_requirements && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Requisitos Específicos</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.specific_requirements}</p>
                          </div>
                        )}
                        
                        {briefing.content_materials && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Materiais Próprios</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.content_materials}</p>
                          </div>
                        )}
                        
                        {/* Arquivos de Materiais */}
                        {briefing.material_files && briefing.material_files.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Arquivos de Materiais</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {briefing.material_files.map((fileUrl, index) => (
                                <a
                                  key={index}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-pink-400 hover:text-pink-300 text-sm underline"
                                >
                                  Material {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Seção 4: Funcionalidades Técnicas */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        Funcionalidades Técnicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {briefing.contact_forms && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Formulários de Contato</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.contact_forms}</p>
                          </div>
                        )}
                        
                        {briefing.integrations && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Integrações</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.integrations}</p>
                          </div>
                        )}
                        
                        {briefing.seo_requirements && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Requisitos de SEO</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.seo_requirements}</p>
                          </div>
                        )}
                        
                        {briefing.analytics_tracking && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Analytics</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.analytics_tracking}</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Domínio</label>
                          <p className="text-white mt-1">{briefing.domain_info || 'Não informado'}</p>
                        </div>
                        
                        {briefing.hosting_preferences && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Hospedagem</label>
                            <p className="text-white mt-1">{briefing.hosting_preferences}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Seção 5: Timeline e Observações */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Timeline e Observações
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div>
                          <label className="text-sm font-medium text-slate-400">Prazo</label>
                          <p className="text-white mt-1">{briefing.deadline || 'Valor Acordado na Workana'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Orçamento</label>
                          <p className="text-white mt-1">{briefing.budget || 'Valor Acordado na Workana'}</p>
                        </div>
                        
                        {briefing.additional_notes && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Observações Adicionais</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{briefing.additional_notes}</p>
                          </div>
                        )}
                      </div>
                    </section>

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
            
            {/* Botão de Exportação */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem 
                  onClick={() => exportBriefingToJSON(briefing)}
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Exportar como JSON
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => exportBriefingToMarkdown(briefing)}
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
                      Tem certeza que deseja excluir o briefing de <strong>{briefing.company_name || 'este site'}</strong>? 
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
