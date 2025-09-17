import { supabase } from '@/lib/supabase'
import type { 
  State, 
  City, 
  Category, 
  CaptationSite, 
  CaptationStats, 
  CreateCaptationSiteData, 
  UpdateCaptationSiteData 
} from '@/types/captation'

// Estados
export const getStates = async (): Promise<State[]> => {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name')

  if (error) {
    console.error('Erro ao buscar estados:', error)
    throw new Error('Erro ao carregar estados')
  }

  return data || []
}

// Cidades
export const getCities = async (stateId?: string): Promise<City[]> => {
  let query = supabase
    .from('cities')
    .select(`
      *,
      state:states(*)
    `)
    .order('population', { ascending: false })

  if (stateId) {
    query = query.eq('state_id', stateId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar cidades:', error)
    throw new Error('Erro ao carregar cidades')
  }

  return data || []
}

export const getCitiesByState = async (stateId: string): Promise<City[]> => {
  // Primeiro tenta carregar do Supabase
  let supaCities = await getCities(stateId)

  // Se só houver 0 ou 1 cidade (normalmente apenas "Não identificada"), importar do IBGE
  if (supaCities.length <= 1) {
    try {
      // Buscar UF para obter sigla e nome
      const state = await getStateById(stateId)
      if (!state) return supaCities

      // Endpoint IBGE que devolve municípios do estado pela sigla
      const ibgeUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.abbreviation}/municipios`
      const response = await fetch(ibgeUrl)
      if (!response.ok) throw new Error('Falha ao buscar cidades no IBGE')
      const ibgeCities: Array<{ id: number; nome: string; }> = await response.json()

      // Preparar objetos para inserção, evitando duplicados
      const rows = ibgeCities.map((city) => ({
        id: crypto.randomUUID(),
        name: city.nome,
        state_id: stateId,
        population: null as number | null
      }))

      // Inserir em lotes de 1000 para evitar limite do Supabase
      const chunkSize = 1000
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        await supabase.from('cities').insert(chunk, { ignoreDuplicates: true })
      }

      // Recarregar cidades do Supabase
      supaCities = await getCities(stateId)
    } catch (error) {
      console.error('Erro ao importar cidades do IBGE:', error)
    }
  }

  return supaCities
}

// Utilitário para obter UF por id
export const getStateById = async (stateId: string): Promise<State | null> => {
  const { data, error } = await supabase.from('states').select('*').eq('id', stateId).single()
  if (error) {
    console.error('Erro ao buscar estado:', error)
    return null
  }
  return data
}

// Categorias
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    throw new Error('Erro ao carregar categorias')
  }

  return data || []
}

export const createCategory = async (name: string, description?: string, color?: string): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      description,
      color: color || '#6366F1'
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar categoria:', error)
    throw new Error('Erro ao criar categoria')
  }

  return data
}

// Sites de Captação
export const getCaptationSites = async (filters?: {
  stateId?: string
  cityId?: string
  categoryId?: string
  status?: string
}): Promise<CaptationSite[]> => {
  let query = supabase
    .from('captation_sites')
    .select(`
      *,
      city:cities(
        *,
        state:states(*)
      ),
      category:categories(*)
    `)
    .order('created_at', { ascending: false })

  if (filters?.cityId) {
    query = query.eq('city_id', filters.cityId)
  }

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.status) {
    query = query.eq('proposal_status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar sites de captação:', error)
    throw new Error('Erro ao carregar sites de captação')
  }

  let sites = data || []

  // Filtrar por estado se especificado
  if (filters?.stateId) {
    sites = sites.filter(site => site.city?.state?.id === filters.stateId)
  }

  return sites
}

export const createCaptationSite = async (siteData: CreateCaptationSiteData): Promise<CaptationSite> => {
  const { data, error } = await supabase
    .from('captation_sites')
    .insert({
      ...siteData,
      proposal_status: siteData.proposal_status || 'pending'
    })
    .select(`
      *,
      city:cities(
        *,
        state:states(*)
      ),
      category:categories(*)
    `)
    .single()

  if (error) {
    console.error('Erro ao criar site de captação:', error)
    throw new Error('Erro ao criar site de captação')
  }

  return data
}

export const updateCaptationSite = async (siteData: UpdateCaptationSiteData): Promise<CaptationSite> => {
  const { id, ...updateData } = siteData
  
  const { data, error } = await supabase
    .from('captation_sites')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      city:cities(
        *,
        state:states(*)
      ),
      category:categories(*)
    `)
    .single()

  if (error) {
    console.error('Erro ao atualizar site de captação:', error)
    throw new Error('Erro ao atualizar site de captação')
  }

  return data
}

export const deleteCaptationSite = async (siteId: string): Promise<void> => {
  const { error } = await supabase
    .from('captation_sites')
    .delete()
    .eq('id', siteId)

  if (error) {
    console.error('Erro ao deletar site de captação:', error)
    throw new Error('Erro ao deletar site de captação')
  }
}

// Estatísticas
export const getCaptationStats = async (filters?: {
  stateId?: string
  categoryId?: string
}): Promise<CaptationStats> => {
  try {
    let query = supabase
      .from('captation_sites')
      .select(`
        *,
        city:cities(
          *,
          state:states(*)
        ),
        category:categories(*)
      `)

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    const { data: sites, error } = await query

    if (error) {
      throw error
    }

    let filteredSites = sites || []

    // Filtrar por estado se especificado
    if (filters?.stateId) {
      filteredSites = filteredSites.filter(site => site.city?.state?.id === filters.stateId)
    }

    const total_sites = filteredSites.length
    const pending_proposals = filteredSites.filter(s => s.proposal_status === 'pending').length
    const to_send_proposals = filteredSites.filter(s => s.proposal_status === 'to_send').length
    const accepted_proposals = filteredSites.filter(s => s.proposal_status === 'accepted').length
    const rejected_proposals = filteredSites.filter(s => s.proposal_status === 'rejected').length
    const in_progress_proposals = filteredSites.filter(s => s.proposal_status === 'in_progress').length
    const paid_proposals = filteredSites.filter(s => s.proposal_status === 'paid').length
    
    // Calcular valor total dos projetos pagos
    const total_paid_value = filteredSites
      .filter(s => s.proposal_status === 'paid' && s.service_value)
      .reduce((sum, site) => sum + (site.service_value || 0), 0)
    
    const conversion_rate = total_sites > 0 ? (accepted_proposals / total_sites) * 100 : 0

    // Agrupar por categoria
    const categoryCounts = filteredSites.reduce((acc, site) => {
      const categoryName = site.category?.name || 'Sem categoria'
      const categoryColor = site.category?.color || '#6366F1'
      
      if (!acc[categoryName]) {
        acc[categoryName] = { category_name: categoryName, category_color: categoryColor, count: 0 }
      }
      acc[categoryName].count++
      return acc
    }, {} as Record<string, { category_name: string; category_color: string; count: number }>)

    // Agrupar por cidade
    const cityCounts = filteredSites.reduce((acc, site) => {
      const cityName = site.city?.name || 'Sem cidade'
      
      if (!acc[cityName]) {
        acc[cityName] = { city_name: cityName, count: 0 }
      }
      acc[cityName].count++
      return acc
    }, {} as Record<string, { city_name: string; count: number }>)

    return {
      total_sites,
      pending_proposals,
      to_send_proposals,
      accepted_proposals,
      rejected_proposals,
      in_progress_proposals,
      paid_proposals,
      total_paid_value,
      conversion_rate,
      sites_by_category: Object.values(categoryCounts).sort((a, b) => b.count - a.count),
      sites_by_city: Object.values(cityCounts).sort((a, b) => b.count - a.count).slice(0, 10) // Top 10 cidades
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    throw new Error('Erro ao carregar estatísticas')
  }
} 