import { useState, useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  MarkerType,
  Panel,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  Plus,
  Save,
  MessageSquare,
  Image as ImageIcon,
  GitBranch,
  Trash2,
  Copy,
  Send,
  Edit2,
  Maximize2,
  Minimize2,
  X,
  CopyPlus,
  Map,
  List
} from 'lucide-react'
import type { WhatsAppScript, ScriptMessage, ScriptNodeData } from '@/types/scripts'
import {
  getMessagesByScript,
  createMessage,
  deleteMessage,
  updateMessagePositions,
  updateScript,
  duplicateMessage,
  reorderMessages
} from '@/services/scriptsService'
import { MessageEditor } from './MessageEditor'
import { DraggableMessageList } from './DraggableMessageList'

interface ScriptMindMapProps {
  script: WhatsAppScript
  onBack: () => void
  onUpdate: (script: WhatsAppScript) => void
}

// Custom Node Component with Connection Handles on all sides
const MessageNode = ({ data }: { data: ScriptNodeData }) => {
  const { message, onEdit, onDelete, onCopy, onDuplicate } = data
  
  const getTypeColor = () => {
    switch (message.type) {
      case 'image':
        return { border: 'border-blue-500/50', handle: '#3b82f6' }
      case 'conditional':
        return { border: 'border-orange-500/50', handle: '#f97316' }
      default:
        return { border: 'border-green-500/50', handle: '#22c55e' }
    }
  }

  const getTypeIcon = () => {
    switch (message.type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-400" />
      case 'conditional':
        return <GitBranch className="w-4 h-4 text-orange-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-green-400" />
    }
  }

  const getTypeBadge = () => {
    switch (message.type) {
      case 'image':
        return <Badge className="bg-blue-600/20 text-blue-400 text-xs">Imagem</Badge>
      case 'conditional':
        return <Badge className="bg-orange-600/20 text-orange-400 text-xs">Condicional</Badge>
      default:
        return <Badge className="bg-green-600/20 text-green-400 text-xs">Texto</Badge>
    }
  }

  const colors = getTypeColor()
  const handleBaseClass = "!w-3 !h-3 !border-2 !border-slate-600 !bg-slate-800 hover:!bg-green-500 hover:!border-green-400 transition-colors"

  return (
    <div className="relative">
      {/* Handle de entrada (topo) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className={`${handleBaseClass} !w-4 !h-4`}
        style={{ top: -8 }}
      />
      
      {/* Handle de saída (topo) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className={handleBaseClass}
        style={{ top: -6, left: '30%' }}
      />
      
      {/* Handles laterais ESQUERDA */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className={handleBaseClass}
        style={{ left: -6, top: '35%' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className={handleBaseClass}
        style={{ left: -6, top: '65%', background: colors.handle }}
      />
      
      {/* Handles laterais DIREITA */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className={handleBaseClass}
        style={{ right: -6, top: '35%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className={handleBaseClass}
        style={{ right: -6, top: '65%', background: colors.handle }}
      />
      
      <Card className={`min-w-[280px] max-w-[320px] bg-slate-900 ${colors.border} border-2 shadow-xl hover:shadow-2xl transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getTypeIcon()}
              <span className="text-sm font-medium text-white">{message.title}</span>
            </div>
            {getTypeBadge()}
          </div>
          
          {message.content && (
            <p className="text-xs text-slate-400 line-clamp-3 mb-3 whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {message.image_url && (
            <div className="mb-3 rounded overflow-hidden bg-slate-800">
              <img 
                src={message.image_url} 
                alt="Preview" 
                className="w-full h-24 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          {message.condition && (
            <div className="mb-3 p-2 bg-orange-900/20 rounded border border-orange-600/30">
              <p className="text-xs text-orange-400">
                Condição: {message.condition === 'after_positive_response' ? 'Após resposta positiva' : message.condition}
              </p>
            </div>
          )}

          <div className="flex gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(message)}
              className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDuplicate?.(message)}
              className="h-7 px-2 text-slate-400 hover:text-green-400 hover:bg-green-900/30"
              title="Duplicar mensagem"
            >
              <CopyPlus className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopy(message.content || '')}
              className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
              title="Copiar texto"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(message.id)}
              className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/30"
              title="Excluir mensagem"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="text-[10px] text-slate-600 mt-2">
            Ordem: {message.order}
          </div>
        </CardContent>
      </Card>
      
      {/* Handle de saída (base) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className={`${handleBaseClass} !w-4 !h-4`}
        style={{ bottom: -8, background: colors.handle }}
      />
      
      {/* Handle de entrada (base) */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className={handleBaseClass}
        style={{ bottom: -6, left: '70%' }}
      />
    </div>
  )
}

const nodeTypes: NodeTypes = {
  message: MessageNode
}

export const ScriptMindMap = ({ script, onBack, onUpdate }: ScriptMindMapProps) => {
  const [messages, setMessages] = useState<ScriptMessage[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMessage, setEditingMessage] = useState<ScriptMessage | null>(null)
  const [showMessageEditor, setShowMessageEditor] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const data = await getMessagesByScript(script.id)
        setMessages(data)
        buildFlowFromMessages(data)
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [script.id])

  // Handlers refs to avoid circular dependencies
  const handleEditMessageRef = useCallback((message: ScriptMessage) => {
    setEditingMessage(message)
    setShowMessageEditor(true)
  }, [])

  const handleDeleteMessageRef = useCallback(async (messageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return
    try {
      await deleteMessage(messageId)
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== messageId)
        return updated
      })
    } catch (err) {
      console.error('Erro ao excluir mensagem:', err)
      alert('Erro ao excluir mensagem')
    }
  }, [])

  const handleCopyMessageRef = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => alert('Mensagem copiada para a área de transferência!'))
      .catch(() => alert('Erro ao copiar mensagem'))
  }, [])

  const handleDuplicateMessageRef = useCallback(async (message: ScriptMessage) => {
    try {
      const newMsg = await duplicateMessage(message.id)
      setMessages(prev => [...prev, newMsg])
    } catch (err) {
      console.error('Erro ao duplicar mensagem:', err)
      alert('Erro ao duplicar mensagem')
    }
  }, [])

  const buildFlowFromMessages = useCallback((msgs: ScriptMessage[]) => {
    // Create nodes
    const newNodes: Node[] = msgs.map((msg, index) => ({
      id: msg.id,
      type: 'message',
      position: {
        x: msg.position_x || 100,
        y: msg.position_y || 100 + index * 200
      },
      data: {
        message: msg,
        onEdit: handleEditMessageRef,
        onDelete: handleDeleteMessageRef,
        onCopy: handleCopyMessageRef,
        onDuplicate: handleDuplicateMessageRef,
        onSendWhatsApp: () => {}
      } as ScriptNodeData
    }))

    // Create edges based on parent relationships with improved styling
    const newEdges: Edge[] = msgs
      .filter(msg => msg.parent_message_id)
      .map(msg => {
        const edgeColor = msg.type === 'conditional' ? '#f97316' : msg.type === 'image' ? '#3b82f6' : '#22c55e'
        return {
          id: `e-${msg.parent_message_id}-${msg.id}`,
          source: msg.parent_message_id!,
          target: msg.id,
          type: 'smoothstep',
          animated: msg.type === 'conditional',
          style: { 
            stroke: edgeColor, 
            strokeWidth: 3,
            filter: 'drop-shadow(0 0 3px rgba(34, 197, 94, 0.3))'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
            width: 20,
            height: 20
          },
          label: msg.condition === 'after_positive_response' ? '✓ Resposta +' : 
                 msg.condition === 'after_negative_response' ? '✗ Resposta -' :
                 msg.condition === 'after_no_response' ? '⏳ Follow-up' : undefined,
          labelStyle: { 
            fill: '#e2e8f0', 
            fontSize: 11,
            fontWeight: 500,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
          },
          labelBgStyle: { 
            fill: '#1e293b',
            fillOpacity: 0.9
          },
          labelBgPadding: [8, 4] as [number, number],
          labelBgBorderRadius: 4
        }
      })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [handleEditMessageRef, handleDeleteMessageRef, handleCopyMessageRef, handleDuplicateMessageRef])

  // Rebuild flow when messages change
  useEffect(() => {
    if (messages.length > 0) {
      buildFlowFromMessages(messages)
    }
  }, [messages, buildFlowFromMessages])

  const handleAddMessage = async () => {
    setEditingMessage(null)
    setShowMessageEditor(true)
  }

  const handleSaveMessage = async (messageData: Partial<ScriptMessage>) => {
    try {
      if (editingMessage) {
        // Update existing message - handled by MessageEditor
        const updatedMessages = await getMessagesByScript(script.id)
        setMessages(updatedMessages)
        buildFlowFromMessages(updatedMessages)
      } else {
        // Create new message
        const newMsg = await createMessage({
          script_id: script.id,
          title: messageData.title || 'Nova Mensagem',
          content: messageData.content,
          type: messageData.type || 'text',
          image_url: messageData.image_url,
          condition: messageData.condition,
          position_x: 100,
          position_y: messages.length * 180 + 100,
          parent_message_id: messages.length > 0 ? messages[messages.length - 1].id : undefined
        })
        
        const updatedMessages = [...messages, newMsg]
        setMessages(updatedMessages)
        buildFlowFromMessages(updatedMessages)
      }
      
      setShowMessageEditor(false)
      setEditingMessage(null)
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err)
      alert('Erro ao salvar mensagem')
    }
  }

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes)
  }, [onNodesChange])

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChange(changes)
  }, [onEdgesChange])

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({
      ...params,
      type: 'smoothstep',
      style: { stroke: '#22c55e' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#22c55e'
      }
    }, eds))
  }, [setEdges])

  const handleSavePositions = async () => {
    try {
      setSaving(true)
      const positions = nodes.map(node => ({
        id: node.id,
        position_x: node.position.x,
        position_y: node.position.y
      }))
      await updateMessagePositions(positions)
      alert('Posições salvas com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar posições:', err)
      alert('Erro ao salvar posições')
    } finally {
      setSaving(false)
    }
  }

  const handleReorderMessages = async (reorderedMessages: ScriptMessage[]) => {
    try {
      setSaving(true)
      setMessages(reorderedMessages)
      
      // Update order in database
      const orderUpdates = reorderedMessages.map(msg => ({
        id: msg.id,
        order: msg.order
      }))
      await reorderMessages(orderUpdates)
      
      // Rebuild flow with new order
      buildFlowFromMessages(reorderedMessages)
    } catch (err) {
      console.error('Erro ao reordenar mensagens:', err)
      alert('Erro ao reordenar mensagens')
    } finally {
      setSaving(false)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950">
        {/* Fullscreen Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-slate-900 to-transparent">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-500" />
              {script.name}
            </h2>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {messages.length} mensagens
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddMessage}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
            <Button
              onClick={handleSavePositions}
              disabled={saving}
              variant="outline"
              className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              title="Sair da tela cheia (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Fullscreen Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="bg-slate-800 border-slate-700 [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" />
          <MiniMap
            nodeColor={(node) => {
              const msg = messages.find(m => m.id === node.id)
              if (msg?.type === 'image') return '#3b82f6'
              if (msg?.type === 'conditional') return '#f97316'
              return '#22c55e'
            }}
            maskColor="rgba(15, 23, 42, 0.8)"
            className="bg-slate-900 border-slate-800"
            style={{ width: 200, height: 150 }}
          />
          <Panel position="bottom-center" className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-green-400" />
                Texto
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-blue-400" />
                Imagem
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-orange-400" />
                Condicional
              </span>
              <span className="text-slate-500">|</span>
              <span>Arraste os cards • Conecte arrastando os pontos • ESC para sair</span>
            </div>
          </Panel>
        </ReactFlow>

        {/* Message Editor Dialog */}
        {showMessageEditor && (
          <MessageEditor
            message={editingMessage}
            scriptId={script.id}
            open={showMessageEditor}
            onClose={() => {
              setShowMessageEditor(false)
              setEditingMessage(null)
            }}
            onSave={handleSaveMessage}
            existingMessages={messages}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-500" />
              {script.name}
            </h2>
            <p className="text-sm text-slate-400">
              {messages.length} mensagens no fluxo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'map' | 'list')}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="map" className="gap-2 data-[state=active]:bg-slate-700">
                <Map className="w-4 h-4" />
                Mapa
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-slate-700">
                <List className="w-4 h-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            onClick={handleAddMessage}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
          {viewMode === 'map' && (
            <>
              <Button
                onClick={handleSavePositions}
                disabled={saving}
                variant="outline"
                className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                title="Abrir em tela cheia"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <List className="w-5 h-5 text-green-500" />
                Mensagens em Ordem
              </h3>
              <p className="text-sm text-slate-400">
                Arraste para reordenar as mensagens do fluxo
              </p>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              {messages.length > 0 ? (
                <DraggableMessageList
                  messages={messages}
                  onReorder={handleReorderMessages}
                  onEdit={handleEditMessageRef}
                  onDelete={handleDeleteMessageRef}
                  onDuplicate={async (msgId) => {
                    const msg = messages.find(m => m.id === msgId)
                    if (msg) await handleDuplicateMessageRef(msg)
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhuma mensagem criada ainda.</p>
                  <Button
                    onClick={handleAddMessage}
                    className="mt-4 gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Primeira Mensagem
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        /* Flow Canvas */
        <div className="h-[700px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="bg-slate-800 border-slate-700 [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" />
          <MiniMap
            nodeColor={(node) => {
              const msg = messages.find(m => m.id === node.id)
              if (msg?.type === 'image') return '#3b82f6'
              if (msg?.type === 'conditional') return '#f97316'
              return '#22c55e'
            }}
            maskColor="rgba(15, 23, 42, 0.8)"
            className="bg-slate-900 border-slate-800"
          />
          <Panel position="bottom-center" className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-green-400" />
                Texto
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-blue-400" />
                Imagem
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-orange-400" />
                Condicional
              </span>
              <span className="text-slate-500">|</span>
              <span>Arraste os cards • Conecte arrastando os pontos</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      )}

      {/* Message Editor Dialog */}
      {showMessageEditor && (
        <MessageEditor
          message={editingMessage}
          scriptId={script.id}
          open={showMessageEditor}
          onClose={() => {
            setShowMessageEditor(false)
            setEditingMessage(null)
          }}
          onSave={handleSaveMessage}
          existingMessages={messages}
        />
      )}
    </div>
  )
}

export default ScriptMindMap
