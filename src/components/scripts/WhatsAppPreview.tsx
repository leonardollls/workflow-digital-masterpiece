import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  Phone,
  Video,
  Search,
  Paperclip,
  Mic,
  Smile,
  Send,
  Image as ImageIcon
} from 'lucide-react'
import type { ScriptMessage, TemplateVariables } from '@/types/scripts'
import { replaceTemplateVariables } from '@/services/scriptsService'

interface WhatsAppPreviewProps {
  messages: ScriptMessage[]
  variables: TemplateVariables
  contactName?: string
  contactPhone?: string
  showAllMessages?: boolean
  highlightMessageId?: string
  onSendMessage?: (message: ScriptMessage) => void
}

export const WhatsAppPreview = ({
  messages,
  variables,
  contactName = 'Contato',
  contactPhone,
  showAllMessages = true,
  highlightMessageId,
  onSendMessage
}: WhatsAppPreviewProps) => {
  const [currentTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  })

  const sortedMessages = [...messages].sort((a, b) => a.order - b.order)
  const displayMessages = showAllMessages ? sortedMessages : sortedMessages.slice(0, 3)

  return (
    <Card className="w-full max-w-md mx-auto bg-[#0b141a] border-[#222d34] rounded-2xl overflow-hidden shadow-2xl">
      {/* WhatsApp Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
        {/* Back Arrow & Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center text-white font-medium">
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{contactName}</p>
            {contactPhone && (
              <p className="text-[#8696a0] text-xs">+55 {contactPhone}</p>
            )}
          </div>
        </div>
        
        {/* Action Icons */}
        <div className="flex items-center gap-4 ml-auto">
          <Video className="w-5 h-5 text-[#aebac1]" />
          <Phone className="w-5 h-5 text-[#aebac1]" />
          <MoreVertical className="w-5 h-5 text-[#aebac1]" />
        </div>
      </div>

      {/* Chat Background with Pattern */}
      <div 
        className="h-[400px] relative"
        style={{
          backgroundColor: '#0b141a',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {/* Date Badge */}
            <div className="flex justify-center mb-4">
              <Badge className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg shadow">
                Hoje
              </Badge>
            </div>

            {/* Messages */}
            {displayMessages.map((msg, index) => (
              <WhatsAppBubble
                key={msg.id}
                message={msg}
                variables={variables}
                time={currentTime}
                isHighlighted={msg.id === highlightMessageId}
                onSend={onSendMessage ? () => onSendMessage(msg) : undefined}
              />
            ))}

            {!showAllMessages && messages.length > 3 && (
              <div className="flex justify-center py-2">
                <Badge className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1">
                  +{messages.length - 3} mensagens...
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2">
        <Smile className="w-6 h-6 text-[#8696a0]" />
        <Paperclip className="w-6 h-6 text-[#8696a0]" />
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
          <p className="text-[#8696a0] text-sm">Mensagem</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  )
}

interface WhatsAppBubbleProps {
  message: ScriptMessage
  variables: TemplateVariables
  time: string
  isHighlighted?: boolean
  onSend?: () => void
}

const WhatsAppBubble = ({ message, variables, time, isHighlighted, onSend }: WhatsAppBubbleProps) => {
  const processedContent = replaceTemplateVariables(message.content || '', variables)
  
  // Parse WhatsApp formatting
  const formatWhatsAppText = (text: string) => {
    // Bold: *text*
    let formatted = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    // Italic: _text_
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>')
    // Strikethrough: ~text~
    formatted = formatted.replace(/~([^~]+)~/g, '<del>$1</del>')
    // Monospace: ```text```
    formatted = formatted.replace(/```([^`]+)```/g, '<code>$1</code>')
    
    return formatted
  }

  const isConditional = message.type === 'conditional'

  return (
    <div className={`flex justify-end ${isHighlighted ? 'animate-pulse' : ''}`}>
      <div 
        className={`
          max-w-[85%] rounded-lg p-2 shadow relative
          ${isConditional 
            ? 'bg-[#3d2e14] border border-orange-600/30' 
            : 'bg-[#005c4b]'
          }
        `}
        style={{
          borderTopRightRadius: '4px'
        }}
      >
        {/* Triangle tail */}
        <div 
          className={`absolute -right-2 top-0 w-0 h-0 border-t-8 border-l-8 border-t-transparent border-l-[${isConditional ? '#3d2e14' : '#005c4b'}]`}
          style={{
            borderLeftColor: isConditional ? '#3d2e14' : '#005c4b'
          }}
        />
        
        {/* Conditional Badge */}
        {isConditional && (
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-orange-400">
              {message.condition === 'after_positive_response' ? 'Após resposta positiva' : 
               message.condition === 'after_negative_response' ? 'Após resposta negativa' :
               message.condition === 'after_no_response' ? 'Após sem resposta' : 
               message.condition}
            </span>
          </div>
        )}

        {/* Image Preview */}
        {message.type === 'image' && message.image_url && (
          <div className="mb-2 rounded overflow-hidden">
            <img 
              src={message.image_url} 
              alt="Mockup" 
              className="w-full max-h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}

        {message.type === 'image' && !message.image_url && (
          <div className="mb-2 bg-[#182229] rounded p-4 flex items-center justify-center">
            <div className="text-center text-[#8696a0]">
              <ImageIcon className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs">[IMAGEM DO MOCKUP]</p>
            </div>
          </div>
        )}

        {/* Message Content */}
        {processedContent && (
          <p 
            className="text-white text-sm whitespace-pre-wrap break-words leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatWhatsAppText(processedContent) }}
          />
        )}

        {/* Time & Status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-[#8696a0]">{time}</span>
          <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
        </div>

        {/* Send Button (if interactive) */}
        {onSend && (
          <Button
            size="sm"
            onClick={onSend}
            className="mt-2 w-full h-7 text-xs bg-[#00a884] hover:bg-[#00c897] text-white"
          >
            <Send className="w-3 h-3 mr-1" />
            Enviar via WhatsApp
          </Button>
        )}
      </div>
    </div>
  )
}

export default WhatsAppPreview
