import { useState, useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  MarkerType,
  Panel,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Image as ImageIcon,
  GitBranch,
  Send,
  Copy,
  X,
  Maximize2,
  Map
} from 'lucide-react'
import type { WhatsAppScript, ScriptMessage, TemplateVariables } from '@/types/scripts'
import { getMessagesByScript, replaceTemplateVariables, generateWhatsAppLink } from '@/services/scriptsService'

interface FullMindMapDialogProps {
  script: WhatsAppScript | null
  open: boolean
  onClose: () => void
  customValues: TemplateVariables
  phone?: string
}

interface ReadOnlyNodeData {
  message: ScriptMessage
  customValues: TemplateVariables
  onSend: (message: ScriptMessage) => void
  onCopy: (content: string) => void
}

// Read-only Message Node Component
const ReadOnlyMessageNode = ({ data }: { data: ReadOnlyNodeData }) => {
  const { message, customValues, onSend, onCopy } = data

  const getTypeColor = () => {
    switch (message.type) {
      case 'image':
        return { border: 'border-blue-500', bg: 'bg-blue-900/20', handle: '#3b82f6' }
      case 'conditional':
        return { border: 'border-orange-500', bg: 'bg-orange-900/20', handle: '#f97316' }
      default:
        return { border: 'border-green-500', bg: 'bg-green-900/20', handle: '#22c55e' }
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

  const colors = getTypeColor()
  const processedContent = replaceTemplateVariables(message.content || '', customValues)

  const handleSendClick = useCallback(() => {
    onSend(message)
  }, [onSend, message])

  const handleCopyClick = useCallback(() => {
    onCopy(processedContent)
  }, [onCopy, processedContent])

  return (
    <div className="relative">
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-700 !border-slate-500"
      />
      
      <Card className={`min-w-[260px] max-w-[300px] bg-slate-900 ${colors.border} border-2 shadow-xl`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {message.order}
            </Badge>
            {getTypeIcon()}
            <span className="text-sm font-medium text-white truncate flex-1">{message.title}</span>
          </div>
          
          {message.image_url && (
            <div className="mb-2 rounded overflow-hidden bg-slate-800">
              <img 
                src={message.image_url} 
                alt="Preview" 
                className="w-full h-20 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
          
          <p className="text-xs text-slate-400 line-clamp-4 whitespace-pre-wrap mb-2">
            {processedContent || '[Sem conteúdo]'}
          </p>

          {message.condition && (
            <div className="p-1.5 bg-orange-900/20 rounded border border-orange-600/30 mb-2">
              <p className="text-[10px] text-orange-400">
                ⏳ {message.condition === 'after_positive_response' ? 'Após resposta +' : 
                   message.condition === 'after_negative_response' ? 'Após resposta -' :
                   message.condition === 'after_no_response' ? 'Sem resposta' : message.condition}
              </p>
            </div>
          )}

          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSendClick}
              className="flex-1 h-6 text-xs gap-1 bg-green-600 hover:bg-green-700"
            >
              <Send className="w-3 h-3" />
              Enviar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyClick}
              className="h-6 px-2 text-slate-400 hover:text-white"
              title="Copiar"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-slate-500"
        style={{ background: colors.handle }}
      />
    </div>
  )
}

// Memoize node types to prevent re-renders
const nodeTypes: NodeTypes = {
  readonlyMessage: ReadOnlyMessageNode
}

export const FullMindMapDialog = ({
  script,
  open,
  onClose,
  customValues,
  phone
}: FullMindMapDialogProps) => {
  const [messages, setMessages] = useState<ScriptMessage[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handlers need to be stable
  const handleSendMessage = useCallback((message: ScriptMessage) => {
    if (!phone) {
      alert('Este site não possui telefone cadastrado')
      return
    }

    const processedContent = replaceTemplateVariables(message.content || '', customValues)
    const link = generateWhatsAppLink(phone, processedContent)
    window.open(link, '_blank')
  }, [phone, customValues])

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => alert('Mensagem copiada!'))
      .catch(() => alert('Erro ao copiar'))
  }, [])

  // Build flow from messages
  const buildFlow = useCallback((msgs: ScriptMessage[]) => {
    if (msgs.length === 0) {
      setNodes([])
      setEdges([])
      return
    }

    // Calculate positions using a tree layout algorithm
    const nodePositions = calculateTreeLayout(msgs)
    
    const newNodes: Node[] = msgs.map((msg) => ({
      id: msg.id,
      type: 'readonlyMessage',
      position: nodePositions[msg.id] || { x: 100, y: 100 },
      data: {
        message: msg,
        customValues,
        onSend: handleSendMessage,
        onCopy: handleCopyMessage
      } as ReadOnlyNodeData
    }))

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
          style: { stroke: edgeColor, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
            width: 16,
            height: 16
          },
          label: msg.condition === 'after_positive_response' ? '✓ Sim' : 
                 msg.condition === 'after_negative_response' ? '✗ Não' :
                 msg.condition === 'after_no_response' ? '⏳ Sem resposta' : undefined,
          labelStyle: { fill: '#e2e8f0', fontSize: 10 },
          labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4
        }
      })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [customValues, handleSendMessage, handleCopyMessage, setNodes, setEdges])

  // Load messages when dialog opens
  useEffect(() => {
    if (open && script) {
      loadMessages()
    }
  }, [open, script?.id])

  const loadMessages = async () => {
    if (!script) return
    
    try {
      setLoading(true)
      const data = await getMessagesByScript(script.id)
      setMessages(data)
      buildFlow(data)
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setIsFullscreen(false)
    }
  }, [open])

  if (!script) return null

  // Fullscreen Mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-slate-900 to-transparent">
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6 text-green-500" />
            <div>
              <h2 className="text-lg font-bold text-white">{script.name}</h2>
              <p className="text-xs text-slate-400">{messages.length} mensagens no fluxo</p>
            </div>
          </div>
          <Button
            onClick={() => setIsFullscreen(false)}
            variant="outline"
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
            Sair da Tela Cheia
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls 
            showInteractive={false}
            className="bg-slate-800 border-slate-700 [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" 
          />
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
          <Panel position="bottom-center" className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-400">
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
            </div>
          </Panel>
        </ReactFlow>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-slate-900 border-slate-800">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-green-500" />
              Mapa Mental: {script.name}
            </DialogTitle>
            <Button
              onClick={() => setIsFullscreen(true)}
              variant="outline"
              size="sm"
              className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Maximize2 className="w-4 h-4" />
              Tela Cheia
            </Button>
          </div>
          <p className="text-sm text-slate-400">{messages.length} mensagens • Clique em "Enviar" para abrir o WhatsApp</p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="h-[600px] bg-slate-950 rounded-b-lg overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.3}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#334155" gap={20} size={1} />
              <Controls 
                showInteractive={false}
                className="bg-slate-800 border-slate-700 [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" 
              />
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
              <Panel position="bottom-center" className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-400">
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
                </div>
              </Panel>
            </ReactFlow>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to calculate tree layout positions
function calculateTreeLayout(messages: ScriptMessage[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  
  // If messages have valid positions, use them
  const hasValidPositions = messages.some(m => (m.position_x && m.position_x > 0) || (m.position_y && m.position_y > 0))
  
  if (hasValidPositions) {
    messages.forEach(msg => {
      positions[msg.id] = {
        x: msg.position_x || 100,
        y: msg.position_y || 100
      }
    })
    return positions
  }
  
  // Otherwise, calculate a tree layout
  const nodeWidth = 320
  const nodeHeight = 200
  const horizontalSpacing = 50
  const verticalSpacing = 80
  
  // Find root nodes (no parent)
  const rootNodes = messages.filter(m => !m.parent_message_id)
  
  // Build children map
  const childrenMap: Record<string, ScriptMessage[]> = {}
  messages.forEach(msg => {
    if (msg.parent_message_id) {
      if (!childrenMap[msg.parent_message_id]) {
        childrenMap[msg.parent_message_id] = []
      }
      childrenMap[msg.parent_message_id].push(msg)
    }
  })
  
  // Sort children by order
  Object.keys(childrenMap).forEach(parentId => {
    childrenMap[parentId].sort((a, b) => a.order - b.order)
  })
  
  // Calculate width of subtree
  const getSubtreeWidth = (nodeId: string): number => {
    const children = childrenMap[nodeId] || []
    if (children.length === 0) return nodeWidth
    
    const childrenWidth = children.reduce((sum, child) => {
      return sum + getSubtreeWidth(child.id) + horizontalSpacing
    }, -horizontalSpacing)
    
    return Math.max(nodeWidth, childrenWidth)
  }
  
  // Position nodes recursively
  const positionNode = (node: ScriptMessage, x: number, y: number) => {
    positions[node.id] = { x, y }
    
    const children = childrenMap[node.id] || []
    if (children.length === 0) return
    
    const totalWidth = children.reduce((sum, child) => {
      return sum + getSubtreeWidth(child.id) + horizontalSpacing
    }, -horizontalSpacing)
    
    let currentX = x - totalWidth / 2 + nodeWidth / 2
    
    children.forEach(child => {
      const childWidth = getSubtreeWidth(child.id)
      const childX = currentX + childWidth / 2 - nodeWidth / 2
      positionNode(child, childX, y + nodeHeight + verticalSpacing)
      currentX += childWidth + horizontalSpacing
    })
  }
  
  // Position all root nodes
  let totalRootWidth = rootNodes.reduce((sum, node) => {
    return sum + getSubtreeWidth(node.id) + horizontalSpacing
  }, -horizontalSpacing)
  
  let currentX = -totalRootWidth / 2 + nodeWidth / 2
  
  rootNodes.sort((a, b) => a.order - b.order).forEach(root => {
    const rootWidth = getSubtreeWidth(root.id)
    const rootX = currentX + rootWidth / 2 - nodeWidth / 2
    positionNode(root, rootX, 50)
    currentX += rootWidth + horizontalSpacing
  })
  
  return positions
}

export default FullMindMapDialog
