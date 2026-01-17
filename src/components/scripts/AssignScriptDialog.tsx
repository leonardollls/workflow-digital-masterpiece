import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Link as LinkIcon,
  Copy,
  Send,
  Check,
  Phone,
  Building2,
  Map,
  Smartphone,
  List
} from 'lucide-react'
import type { WhatsAppScript, ScriptMessage, SiteScriptAssignment, TemplateVariables } from '@/types/scripts'
import type { CaptationSite } from '@/types/captation'
import {
  getScripts,
  getMessagesByScript,
  assignScriptToSite,
  getScriptVariables,
  replaceTemplateVariables,
  generateWhatsAppLink,
  markMessageAsSent,
  getAssignmentsBySite
} from '@/services/scriptsService'
import { FullMindMapDialog } from './FullMindMapDialog'
import { WhatsAppPreview } from './WhatsAppPreview'

interface AssignScriptDialogProps {
  site: CaptationSite
  open: boolean
  onClose: () => void
  onAssigned?: () => void
}

export const AssignScriptDialog = ({
  site,
  open,
  onClose,
  onAssigned
}: AssignScriptDialogProps) => {
  const [scripts, setScripts] = useState<WhatsAppScript[]>([])
  const [selectedScriptId, setSelectedScriptId] = useState<string>('')
  const [selectedScript, setSelectedScript] = useState<WhatsAppScript | null>(null)
  const [messages, setMessages] = useState<ScriptMessage[]>([])
  const [variables, setVariables] = useState<string[]>([])
  const [customValues, setCustomValues] = useState<TemplateVariables>({})
  const [existingAssignment, setExistingAssignment] = useState<SiteScriptAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showMindMap, setShowMindMap] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('list')

  // Pre-fill values from site
  useEffect(() => {
    setCustomValues({
      nome_empresa: site.company_name,
      nome_contato: site.contact_person || '',
      cidade: site.city?.name || '',
      segmento: site.category?.name || '',
      link_proposta: site.proposal_link || ''
    })
  }, [site])

  // Load scripts and existing assignment
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [scriptsData, assignments] = await Promise.all([
          getScripts(true),
          getAssignmentsBySite(site.id)
        ])
        setScripts(scriptsData)
        
        if (assignments.length > 0) {
          const assignment = assignments[0]
          setExistingAssignment(assignment)
          setSelectedScriptId(assignment.script_id)
          setSelectedScript(scriptsData.find(s => s.id === assignment.script_id) || null)
          setCustomValues(prev => ({
            ...prev,
            ...assignment.custom_values
          }))
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (open) {
      loadData()
    }
  }, [open, site.id])

  // Load messages when script changes
  useEffect(() => {
    const loadScriptData = async () => {
      if (!selectedScriptId) {
        setMessages([])
        setVariables([])
        setSelectedScript(null)
        return
      }

      try {
        const [msgs, vars] = await Promise.all([
          getMessagesByScript(selectedScriptId),
          getScriptVariables(selectedScriptId)
        ])
        setMessages(msgs)
        setVariables(vars)
        setSelectedScript(scripts.find(s => s.id === selectedScriptId) || null)
      } catch (err) {
        console.error('Erro ao carregar dados do script:', err)
      }
    }
    
    loadScriptData()
  }, [selectedScriptId, scripts])

  const handleAssign = async () => {
    if (!selectedScriptId) {
      alert('Selecione um script')
      return
    }

    try {
      setSaving(true)
      const assignment = await assignScriptToSite({
        site_id: site.id,
        script_id: selectedScriptId,
        custom_values: customValues
      })
      setExistingAssignment(assignment)
      onAssigned?.()
    } catch (err: any) {
      console.error('Erro ao atribuir script:', err)
      alert('Erro ao atribuir script: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSendMessage = (message: ScriptMessage) => {
    if (!site.phone) {
      alert('Este site não possui telefone cadastrado')
      return
    }

    const processedContent = replaceTemplateVariables(message.content || '', customValues)
    const link = generateWhatsAppLink(site.phone, processedContent)
    window.open(link, '_blank')

    // Mark as sent if we have an assignment
    if (existingAssignment) {
      markMessageAsSent(existingAssignment.id, message.id)
        .catch(err => console.error('Erro ao marcar mensagem:', err))
    }
  }

  const handleCopyMessage = (message: ScriptMessage) => {
    const processedContent = replaceTemplateVariables(message.content || '', customValues)
    navigator.clipboard.writeText(processedContent)
      .then(() => alert('Mensagem copiada!'))
      .catch(() => alert('Erro ao copiar'))
  }

  const isMessageSent = (messageId: string): boolean => {
    if (!existingAssignment) return false
    return existingAssignment.sent_messages?.some(m => m.message_id === messageId) || false
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Scripts de WhatsApp - {site.company_name}
            </DialogTitle>
          </DialogHeader>

          {/* Site Info */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-slate-400" />
                  <div>
                    <h3 className="font-medium text-white">{site.company_name}</h3>
                    <p className="text-sm text-slate-400">
                      {site.city?.name}, {site.city?.state?.abbreviation} • {site.category?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {site.phone && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{site.phone}</span>
                    </div>
                  )}
                  {selectedScript && (
                    <Button
                      onClick={() => setShowMindMap(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                    >
                      <Map className="w-4 h-4" />
                      Ver Mapa Mental
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Left: Script Selection & Variables */}
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Script de Mensagens</Label>
                <Select value={selectedScriptId} onValueChange={setSelectedScriptId}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecione um script..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {scripts.map(script => (
                      <SelectItem key={script.id} value={script.id} className="text-slate-200">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-400" />
                          {script.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Variables */}
              {selectedScriptId && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">Variáveis do Script</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {variables.length > 0 ? (
                      variables.map(variable => (
                        <div key={variable}>
                          <Label className="text-xs text-slate-400">{variable}</Label>
                          <Input
                            value={customValues[variable] || ''}
                            onChange={(e) => setCustomValues(prev => ({
                              ...prev,
                              [variable]: e.target.value
                            }))}
                            placeholder={`Digite ${variable}...`}
                            className="h-8 mt-1 bg-slate-900 border-slate-600 text-slate-200 text-sm"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">
                        Este script não possui variáveis personalizáveis.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Assign Button */}
              {!existingAssignment && selectedScriptId && (
                <Button
                  onClick={handleAssign}
                  disabled={saving}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  <LinkIcon className="w-4 h-4" />
                  {saving ? 'Vinculando...' : 'Vincular Script ao Site'}
                </Button>
              )}

              {existingAssignment && (
                <div className="p-3 bg-green-900/20 rounded border border-green-600/30">
                  <p className="text-sm text-green-400 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Script vinculado com sucesso!
                  </p>
                </div>
              )}
            </div>

            {/* Right: Messages Preview */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300">Mensagens do Fluxo</Label>
                {messages.length > 0 && (
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'preview')}>
                    <TabsList className="h-8 bg-slate-800">
                      <TabsTrigger value="list" className="h-6 px-2 text-xs data-[state=active]:bg-slate-700">
                        <List className="w-3 h-3 mr-1" />
                        Lista
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="h-6 px-2 text-xs data-[state=active]:bg-slate-700">
                        <Smartphone className="w-3 h-3 mr-1" />
                        WhatsApp
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>

              {viewMode === 'list' ? (
                <ScrollArea className="h-[400px] rounded border border-slate-700 bg-slate-800/50">
                  {messages.length > 0 ? (
                    <div className="p-3 space-y-3">
                      {messages.map((msg, index) => (
                        <Card 
                          key={msg.id} 
                          className={`bg-slate-900 border-slate-700 ${isMessageSent(msg.id) ? 'border-green-600/50' : ''}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                  {index + 1}
                                </Badge>
                                <span className="text-sm font-medium text-white">{msg.title}</span>
                              </div>
                              {isMessageSent(msg.id) && (
                                <Badge className="bg-green-600/20 text-green-400 text-xs">
                                  Enviada
                                </Badge>
                              )}
                            </div>
                            
                            {msg.image_url && (
                              <div className="mb-2 rounded overflow-hidden bg-slate-800">
                                <img 
                                  src={msg.image_url} 
                                  alt="Preview" 
                                  className="w-full h-20 object-cover"
                                />
                              </div>
                            )}
                            
                            <p className="text-xs text-slate-400 line-clamp-3 mb-3 whitespace-pre-wrap">
                              {replaceTemplateVariables(msg.content || '', customValues)}
                            </p>

                            {msg.condition && (
                              <p className="text-xs text-orange-400 mb-2">
                                ⚠️ {msg.condition === 'after_positive_response' ? 'Após resposta positiva' : msg.condition}
                              </p>
                            )}

                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSendMessage(msg)}
                                disabled={!site.phone}
                                className="h-7 px-2 text-xs gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <Send className="w-3 h-3" />
                                Enviar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyMessage(msg)}
                                className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : selectedScriptId ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-slate-500">Este script não possui mensagens.</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-slate-500">Selecione um script para ver as mensagens.</p>
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <div className="h-[400px] overflow-hidden rounded border border-slate-700 bg-slate-950 flex items-center justify-center">
                  {messages.length > 0 ? (
                    <WhatsAppPreview
                      messages={messages}
                      variables={customValues}
                      contactName={site.contact_person || site.company_name}
                      contactPhone={site.phone}
                      onSendMessage={handleSendMessage}
                    />
                  ) : (
                    <p className="text-sm text-slate-500">Selecione um script para ver o preview.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-4 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-slate-800 border-slate-700 text-slate-300"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Mind Map Dialog */}
      <FullMindMapDialog
        script={selectedScript}
        open={showMindMap}
        onClose={() => setShowMindMap(false)}
        customValues={customValues}
        phone={site.phone}
      />
    </>
  )
}

export default AssignScriptDialog
