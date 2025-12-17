import { supabase } from '@/lib/supabase'
import type { State, City, Category, CaptationSite, CreateCaptationSiteData } from '@/types/captation'

// Interface para o formato JSON do Google Maps
export interface GoogleMapsEntry {
  name: string
  category: string
  address: string
  phone?: string
  phoneUnformatted?: string
  website?: string
  rating?: number
  reviewsCount?: number
  url?: string
  scrapedAt?: string
}

// Interface para resultado do parsing de endereço
export interface ParsedAddress {
  city: string
  state: string
  stateAbbreviation: string
  fullAddress: string
}

// Interface para resultado da importação
export interface ImportResult {
  success: number
  duplicates: number
  errors: number
  errorMessages: string[]
  importedSites: CaptationSite[]
}

// Interface para item de preview
export interface PreviewItem {
  original: GoogleMapsEntry
  parsed: {
    companyName: string
    phone: string
    website: string
    contactLink: string
    category: string
    city: string
    state: string
    notes: string
    googleRating?: number
    googleReviewsCount?: number
    googleMapsUrl?: string
  }
  isDuplicate: boolean
  error?: string
}

/**
 * Valida se o JSON está no formato esperado do Google Maps
 */
export const validateGoogleMapsJson = (data: unknown): data is GoogleMapsEntry[] => {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return false
  
  // Verificar se pelo menos o primeiro item tem os campos obrigatórios
  const firstItem = data[0]
  return (
    typeof firstItem === 'object' &&
    firstItem !== null &&
    'name' in firstItem &&
    typeof firstItem.name === 'string'
  )
}

/**
 * Extrai cidade e estado de um endereço brasileiro
 * Formato esperado: "Rua X, 123 - Bairro, Cidade - UF, CEP"
 */
export const extractCityAndState = (address: string): ParsedAddress | null => {
  if (!address) return null
  
  // Padrão 1: "Cidade - UF, CEP" ou "Cidade - UF"
  const pattern1 = /,\s*([^,]+?)\s*-\s*([A-Z]{2})(?:,\s*\d{5}-?\d{3})?$/i
  const match1 = address.match(pattern1)
  
  if (match1) {
    return {
      city: match1[1].trim(),
      state: getStateName(match1[2].toUpperCase()),
      stateAbbreviation: match1[2].toUpperCase(),
      fullAddress: address
    }
  }
  
  // Padrão 2: "Cidade/UF" ou "Cidade / UF"
  const pattern2 = /,\s*([^,/]+?)\s*\/\s*([A-Z]{2})(?:,\s*\d{5}-?\d{3})?$/i
  const match2 = address.match(pattern2)
  
  if (match2) {
    return {
      city: match2[1].trim(),
      state: getStateName(match2[2].toUpperCase()),
      stateAbbreviation: match2[2].toUpperCase(),
      fullAddress: address
    }
  }
  
  // Padrão 3: Tentar encontrar UF em qualquer posição
  const statePattern = /\b([A-Z]{2})\b/g
  const validStates = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
  
  let foundState: string | null = null
  let match
  while ((match = statePattern.exec(address)) !== null) {
    if (validStates.includes(match[1])) {
      foundState = match[1]
    }
  }
  
  if (foundState) {
    // Tentar extrair cidade antes do estado
    const cityPattern = new RegExp(`([^,-]+?)\\s*[-,]?\\s*${foundState}`, 'i')
    const cityMatch = address.match(cityPattern)
    
    if (cityMatch) {
      return {
        city: cityMatch[1].trim().replace(/^[-,\s]+|[-,\s]+$/g, ''),
        state: getStateName(foundState),
        stateAbbreviation: foundState,
        fullAddress: address
      }
    }
  }
  
  return null
}

/**
 * Converte sigla do estado para nome completo
 */
const getStateName = (abbreviation: string): string => {
  const stateNames: Record<string, string> = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
    'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
  }
  return stateNames[abbreviation] || abbreviation
}

/**
 * Detecta se é um link de WhatsApp
 */
export const isWhatsAppLink = (url: string): boolean => {
  if (!url) return false
  return url.includes('wa.me') || url.includes('whatsapp.com') || url.includes('api.whatsapp.com')
}

/**
 * Formata telefone brasileiro para o formato 55XXXXXXXXXXX (apenas números com código do país)
 * Exemplo: "5554999226134"
 */
export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return ''
  
  // Remove tudo que não é número
  let numbers = phone.replace(/\D/g, '')
  
  // Se não tem números, retorna vazio
  if (!numbers) return ''
  
  // Se já começa com 55 e tem 12 ou 13 dígitos, está no formato correto
  if (numbers.startsWith('55')) {
    if (numbers.length === 13 || numbers.length === 12) {
      return numbers
    }
    // Remove o 55 para reprocessar se o formato estiver incorreto
    numbers = numbers.slice(2)
  }
  
  // Remove zero inicial (comum em números brasileiros: 054... -> 54...)
  if (numbers.startsWith('0')) {
    numbers = numbers.slice(1)
  }
  
  // Telefone com 11 dígitos (DDD + 9 dígitos) - celular
  if (numbers.length === 11) {
    return `55${numbers}`
  }
  
  // Telefone com 10 dígitos (DDD + 8 dígitos) - fixo
  if (numbers.length === 10) {
    return `55${numbers}`
  }
  
  // Telefone com 9 dígitos (sem DDD, só celular) - não podemos adicionar DDD
  // Retorna apenas os números disponíveis
  if (numbers.length === 9) {
    return numbers
  }
  
  // Telefone com 8 dígitos (sem DDD, fixo ou celular antigo)
  if (numbers.length === 8) {
    return numbers
  }
  
  // Para outros formatos, retorna apenas os números
  return numbers
}

/**
 * Busca ou cria categoria
 */
export const findOrCreateCategory = async (categoryName: string): Promise<Category | null> => {
  if (!categoryName) return null
  
  // Normalizar nome da categoria
  const normalizedName = categoryName.trim()
  
  // Buscar categoria existente (case-insensitive)
  const { data: existing, error: searchError } = await supabase
    .from('categories')
    .select('*')
    .ilike('name', normalizedName)
    .limit(1)
  
  if (searchError) {
    console.error('Erro ao buscar categoria:', searchError)
    return null
  }
  
  if (existing && existing.length > 0) {
    return existing[0]
  }
  
  // Criar nova categoria com cor aleatória
  const colors = ['#8B4513', '#DC2626', '#059669', '#0891B2', '#7C3AED', '#EA580C', '#DB2777', '#2563EB', '#16A34A', '#EC4899']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  
  const { data: newCategory, error: createError } = await supabase
    .from('categories')
    .insert({
      name: normalizedName,
      description: `Categoria criada automaticamente via importação`,
      color: randomColor
    })
    .select()
    .single()
  
  if (createError) {
    console.error('Erro ao criar categoria:', createError)
    return null
  }
  
  return newCategory
}

/**
 * Busca estado por sigla
 */
export const findStateByAbbreviation = async (abbreviation: string): Promise<State | null> => {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('abbreviation', abbreviation.toUpperCase())
    .single()
  
  if (error || !data) return null
  return data
}

/**
 * Busca ou cria cidade
 */
export const findOrCreateCity = async (cityName: string, stateId: string): Promise<City | null> => {
  if (!cityName || !stateId) return null
  
  const normalizedName = cityName.trim()
  
  // Buscar cidade existente
  const { data: existing, error: searchError } = await supabase
    .from('cities')
    .select('*, state:states(*)')
    .eq('state_id', stateId)
    .ilike('name', normalizedName)
    .limit(1)
  
  if (searchError) {
    console.error('Erro ao buscar cidade:', searchError)
    return null
  }
  
  if (existing && existing.length > 0) {
    return existing[0]
  }
  
  // Criar nova cidade
  const { data: newCity, error: createError } = await supabase
    .from('cities')
    .insert({
      name: normalizedName,
      state_id: stateId,
      population: null
    })
    .select('*, state:states(*)')
    .single()
  
  if (createError) {
    console.error('Erro ao criar cidade:', createError)
    return null
  }
  
  return newCity
}

/**
 * Verifica se estabelecimento já existe (duplicata)
 */
export const checkDuplicate = async (
  companyName: string, 
  cityId: string, 
  phone?: string
): Promise<boolean> => {
  // Verificar por nome + cidade
  const { data: byName, error: nameError } = await supabase
    .from('captation_sites')
    .select('id')
    .eq('city_id', cityId)
    .ilike('company_name', companyName.trim())
    .limit(1)
  
  if (!nameError && byName && byName.length > 0) {
    return true
  }
  
  // Se tiver telefone, verificar também
  if (phone) {
    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length >= 10) {
      const { data: byPhone, error: phoneError } = await supabase
        .from('captation_sites')
        .select('id')
        .eq('city_id', cityId)
        .or(`phone.ilike.%${normalizedPhone.slice(-8)}%`)
        .limit(1)
      
      if (!phoneError && byPhone && byPhone.length > 0) {
        return true
      }
    }
  }
  
  return false
}

/**
 * Gera notas a partir dos dados do Google Maps (apenas data de coleta)
 */
export const generateNotes = (entry: GoogleMapsEntry): string => {
  if (entry.scrapedAt) {
    const date = new Date(entry.scrapedAt).toLocaleDateString('pt-BR')
    return `Coletado em: ${date}`
  }
  return ''
}

/**
 * Processa arquivo JSON e retorna preview dos dados
 */
export const parseGoogleMapsJson = async (
  jsonData: GoogleMapsEntry[],
  defaultStateId?: string
): Promise<PreviewItem[]> => {
  const previews: PreviewItem[] = []
  
  // Criar cache de estados para evitar múltiplas queries
  const { data: states } = await supabase.from('states').select('*')
  const stateMap = new Map(states?.map(s => [s.abbreviation, s]) || [])
  
  for (const entry of jsonData) {
    const preview: PreviewItem = {
      original: entry,
      parsed: {
        companyName: entry.name || '',
        phone: formatPhone(entry.phoneUnformatted || entry.phone),
        website: '',
        contactLink: '',
        category: entry.category || '',
        city: '',
        state: '',
        notes: generateNotes(entry),
        googleRating: entry.rating,
        googleReviewsCount: entry.reviewsCount,
        googleMapsUrl: entry.url
      },
      isDuplicate: false,
      error: undefined
    }
    
    // Processar website/contact link
    if (entry.website) {
      if (isWhatsAppLink(entry.website)) {
        preview.parsed.contactLink = entry.website
      } else {
        preview.parsed.website = entry.website
      }
    }
    
    // Extrair cidade e estado do endereço
    const parsedAddress = extractCityAndState(entry.address)
    if (parsedAddress) {
      preview.parsed.city = parsedAddress.city
      preview.parsed.state = parsedAddress.stateAbbreviation
    } else if (defaultStateId) {
      // Usar estado padrão se não conseguir extrair
      const defaultState = states?.find(s => s.id === defaultStateId)
      if (defaultState) {
        preview.parsed.state = defaultState.abbreviation
        preview.parsed.city = 'Não identificada'
      }
    }
    
    // Verificar se temos dados mínimos
    if (!preview.parsed.companyName) {
      preview.error = 'Nome da empresa não encontrado'
    } else if (!preview.parsed.state) {
      preview.error = 'Estado não identificado no endereço'
    }
    
    previews.push(preview)
  }
  
  return previews
}

/**
 * Importa sites em massa
 */
export const bulkImportSites = async (
  items: PreviewItem[],
  defaultCategoryId?: string,
  onProgress?: (current: number, total: number) => void
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: 0,
    duplicates: 0,
    errors: 0,
    errorMessages: [],
    importedSites: []
  }
  
  // Filtrar itens válidos (sem erro e não duplicados)
  const validItems = items.filter(item => !item.error && !item.isDuplicate)
  const total = validItems.length
  
  // Processar em lotes de 50
  const batchSize = 50
  let processed = 0
  
  for (let i = 0; i < validItems.length; i += batchSize) {
    const batch = validItems.slice(i, i + batchSize)
    
    for (const item of batch) {
      try {
        // Buscar estado
        const state = await findStateByAbbreviation(item.parsed.state)
        if (!state) {
          result.errors++
          result.errorMessages.push(`${item.parsed.companyName}: Estado ${item.parsed.state} não encontrado`)
          continue
        }
        
        // Buscar ou criar cidade
        const city = await findOrCreateCity(item.parsed.city, state.id)
        if (!city) {
          result.errors++
          result.errorMessages.push(`${item.parsed.companyName}: Erro ao criar cidade ${item.parsed.city}`)
          continue
        }
        
        // Verificar duplicata
        const isDuplicate = await checkDuplicate(
          item.parsed.companyName,
          city.id,
          item.parsed.phone
        )
        
        if (isDuplicate) {
          result.duplicates++
          continue
        }
        
        // Buscar ou criar categoria
        let categoryId = defaultCategoryId
        if (item.parsed.category) {
          const category = await findOrCreateCategory(item.parsed.category)
          if (category) {
            categoryId = category.id
          }
        }
        
        if (!categoryId) {
          result.errors++
          result.errorMessages.push(`${item.parsed.companyName}: Categoria não definida`)
          continue
        }
        
        // Criar site
        const siteData: CreateCaptationSiteData = {
          company_name: item.parsed.companyName,
          city_id: city.id,
          category_id: categoryId,
          phone: item.parsed.phone || undefined,
          website_url: item.parsed.website || undefined,
          contact_link: item.parsed.contactLink || undefined,
          notes: item.parsed.notes || undefined,
          proposal_status: 'pending',
          google_rating: item.parsed.googleRating,
          google_reviews_count: item.parsed.googleReviewsCount,
          google_maps_url: item.parsed.googleMapsUrl
        }
        
        const { data: newSite, error: createError } = await supabase
          .from('captation_sites')
          .insert(siteData)
          .select(`
            *,
            city:cities(*, state:states(*)),
            category:categories(*)
          `)
          .single()
        
        if (createError) {
          result.errors++
          result.errorMessages.push(`${item.parsed.companyName}: ${createError.message}`)
          continue
        }
        
        result.success++
        result.importedSites.push(newSite)
        
      } catch (error) {
        result.errors++
        result.errorMessages.push(`${item.parsed.companyName}: Erro inesperado`)
      }
      
      processed++
      onProgress?.(processed, total)
    }
  }
  
  // Contabilizar duplicatas dos itens já marcados
  result.duplicates += items.filter(item => item.isDuplicate).length
  result.errors += items.filter(item => item.error).length
  
  return result
}

