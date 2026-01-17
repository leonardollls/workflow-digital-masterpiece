import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GripVertical,
  MessageSquare,
  Image as ImageIcon,
  GitBranch,
  Edit2,
  Trash2,
  Copy
} from 'lucide-react'
import type { ScriptMessage } from '@/types/scripts'

interface DraggableMessageListProps {
  messages: ScriptMessage[]
  onReorder: (messages: ScriptMessage[]) => void
  onEdit: (message: ScriptMessage) => void
  onDelete: (messageId: string) => void
  onDuplicate: (messageId: string) => void
}

export const DraggableMessageList = ({
  messages,
  onReorder,
  onEdit,
  onDelete,
  onDuplicate
}: DraggableMessageListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex((m) => m.id === active.id)
      const newIndex = messages.findIndex((m) => m.id === over.id)
      
      const reorderedMessages = arrayMove(messages, oldIndex, newIndex).map((msg, index) => ({
        ...msg,
        order: index + 1
      }))
      
      onReorder(reorderedMessages)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={messages.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {messages.map((message) => (
            <SortableMessageItem
              key={message.id}
              message={message}
              onEdit={() => onEdit(message)}
              onDelete={() => onDelete(message.id)}
              onDuplicate={() => onDuplicate(message.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface SortableMessageItemProps {
  message: ScriptMessage
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

const SortableMessageItem = ({
  message,
  onEdit,
  onDelete,
  onDuplicate
}: SortableMessageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: message.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.8 : 1
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

  const getTypeBorder = () => {
    switch (message.type) {
      case 'image':
        return 'border-l-blue-500'
      case 'conditional':
        return 'border-l-orange-500'
      default:
        return 'border-l-green-500'
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`bg-slate-900 border-slate-700 border-l-4 ${getTypeBorder()} ${isDragging ? 'ring-2 ring-green-500 shadow-xl' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Arrastar para reordenar"
            >
              <GripVertical className="w-5 h-5" />
            </button>

            {/* Order Badge */}
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs min-w-[28px] justify-center">
              {message.order}
            </Badge>

            {/* Type Icon */}
            {getTypeIcon()}

            {/* Message Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{message.title}</p>
              <p className="text-xs text-slate-500 truncate">
                {message.content?.substring(0, 50) || '[Sem conteúdo]'}
                {message.content && message.content.length > 50 ? '...' : ''}
              </p>
            </div>

            {/* Conditional Badge */}
            {message.condition && (
              <Badge className="bg-orange-900/30 text-orange-400 text-[10px]">
                {message.condition === 'after_positive_response' ? 'Resposta +' : 
                 message.condition === 'after_negative_response' ? 'Resposta -' :
                 message.condition === 'after_no_response' ? 'Sem resposta' : 'Condicional'}
              </Badge>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={onDuplicate}
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Duplicar"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onEdit}
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DraggableMessageList
