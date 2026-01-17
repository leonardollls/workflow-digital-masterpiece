// Tipos para o sistema de Scripts de WhatsApp

export type MessageType = 'text' | 'image' | 'conditional'

export interface WhatsAppScript {
  id: string
  name: string
  description?: string
  category_id?: string
  category?: {
    id: string
    name: string
    color: string
  }
  is_template: boolean
  created_at?: string
  updated_at?: string
  messages?: ScriptMessage[]
}

export interface ScriptMessage {
  id: string
  script_id: string
  order: number
  type: MessageType
  title: string
  content?: string
  image_url?: string
  condition?: string
  position_x: number
  position_y: number
  parent_message_id?: string
  created_at?: string
}

export interface SiteScriptAssignment {
  id: string
  site_id: string
  script_id: string
  custom_values: Record<string, string>
  sent_messages: SentMessageRecord[]
  assigned_at?: string
  script?: WhatsAppScript
}

export interface SentMessageRecord {
  message_id: string
  sent_at: string
  status: 'sent' | 'pending' | 'failed'
}

// Tipos para criação
export interface CreateWhatsAppScriptData {
  name: string
  description?: string
  category_id?: string
  is_template?: boolean
}

export interface UpdateWhatsAppScriptData extends Partial<CreateWhatsAppScriptData> {
  id: string
}

export interface CreateScriptMessageData {
  script_id: string
  order?: number
  type?: MessageType
  title: string
  content?: string
  image_url?: string
  condition?: string
  position_x?: number
  position_y?: number
  parent_message_id?: string
}

export interface UpdateScriptMessageData extends Partial<CreateScriptMessageData> {
  id: string
}

export interface CreateSiteScriptAssignmentData {
  site_id: string
  script_id: string
  custom_values?: Record<string, string>
}

export interface UpdateSiteScriptAssignmentData {
  id: string
  custom_values?: Record<string, string>
  sent_messages?: SentMessageRecord[]
}

// Variáveis de template suportadas
export interface TemplateVariables {
  nome_empresa?: string
  nome_contato?: string
  cidade?: string
  segmento?: string
  link_proposta?: string
  [key: string]: string | undefined
}

// Tipos para React Flow
export interface ScriptNodeData {
  message: ScriptMessage
  onEdit: (message: ScriptMessage) => void
  onDelete: (messageId: string) => void
  onCopy: (content: string) => void
  onDuplicate?: (message: ScriptMessage) => void
  onSendWhatsApp: (message: ScriptMessage) => void
  variables?: TemplateVariables
}

export interface ScriptEdgeData {
  condition?: string
}

// Estatísticas de scripts
export interface ScriptStats {
  total_scripts: number
  total_templates: number
  total_assignments: number
  most_used_scripts: Array<{
    script_id: string
    script_name: string
    usage_count: number
  }>
  scripts_by_category: Array<{
    category_name: string
    category_color: string
    count: number
  }>
}
