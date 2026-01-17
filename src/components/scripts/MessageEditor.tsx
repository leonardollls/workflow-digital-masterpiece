import { useState, useEffect, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Image as ImageIcon,
  GitBranch,
  Save,
  Eye,
  Copy,
  Link,
  AlertCircle,
  Upload,
  X,
  Loader2,
  Download,
  Clipboard
} from 'lucide-react'
import type { ScriptMessage, MessageType } from '@/types/scripts'
import { updateMessage, createMessage, extractVariablesFromContent, replaceTemplateVariables, uploadScriptImage } from '@/services/scriptsService'
import { EmojiPicker } from './EmojiPicker'

interface MessageEditorProps {
  message: ScriptMessage | null
  scriptId: string
  open: boolean
  onClose: () => void
  onSave: (message: Partial<ScriptMessage>) => void
  existingMessages: ScriptMessage[]
}

export const MessageEditor = ({
  message,
  scriptId,
  open,
  onClose,
  onSave,
  existingMessages
}: MessageEditorProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<MessageType>('text')
  const [imageUrl, setImageUrl] = useState('')
  const [condition, setCondition] = useState('')
  const [parentMessageId, setParentMessageId] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  
  // Upload states
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Preview variables
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
    nome_empresa: 'Clínica Exemplo',
    nome_contato: 'Dr. João',
    cidade: 'São Paulo',
    segmento: 'Saúde',
    link_proposta: 'https://leonardolopes.online/site/exemplo'
  })

  useEffect(() => {
    if (message) {
      setTitle(message.title)
      setContent(message.content || '')
      setType(message.type)
      setImageUrl(message.image_url || '')
      setCondition(message.condition || '')
      setParentMessageId(message.parent_message_id)
    } else {
      // Reset for new message
      setTitle('')
      setContent('')
      setType('text')
      setImageUrl('')
      setCondition('')
      // Default parent to last message
      setParentMessageId(
        existingMessages.length > 0 
          ? existingMessages[existingMessages.length - 1].id 
          : undefined
      )
    }
  }, [message, existingMessages])

  const detectedVariables = extractVariablesFromContent(content)

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null)
    setIsUploading(true)

    try {
      const url = await uploadScriptImage(file)
      setImageUrl(url)
      
      // Automatically switch to image type if not already
      if (type !== 'image') {
        setType('image')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Erro ao fazer upload')
    } finally {
      setIsUploading(false)
    }
  }, [type])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleFileUpload(file)
      } else {
        setUploadError('Por favor, arraste apenas arquivos de imagem (JPG, PNG, GIF, WebP)')
      }
    }
  }, [handleFileUpload])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleRemoveImage = useCallback(() => {
    setImageUrl('')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Download image
  const handleDownloadImage = useCallback(async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // Extract filename from URL or use default
      const fileName = imageUrl.split('/').pop() || 'mockup-image.png'
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erro ao baixar imagem:', err)
      alert('Erro ao baixar imagem. Tente abrir em nova aba e salvar manualmente.')
    }
  }, [imageUrl])

  // Copy image to clipboard
  const handleCopyImageToClipboard = useCallback(async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Check if clipboard API supports writing images
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])
        alert('Imagem copiada para a área de transferência!')
      } else {
        alert('Seu navegador não suporta copiar imagens. Tente usar o botão de download.')
      }
    } catch (err) {
      console.error('Erro ao copiar imagem:', err)
      alert('Erro ao copiar imagem. Tente baixar e copiar manualmente.')
    }
  }, [imageUrl])

  const handleSave = async () => {
    if (!title.trim()) {
      alert('O título é obrigatório')
      return
    }

    try {
      setSaving(true)

      if (message) {
        // Update existing
        await updateMessage({
          id: message.id,
          title: title.trim(),
          content: content.trim() || undefined,
          type,
          image_url: imageUrl.trim() || undefined,
          condition: condition || undefined,
          parent_message_id: parentMessageId
        })
      } else {
        // Create new
        await createMessage({
          script_id: scriptId,
          title: title.trim(),
          content: content.trim() || undefined,
          type,
          image_url: imageUrl.trim() || undefined,
          condition: condition || undefined,
          parent_message_id: parentMessageId,
          position_x: 100,
          position_y: existingMessages.length * 180 + 100
        })
      }

      onSave({
        title,
        content,
        type,
        image_url: imageUrl,
        condition,
        parent_message_id: parentMessageId
      })
    } catch (err: any) {
      console.error('Erro ao salvar mensagem:', err)
      alert('Erro ao salvar mensagem: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyContent = () => {
    const processedContent = replaceTemplateVariables(content, previewVariables)
    navigator.clipboard.writeText(processedContent)
      .then(() => alert('Mensagem copiada!'))
      .catch(() => alert('Erro ao copiar'))
  }

  const insertVariable = (variable: string) => {
    const newContent = content + `{{${variable}}}`
    setContent(newContent)
  }

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji)
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-400" />
      case 'conditional':
        return <GitBranch className="w-5 h-5 text-orange-400" />
      default:
        return <MessageSquare className="w-5 h-5 text-green-400" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {getTypeIcon()}
            {message ? 'Editar Mensagem' : 'Nova Mensagem'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="edit" className="data-[state=active]:bg-slate-700">
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 mt-4">
            {/* Tipo da mensagem */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Tipo da Mensagem</Label>
                <Select value={type} onValueChange={(v) => setType(v as MessageType)}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="text" className="text-slate-200">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        Texto
                      </div>
                    </SelectItem>
                    <SelectItem value="image" className="text-slate-200">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                        Imagem/Mockup
                      </div>
                    </SelectItem>
                    <SelectItem value="conditional" className="text-slate-200">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-orange-400" />
                        Condicional
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Mensagem Anterior (Conexão)</Label>
                <Select 
                  value={parentMessageId || 'none'} 
                  onValueChange={(v) => setParentMessageId(v === 'none' ? undefined : v)}
                >
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="none" className="text-slate-200">
                      Nenhuma (Início do fluxo)
                    </SelectItem>
                    {existingMessages
                      .filter(m => m.id !== message?.id)
                      .map(m => (
                        <SelectItem key={m.id} value={m.id} className="text-slate-200">
                          {m.order}. {m.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Título */}
            <div>
              <Label className="text-slate-300">Título da Mensagem *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Apresentação Inicial"
                className="mt-1 bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>

            {/* Conteúdo */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-slate-300">Conteúdo da Mensagem</Label>
                <div className="flex gap-1 items-center">
                  {['nome_empresa', 'nome_contato', 'link_proposta'].map(v => (
                    <Button
                      key={v}
                      size="sm"
                      variant="ghost"
                      onClick={() => insertVariable(v)}
                      className="h-6 px-2 text-xs text-slate-400 hover:text-green-400"
                    >
                      {`{{${v}}}`}
                    </Button>
                  ))}
                  <EmojiPicker onEmojiSelect={insertEmoji} />
                </div>
              </div>
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o texto da mensagem. Use {{variável}} para campos dinâmicos. 😊"
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-200 min-h-[150px] text-sm pr-10"
                />
              </div>
              {detectedVariables.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Variáveis detectadas:</span>
                  {detectedVariables.map(v => (
                    <Badge key={v} variant="outline" className="border-green-600 text-green-400 text-xs">
                      {v}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Upload de imagem (se tipo imagem) */}
            {type === 'image' && (
              <div className="space-y-3">
                <Label className="text-slate-300">Imagem do Mockup</Label>
                
                {/* Área de Upload Drag & Drop */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-6 transition-all
                    ${isDragging 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                    }
                    ${imageUrl ? 'pb-3' : ''}
                  `}
                >
                  {/* Preview da imagem */}
                  {imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <img 
                          src={imageUrl} 
                          alt="Preview do mockup" 
                          className="w-full max-h-48 object-contain rounded bg-slate-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            setUploadError('Erro ao carregar imagem')
                          }}
                        />
                        {/* Botões de ação da imagem */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-slate-800/90 hover:bg-slate-700 border border-slate-600"
                            onClick={handleCopyImageToClipboard}
                            title="Copiar imagem para área de transferência"
                          >
                            <Clipboard className="w-4 h-4 text-slate-300" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-slate-800/90 hover:bg-slate-700 border border-slate-600"
                            onClick={handleDownloadImage}
                            title="Baixar imagem"
                          >
                            <Download className="w-4 h-4 text-slate-300" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleRemoveImage}
                            title="Remover imagem"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500 truncate flex-1">
                          {imageUrl}
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-slate-400 hover:text-green-400"
                            onClick={handleCopyImageToClipboard}
                          >
                            <Clipboard className="w-3 h-3 mr-1" />
                            Copiar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-slate-400 hover:text-blue-400"
                            onClick={handleDownloadImage}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                          <p className="text-sm text-slate-400">Fazendo upload...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-green-500' : 'text-slate-500'}`} />
                          <p className="text-sm text-slate-300 mb-1">
                            {isDragging ? 'Solte a imagem aqui!' : 'Arraste uma imagem ou clique para selecionar'}
                          </p>
                          <p className="text-xs text-slate-500">
                            JPG, PNG, GIF ou WebP (máx. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Input de arquivo invisível */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                </div>

                {/* Erro de upload */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded border border-red-600/30">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-400">{uploadError}</p>
                  </div>
                )}

                {/* Ou inserir URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-2 text-slate-500">ou insira uma URL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/mockup.png"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                  {imageUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="bg-slate-800 border-slate-700 text-slate-300"
                      title="Abrir imagem em nova aba"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Condição (se tipo condicional) */}
            {type === 'conditional' && (
              <div>
                <Label className="text-slate-300">Condição de Envio</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Selecione quando enviar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="after_positive_response" className="text-slate-200">
                      Após resposta positiva do cliente
                    </SelectItem>
                    <SelectItem value="after_negative_response" className="text-slate-200">
                      Após resposta negativa do cliente
                    </SelectItem>
                    <SelectItem value="after_no_response" className="text-slate-200">
                      Após sem resposta (follow-up)
                    </SelectItem>
                    <SelectItem value="custom" className="text-slate-200">
                      Condição personalizada
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 p-3 bg-orange-900/20 rounded border border-orange-600/30">
                  <p className="text-xs text-orange-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    Mensagens condicionais só devem ser enviadas após a condição ser atendida.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Preview Variables */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(previewVariables).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs text-slate-400">{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) => setPreviewVariables(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          className="h-8 mt-1 bg-slate-900 border-slate-600 text-slate-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-700 my-4" />

                  {/* Message Preview */}
                  <div className="bg-slate-950 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-white">{title || 'Título da Mensagem'}</span>
                    </div>
                    
                    {type === 'image' && imageUrl && (
                      <div className="mb-3 rounded overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="max-h-48 object-contain bg-slate-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="bg-green-900/30 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-slate-200 whitespace-pre-wrap text-sm">
                        {replaceTemplateVariables(content, previewVariables) || 'Conteúdo da mensagem aparecerá aqui...'}
                      </p>
                    </div>

                    {condition && (
                      <div className="mt-3 p-2 bg-orange-900/20 rounded border border-orange-600/30">
                        <p className="text-xs text-orange-400">
                          ⚠️ Enviar apenas: {condition === 'after_positive_response' ? 'Após resposta positiva' : condition}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Copy Button */}
                  <Button
                    onClick={handleCopyContent}
                    variant="outline"
                    className="w-full gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Mensagem Processada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-800 border-slate-700 text-slate-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Mensagem'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MessageEditor
