import { supabase } from '@/lib/supabase'
import type {
  WhatsAppScript,
  ScriptMessage,
  SiteScriptAssignment,
  CreateWhatsAppScriptData,
  UpdateWhatsAppScriptData,
  CreateScriptMessageData,
  UpdateScriptMessageData,
  CreateSiteScriptAssignmentData,
  UpdateSiteScriptAssignmentData,
  ScriptStats,
  TemplateVariables,
  SentMessageRecord
} from '@/types/scripts'

// =====================================================
// SCRIPTS CRUD
// =====================================================

export const getScripts = async (onlyTemplates: boolean = false): Promise<WhatsAppScript[]> => {
  let query = supabase
    .from('whatsapp_scripts')
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .order('created_at', { ascending: false })

  if (onlyTemplates) {
    query = query.eq('is_template', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar scripts:', error)
    throw new Error('Erro ao carregar scripts')
  }

  return data || []
}

export const getScriptById = async (scriptId: string): Promise<WhatsAppScript | null> => {
  const { data, error } = await supabase
    .from('whatsapp_scripts')
    .select(`
      *,
      category:categories(id, name, color),
      messages:script_messages(*)
    `)
    .eq('id', scriptId)
    .single()

  if (error) {
    console.error('Erro ao buscar script:', error)
    return null
  }

  return data
}

export const createScript = async (scriptData: CreateWhatsAppScriptData): Promise<WhatsAppScript> => {
  const { data, error } = await supabase
    .from('whatsapp_scripts')
    .insert({
      ...scriptData,
      is_template: scriptData.is_template ?? true
    })
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .single()

  if (error) {
    console.error('Erro ao criar script:', error)
    throw new Error('Erro ao criar script')
  }

  return data
}

export const updateScript = async (scriptData: UpdateWhatsAppScriptData): Promise<WhatsAppScript> => {
  const { id, ...updateData } = scriptData

  const { data, error } = await supabase
    .from('whatsapp_scripts')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .single()

  if (error) {
    console.error('Erro ao atualizar script:', error)
    throw new Error('Erro ao atualizar script')
  }

  return data
}

export const deleteScript = async (scriptId: string): Promise<void> => {
  const { error } = await supabase
    .from('whatsapp_scripts')
    .delete()
    .eq('id', scriptId)

  if (error) {
    console.error('Erro ao deletar script:', error)
    throw new Error('Erro ao deletar script')
  }
}

export const duplicateScript = async (scriptId: string, newName: string): Promise<WhatsAppScript> => {
  // Buscar script original com mensagens
  const original = await getScriptById(scriptId)
  if (!original) {
    throw new Error('Script não encontrado')
  }

  // Criar novo script
  const newScript = await createScript({
    name: newName,
    description: original.description,
    category_id: original.category_id,
    is_template: true
  })

  // Duplicar mensagens se existirem
  if (original.messages && original.messages.length > 0) {
    const messageIdMap: Record<string, string> = {}
    
    // Primeiro pass: criar mensagens sem parent
    for (const msg of original.messages.filter(m => !m.parent_message_id)) {
      const newMsg = await createMessage({
        script_id: newScript.id,
        order: msg.order,
        type: msg.type,
        title: msg.title,
        content: msg.content,
        image_url: msg.image_url,
        condition: msg.condition,
        position_x: msg.position_x,
        position_y: msg.position_y
      })
      messageIdMap[msg.id] = newMsg.id
    }

    // Segundo pass: criar mensagens com parent
    for (const msg of original.messages.filter(m => m.parent_message_id)) {
      const newMsg = await createMessage({
        script_id: newScript.id,
        order: msg.order,
        type: msg.type,
        title: msg.title,
        content: msg.content,
        image_url: msg.image_url,
        condition: msg.condition,
        position_x: msg.position_x,
        position_y: msg.position_y,
        parent_message_id: messageIdMap[msg.parent_message_id!]
      })
      messageIdMap[msg.id] = newMsg.id
    }
  }

  return getScriptById(newScript.id) as Promise<WhatsAppScript>
}

// =====================================================
// MESSAGES CRUD
// =====================================================

export const getMessagesByScript = async (scriptId: string): Promise<ScriptMessage[]> => {
  const { data, error } = await supabase
    .from('script_messages')
    .select('*')
    .eq('script_id', scriptId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Erro ao buscar mensagens:', error)
    throw new Error('Erro ao carregar mensagens')
  }

  return data || []
}

export const createMessage = async (messageData: CreateScriptMessageData): Promise<ScriptMessage> => {
  // Se não especificou order, pegar o próximo disponível
  let order = messageData.order
  if (order === undefined) {
    const messages = await getMessagesByScript(messageData.script_id)
    order = messages.length > 0 ? Math.max(...messages.map(m => m.order)) + 1 : 1
  }

  const { data, error } = await supabase
    .from('script_messages')
    .insert({
      ...messageData,
      order,
      type: messageData.type || 'text',
      position_x: messageData.position_x || 0,
      position_y: messageData.position_y || 0
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar mensagem:', error)
    throw new Error('Erro ao criar mensagem')
  }

  return data
}

export const updateMessage = async (messageData: UpdateScriptMessageData): Promise<ScriptMessage> => {
  const { id, ...updateData } = messageData

  const { data, error } = await supabase
    .from('script_messages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar mensagem:', error)
    throw new Error('Erro ao atualizar mensagem')
  }

  return data
}

export const deleteMessage = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from('script_messages')
    .delete()
    .eq('id', messageId)

  if (error) {
    console.error('Erro ao deletar mensagem:', error)
    throw new Error('Erro ao deletar mensagem')
  }
}

export const updateMessagePositions = async (
  positions: Array<{ id: string; position_x: number; position_y: number }>
): Promise<void> => {
  for (const pos of positions) {
    await supabase
      .from('script_messages')
      .update({ position_x: pos.position_x, position_y: pos.position_y })
      .eq('id', pos.id)
  }
}

export const reorderMessages = async (
  messages: Array<{ id: string; order: number }>
): Promise<void> => {
  for (const msg of messages) {
    await supabase
      .from('script_messages')
      .update({ order: msg.order })
      .eq('id', msg.id)
  }
}

export const duplicateMessage = async (messageId: string): Promise<ScriptMessage> => {
  // Buscar mensagem original
  const { data: original, error: fetchError } = await supabase
    .from('script_messages')
    .select('*')
    .eq('id', messageId)
    .single()

  if (fetchError || !original) {
    throw new Error('Mensagem não encontrada')
  }

  // Buscar próximo order disponível
  const messages = await getMessagesByScript(original.script_id)
  const nextOrder = messages.length > 0 ? Math.max(...messages.map(m => m.order)) + 1 : 1

  // Criar cópia da mensagem
  const { data: newMessage, error: createError } = await supabase
    .from('script_messages')
    .insert({
      script_id: original.script_id,
      order: nextOrder,
      type: original.type,
      title: `${original.title} (Cópia)`,
      content: original.content,
      image_url: original.image_url,
      condition: original.condition,
      position_x: (original.position_x || 100) + 350,
      position_y: original.position_y || 100,
      parent_message_id: original.parent_message_id
    })
    .select()
    .single()

  if (createError) {
    console.error('Erro ao duplicar mensagem:', createError)
    throw new Error('Erro ao duplicar mensagem')
  }

  return newMessage
}

// =====================================================
// EXPORT/IMPORT SCRIPTS
// =====================================================

export interface ScriptExportData {
  version: string
  exportedAt: string
  script: {
    name: string
    description?: string
    is_template: boolean
  }
  messages: Array<{
    order: number
    type: string
    title: string
    content?: string
    image_url?: string
    condition?: string
    position_x: number
    position_y: number
    parent_order?: number
  }>
}

// Formato do Playbook (formato do exemplo JSON)
export interface PlaybookExportData {
  playbook_title: string
  nodes: Array<{
    id: string
    type: 'text' | 'image' | 'conditional'
    title: string
    objective?: string
    content?: string
    note?: string
    image_url?: string
    next_node?: string
    connections?: Array<{
      label: string
      target_id: string
    }>
  }>
}

// Type guard para detectar formato
function isPlaybookFormat(data: any): data is PlaybookExportData {
  return data && typeof data.playbook_title === 'string' && Array.isArray(data.nodes)
}

function isStandardFormat(data: any): data is ScriptExportData {
  return data && data.version && data.script && Array.isArray(data.messages)
}

export const exportScript = async (scriptId: string): Promise<ScriptExportData> => {
  const script = await getScriptById(scriptId)
  if (!script) {
    throw new Error('Script não encontrado')
  }

  const messages = await getMessagesByScript(scriptId)
  
  // Mapear IDs para orders para referência de parent
  const idToOrder: Record<string, number> = {}
  messages.forEach(msg => {
    idToOrder[msg.id] = msg.order
  })

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    script: {
      name: script.name,
      description: script.description,
      is_template: script.is_template
    },
    messages: messages.map(msg => ({
      order: msg.order,
      type: msg.type,
      title: msg.title,
      content: msg.content,
      image_url: msg.image_url,
      condition: msg.condition,
      position_x: msg.position_x,
      position_y: msg.position_y,
      parent_order: msg.parent_message_id ? idToOrder[msg.parent_message_id] : undefined
    }))
  }
}

// Função unificada de importação que detecta o formato automaticamente
export const importScript = async (data: any, newName?: string): Promise<WhatsAppScript> => {
  // Detectar formato e importar
  if (isPlaybookFormat(data)) {
    return importPlaybookScript(data, newName)
  } else if (isStandardFormat(data)) {
    return importStandardScript(data, newName)
  } else {
    throw new Error('Formato de importação não reconhecido. Use o formato padrão ou o formato Playbook.')
  }
}

// Importação do formato padrão (exportado pelo sistema)
async function importStandardScript(data: ScriptExportData, newName?: string): Promise<WhatsAppScript> {
  // Criar novo script
  const newScript = await createScript({
    name: newName || `${data.script.name} (Importado)`,
    description: data.script.description,
    is_template: data.script.is_template
  })

  // Ordenar mensagens por order e criar mapeamento
  const sortedMessages = [...data.messages].sort((a, b) => a.order - b.order)
  const orderToId: Record<number, string> = {}

  // Criar mensagens em ordem
  for (const msgData of sortedMessages) {
    const parentId = msgData.parent_order ? orderToId[msgData.parent_order] : undefined
    
    const newMsg = await createMessage({
      script_id: newScript.id,
      order: msgData.order,
      type: msgData.type as any,
      title: msgData.title,
      content: msgData.content,
      image_url: msgData.image_url,
      condition: msgData.condition,
      position_x: msgData.position_x,
      position_y: msgData.position_y,
      parent_message_id: parentId
    })
    
    orderToId[msgData.order] = newMsg.id
  }

  return getScriptById(newScript.id) as Promise<WhatsAppScript>
}

// Importação do formato Playbook (formato do JSON de exemplo)
async function importPlaybookScript(data: PlaybookExportData, newName?: string): Promise<WhatsAppScript> {
  // Criar novo script
  const newScript = await createScript({
    name: newName || data.playbook_title,
    description: `Importado do Playbook: ${data.playbook_title}`,
    is_template: true
  })

  // Mapear IDs originais para novos IDs
  const oldIdToNewId: Record<string, string> = {}
  
  // Primeiro, identificar a estrutura de conexões para determinar parents
  // Um node é "parent" de outro se:
  // 1. next_node aponta para ele
  // 2. connections[].target_id aponta para ele
  const parentMap: Record<string, { parentId: string; condition?: string }> = {}
  
  data.nodes.forEach(node => {
    // Conexão simples via next_node
    if (node.next_node) {
      parentMap[node.next_node] = { parentId: node.id }
    }
    
    // Conexões múltiplas (condicionais)
    if (node.connections) {
      node.connections.forEach(conn => {
        let condition: string | undefined
        
        // Mapear labels para conditions do sistema
        const labelLower = conn.label.toLowerCase()
        if (labelLower.includes('positiva') || labelLower.includes('sim') || labelLower.includes('aceitou')) {
          condition = 'after_positive_response'
        } else if (labelLower.includes('negativa') || labelLower.includes('não') || labelLower.includes('objeção')) {
          condition = 'after_negative_response'
        } else if (labelLower.includes('vácuo') || labelLower.includes('sem resposta')) {
          condition = 'after_no_response'
        } else {
          // Para outras condições, usar o label como condition
          condition = conn.label
        }
        
        parentMap[conn.target_id] = { parentId: node.id, condition }
      })
    }
  })

  // Calcular posições de layout em árvore
  const positions = calculatePlaybookPositions(data.nodes, parentMap)

  // Criar mensagens em ordem topológica (parents primeiro)
  const createdNodes = new Set<string>()
  const nodesToCreate = [...data.nodes]
  let order = 1
  
  // Função para criar um node
  const createNodeMessage = async (node: typeof data.nodes[0]) => {
    if (createdNodes.has(node.id)) return
    
    // Se tem parent, criar parent primeiro
    const parentInfo = parentMap[node.id]
    if (parentInfo && !createdNodes.has(parentInfo.parentId)) {
      const parentNode = data.nodes.find(n => n.id === parentInfo.parentId)
      if (parentNode) {
        await createNodeMessage(parentNode)
      }
    }
    
    const position = positions[node.id] || { x: 100, y: order * 200 }
    
    const newMsg = await createMessage({
      script_id: newScript.id,
      order: order++,
      type: node.type || 'text',
      title: node.title,
      content: node.content || node.note || '',
      image_url: node.image_url,
      condition: parentInfo?.condition,
      position_x: position.x,
      position_y: position.y,
      parent_message_id: parentInfo ? oldIdToNewId[parentInfo.parentId] : undefined
    })
    
    oldIdToNewId[node.id] = newMsg.id
    createdNodes.add(node.id)
  }
  
  // Criar todos os nodes
  for (const node of nodesToCreate) {
    await createNodeMessage(node)
  }

  return getScriptById(newScript.id) as Promise<WhatsAppScript>
}

// Calcular posições para o layout do Playbook
function calculatePlaybookPositions(
  nodes: PlaybookExportData['nodes'],
  parentMap: Record<string, { parentId: string; condition?: string }>
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  
  const nodeWidth = 320
  const nodeHeight = 220
  const horizontalSpacing = 80
  const verticalSpacing = 100
  
  // Encontrar nodes raiz (sem parent)
  const rootNodes = nodes.filter(n => !parentMap[n.id])
  
  // Construir mapa de filhos
  const childrenMap: Record<string, string[]> = {}
  nodes.forEach(node => {
    const parentInfo = parentMap[node.id]
    if (parentInfo) {
      if (!childrenMap[parentInfo.parentId]) {
        childrenMap[parentInfo.parentId] = []
      }
      childrenMap[parentInfo.parentId].push(node.id)
    }
  })
  
  // Calcular largura de subárvore
  const getSubtreeWidth = (nodeId: string): number => {
    const children = childrenMap[nodeId] || []
    if (children.length === 0) return nodeWidth
    
    const childrenWidth = children.reduce((sum, childId) => {
      return sum + getSubtreeWidth(childId) + horizontalSpacing
    }, -horizontalSpacing)
    
    return Math.max(nodeWidth, childrenWidth)
  }
  
  // Posicionar nodes recursivamente
  const positionNode = (nodeId: string, x: number, y: number) => {
    positions[nodeId] = { x, y }
    
    const children = childrenMap[nodeId] || []
    if (children.length === 0) return
    
    const totalWidth = children.reduce((sum, childId) => {
      return sum + getSubtreeWidth(childId) + horizontalSpacing
    }, -horizontalSpacing)
    
    let currentX = x - totalWidth / 2 + nodeWidth / 2
    
    children.forEach(childId => {
      const childWidth = getSubtreeWidth(childId)
      const childX = currentX + childWidth / 2 - nodeWidth / 2
      positionNode(childId, childX, y + nodeHeight + verticalSpacing)
      currentX += childWidth + horizontalSpacing
    })
  }
  
  // Posicionar todos os root nodes
  let totalRootWidth = rootNodes.reduce((sum, node) => {
    return sum + getSubtreeWidth(node.id) + horizontalSpacing
  }, -horizontalSpacing)
  
  let currentX = -totalRootWidth / 2 + nodeWidth / 2
  
  rootNodes.forEach(root => {
    const rootWidth = getSubtreeWidth(root.id)
    const rootX = currentX + rootWidth / 2 - nodeWidth / 2
    positionNode(root.id, rootX, 50)
    currentX += rootWidth + horizontalSpacing
  })
  
  return positions
}

// =====================================================
// SITE ASSIGNMENTS
// =====================================================

export const getAssignmentsBySite = async (siteId: string): Promise<SiteScriptAssignment[]> => {
  const { data, error } = await supabase
    .from('site_script_assignments')
    .select(`
      *,
      script:whatsapp_scripts(
        *,
        category:categories(id, name, color),
        messages:script_messages(*)
      )
    `)
    .eq('site_id', siteId)

  if (error) {
    console.error('Erro ao buscar atribuições:', error)
    throw new Error('Erro ao carregar atribuições')
  }

  return data || []
}

export const getAssignmentsByScript = async (scriptId: string): Promise<SiteScriptAssignment[]> => {
  const { data, error } = await supabase
    .from('site_script_assignments')
    .select('*')
    .eq('script_id', scriptId)

  if (error) {
    console.error('Erro ao buscar atribuições:', error)
    throw new Error('Erro ao carregar atribuições')
  }

  return data || []
}

export const assignScriptToSite = async (
  assignmentData: CreateSiteScriptAssignmentData
): Promise<SiteScriptAssignment> => {
  const { data, error } = await supabase
    .from('site_script_assignments')
    .insert({
      ...assignmentData,
      custom_values: assignmentData.custom_values || {},
      sent_messages: []
    })
    .select(`
      *,
      script:whatsapp_scripts(
        *,
        category:categories(id, name, color),
        messages:script_messages(*)
      )
    `)
    .single()

  if (error) {
    console.error('Erro ao atribuir script:', error)
    throw new Error('Erro ao atribuir script ao site')
  }

  return data
}

export const updateAssignment = async (
  assignmentData: UpdateSiteScriptAssignmentData
): Promise<SiteScriptAssignment> => {
  const { id, ...updateData } = assignmentData

  const { data, error } = await supabase
    .from('site_script_assignments')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      script:whatsapp_scripts(
        *,
        category:categories(id, name, color),
        messages:script_messages(*)
      )
    `)
    .single()

  if (error) {
    console.error('Erro ao atualizar atribuição:', error)
    throw new Error('Erro ao atualizar atribuição')
  }

  return data
}

export const removeAssignment = async (assignmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('site_script_assignments')
    .delete()
    .eq('id', assignmentId)

  if (error) {
    console.error('Erro ao remover atribuição:', error)
    throw new Error('Erro ao remover atribuição')
  }
}

export const markMessageAsSent = async (
  assignmentId: string,
  messageId: string
): Promise<SiteScriptAssignment> => {
  // Buscar assignment atual
  const { data: current, error: fetchError } = await supabase
    .from('site_script_assignments')
    .select('sent_messages')
    .eq('id', assignmentId)
    .single()

  if (fetchError) {
    throw new Error('Erro ao buscar atribuição')
  }

  const sentMessages: SentMessageRecord[] = current?.sent_messages || []
  
  // Adicionar novo registro
  sentMessages.push({
    message_id: messageId,
    sent_at: new Date().toISOString(),
    status: 'sent'
  })

  return updateAssignment({
    id: assignmentId,
    sent_messages: sentMessages
  })
}

// =====================================================
// TEMPLATE VARIABLES
// =====================================================

export const replaceTemplateVariables = (
  content: string,
  variables: TemplateVariables
): string => {
  let result = content

  // Substituir variáveis padrão
  const standardVars: Record<string, keyof TemplateVariables> = {
    '{{nome_empresa}}': 'nome_empresa',
    '{{nome_contato}}': 'nome_contato',
    '{{cidade}}': 'cidade',
    '{{segmento}}': 'segmento',
    '{{link_proposta}}': 'link_proposta'
  }

  for (const [placeholder, key] of Object.entries(standardVars)) {
    if (variables[key]) {
      result = result.replace(new RegExp(placeholder, 'g'), variables[key]!)
    }
  }

  // Substituir variáveis customizadas
  for (const [key, value] of Object.entries(variables)) {
    if (value && !Object.values(standardVars).includes(key as keyof TemplateVariables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
  }

  return result
}

export const extractVariablesFromContent = (content: string): string[] => {
  const regex = /{{([^}]+)}}/g
  const matches: string[] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    if (!matches.includes(match[1])) {
      matches.push(match[1])
    }
  }

  return matches
}

export const getScriptVariables = async (scriptId: string): Promise<string[]> => {
  const messages = await getMessagesByScript(scriptId)
  const allVariables: string[] = []

  for (const message of messages) {
    if (message.content) {
      const vars = extractVariablesFromContent(message.content)
      for (const v of vars) {
        if (!allVariables.includes(v)) {
          allVariables.push(v)
        }
      }
    }
  }

  return allVariables
}

// =====================================================
// ESTATÍSTICAS
// =====================================================

export const getScriptStats = async (): Promise<ScriptStats> => {
  try {
    const [scripts, assignments] = await Promise.all([
      getScripts(),
      supabase.from('site_script_assignments').select('script_id')
    ])

    const templates = scripts.filter(s => s.is_template)

    // Contar uso de cada script
    const usageCount: Record<string, number> = {}
    for (const assignment of assignments.data || []) {
      usageCount[assignment.script_id] = (usageCount[assignment.script_id] || 0) + 1
    }

    // Top scripts mais usados
    const mostUsed = Object.entries(usageCount)
      .map(([scriptId, count]) => {
        const script = scripts.find(s => s.id === scriptId)
        return {
          script_id: scriptId,
          script_name: script?.name || 'Script removido',
          usage_count: count
        }
      })
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5)

    // Scripts por categoria
    const categoryCount: Record<string, { name: string; color: string; count: number }> = {}
    for (const script of scripts) {
      const catName = script.category?.name || 'Sem categoria'
      const catColor = script.category?.color || '#6366F1'
      if (!categoryCount[catName]) {
        categoryCount[catName] = { name: catName, color: catColor, count: 0 }
      }
      categoryCount[catName].count++
    }

    return {
      total_scripts: scripts.length,
      total_templates: templates.length,
      total_assignments: assignments.data?.length || 0,
      most_used_scripts: mostUsed,
      scripts_by_category: Object.values(categoryCount).sort((a, b) => b.count - a.count)
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    throw new Error('Erro ao carregar estatísticas')
  }
}

// =====================================================
// IMAGE UPLOAD
// =====================================================

export const uploadScriptImage = async (file: File): Promise<string> => {
  // Validar tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.')
  }

  // Validar tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Tamanho máximo: 5MB')
  }

  // Gerar nome único para o arquivo
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
  const fileName = `script-${timestamp}-${randomString}.${extension}`

  // Upload para o Supabase Storage
  const { data, error } = await supabase.storage
    .from('script-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Erro ao fazer upload:', error)
    throw new Error('Erro ao fazer upload da imagem')
  }

  // Retornar URL pública
  const { data: urlData } = supabase.storage
    .from('script-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export const deleteScriptImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extrair o nome do arquivo da URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    if (!fileName) return

    const { error } = await supabase.storage
      .from('script-images')
      .remove([fileName])

    if (error) {
      console.error('Erro ao deletar imagem:', error)
    }
  } catch (err) {
    console.error('Erro ao processar URL da imagem:', err)
  }
}

// =====================================================
// WHATSAPP HELPERS
// =====================================================

export const generateWhatsAppLink = (
  phone: string,
  message: string
): string => {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`
}

export const openWhatsAppWithMessage = (
  phone: string,
  message: ScriptMessage,
  variables: TemplateVariables
): void => {
  if (!phone || !message.content) return

  const processedContent = replaceTemplateVariables(message.content, variables)
  const link = generateWhatsAppLink(phone, processedContent)
  window.open(link, '_blank')
}
