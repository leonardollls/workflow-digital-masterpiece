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
  User,
  Instagram,
  Palette,
  Phone,
  MapPin,
  MessageSquare,
  Check,
  Image as ImageIcon,
  Stethoscope,
  Sparkles
} from 'lucide-react'
import type { DentalBriefing } from '@/services/briefingService'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { deleteDentalBriefing, addDentalProposalValue } from '@/services/briefingService'
import { Input } from '@/components/ui/input'

interface DentalBriefingCardProps {
  briefing: DentalBriefing
  onUpdate?: (updatedBriefing: DentalBriefing) => void
  onDelete?: (briefingId: string) => void
}

export const DentalBriefingCard = ({ briefing, onUpdate, onDelete }: DentalBriefingCardProps) => {
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

  const getColorPreferenceLabel = (value: string) => {
    switch (value) {
      case 'keep_current':
        return 'Manter cores atuais (Instagram/Logo)'
      case 'new_suggestion':
        return 'Sugestão de cores novas (Dark/Premium)'
      case 'custom':
        return 'Personalizado'
      default:
        return value
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
      await deleteDentalBriefing(briefing.id)
      console.log('✅ Briefing odontológico excluído com sucesso')
      
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
      const updatedBriefing = await addDentalProposalValue(briefing.id, parseFloat(proposalValue))
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
              {briefing.clinic_name || 'Nome não informado'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Stethoscope className="w-4 h-4" />
              <span>Odontologia</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">Site Odontológico</span>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white">
            Novo
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="font-medium text-slate-200 truncate text-xs">
              {briefing.color_preference === 'keep_current' ? 'Cores atuais' : 
               briefing.color_preference === 'new_suggestion' ? 'Novas cores' : 'Personalizado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-200 text-xs">{formatShortDate(briefing.created_at)}</span>
          </div>
        </div>

        <div className="space-y-2">
          {briefing.instagram_link && (
            <div className="flex items-center gap-2 text-sm">
              <Instagram className="w-4 h-4 text-pink-400" />
              <a 
                href={briefing.instagram_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-pink-400 truncate transition-colors"
              >
                {briefing.instagram_link.replace('https://instagram.com/', '@').replace('https://www.instagram.com/', '@')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span className="text-slate-400 truncate">
              {briefing.main_treatments?.substring(0, 50)}...
            </span>
          </div>
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
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    {briefing.clinic_name}
                  </DialogTitle>
                  <DialogDescription className="space-y-1 text-slate-400">
                    <div>Briefing recebido em {formatDate(briefing.created_at)}</div>
                    <div className="text-xs text-emerald-500 font-medium">Desenvolvedor: Leonardo Lopes</div>
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh] pr-4">
                  <div className="space-y-6">
                    {/* Seção 1: Identidade da Marca */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Seção 1: Identidade da Marca
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">1. Nome da Clínica</label>
                          <p className="text-white mt-1">{briefing.clinic_name}</p>
                        </div>
                        
                        {briefing.logo_file && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">2. Logo Enviado</label>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                                <img 
                                  src={briefing.logo_file} 
                                  alt="Logo da clínica" 
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <a 
                                href={briefing.logo_file} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                              >
                                Ver em tamanho completo
                              </a>
                            </div>
                          </div>
                        )}
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">3. Preferência de Cores</label>
                          <p className="text-white mt-1">{getColorPreferenceLabel(briefing.color_preference)}</p>
                        </div>
                      </div>
                    </section>

                    {/* Seção 2: Conteúdo Estratégico */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        Seção 2: Conteúdo Estratégico
                      </h3>
                      <div className="grid grid-cols-1 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {briefing.instagram_link && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">4. Instagram</label>
                            <a 
                              href={briefing.instagram_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 mt-1 block"
                            >
                              {briefing.instagram_link}
                            </a>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">5. Tratamentos Principais (Carro-Chefe)</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.main_treatments}</p>
                        </div>
                        
                        {briefing.slogan && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">6. Frase de Impacto (Slogan)</label>
                            <p className="text-white mt-1 italic">"{briefing.slogan}"</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">7. Dados de Contato</label>
                          <p className="text-white mt-1 whitespace-pre-wrap">{briefing.contact_info}</p>
                        </div>
                      </div>
                    </section>

                    {/* Seção 3: O Compromisso */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <User className="w-5 h-5 text-green-400" />
                        Seção 3: O Compromisso
                      </h3>
                      <div className="grid grid-cols-1 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {briefing.profile_photo && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">8. Foto de Perfil</label>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-700 border-2 border-green-500/30">
                                <img 
                                  src={briefing.profile_photo} 
                                  alt="Foto de perfil" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <a 
                                href={briefing.profile_photo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                              >
                                Ver em tamanho completo
                              </a>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">9. Termo de Compromisso</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Check className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Aceito e confirmado</span>
                          </div>
                        </div>
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
                    Insira o valor da proposta para {briefing.clinic_name}
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
                      Tem certeza que deseja excluir o briefing de <strong>{briefing.clinic_name}</strong>? 
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
