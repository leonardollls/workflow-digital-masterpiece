import { supabase } from '@/lib/supabase'
import type { 
  State, 
  City, 
  Category, 
  CaptationSite, 
  CaptationStats, 
  CreateCaptationSiteData, 
  UpdateCaptationSiteData,
  Tag,
  StatusHistoryEntry,
  ProposalStatus
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

// Exclusão em massa de sites
export const bulkDeleteSites = async (siteIds: string[]): Promise<number> => {
  if (siteIds.length === 0) return 0

  // Primeiro, excluir os registros da tabela de histórico
  await supabase
    .from('captation_status_history')
    .delete()
    .in('site_id', siteIds)

  // Excluir registros da tabela de tags
  await supabase
    .from('captation_site_tags')
    .delete()
    .in('site_id', siteIds)

  // Por fim, excluir os sites
  const { data, error } = await supabase
    .from('captation_sites')
    .delete()
    .in('id', siteIds)
    .select('id')

  if (error) {
    console.error('Erro ao deletar sites em massa:', error)
    throw new Error('Erro ao deletar sites em massa')
  }

  return data?.length || 0
}

// Atualização em massa de status
export const bulkUpdateStatus = async (
  siteIds: string[], 
  newStatus: 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid' | 'contact_no_site',
  serviceValue?: number
): Promise<number> => {
  const updateData: { proposal_status: string; service_value?: number } = {
    proposal_status: newStatus
  }
  
  if (newStatus === 'paid' && serviceValue !== undefined) {
    updateData.service_value = serviceValue
  }

  const { data, error } = await supabase
    .from('captation_sites')
    .update(updateData)
    .in('id', siteIds)
    .select('id')

  if (error) {
    console.error('Erro ao atualizar status em massa:', error)
    throw new Error('Erro ao atualizar status em massa')
  }

  return data?.length || 0
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
    const contact_no_site_proposals = filteredSites.filter(s => s.proposal_status === 'contact_no_site').length
    
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
      contact_no_site_proposals,
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

// ============ TAGS ============

export const getTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) {
    console.error('Erro ao buscar tags:', error)
    throw new Error('Erro ao carregar tags')
  }

  return data || []
}

export const createTag = async (name: string, color: string = '#6366F1'): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, color })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar tag:', error)
    throw new Error('Erro ao criar tag')
  }

  return data
}

export const updateTag = async (id: string, name: string, color: string): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .update({ name, color })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar tag:', error)
    throw new Error('Erro ao atualizar tag')
  }

  return data
}

export const deleteTag = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar tag:', error)
    throw new Error('Erro ao deletar tag')
  }
}

export const getSiteTagIds = async (siteId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('captation_site_tags')
    .select('tag_id')
    .eq('site_id', siteId)

  if (error) {
    console.error('Erro ao buscar tags do site:', error)
    return []
  }

  return data?.map(row => row.tag_id) || []
}

export const updateSiteTags = async (siteId: string, tagIds: string[]): Promise<void> => {
  // Remover todas as tags existentes
  await supabase
    .from('captation_site_tags')
    .delete()
    .eq('site_id', siteId)

  // Adicionar novas tags
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('captation_site_tags')
      .insert(tagIds.map(tagId => ({ site_id: siteId, tag_id: tagId })))

    if (error) {
      console.error('Erro ao atualizar tags do site:', error)
      throw new Error('Erro ao atualizar tags')
    }
  }
}

// ============ HISTÓRICO DE STATUS ============

export const getStatusHistory = async (siteId: string): Promise<StatusHistoryEntry[]> => {
  const { data, error } = await supabase
    .from('captation_status_history')
    .select('*')
    .eq('site_id', siteId)
    .order('changed_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }

  return data || []
}

export const addStatusHistory = async (
  siteId: string, 
  oldStatus: ProposalStatus | null, 
  newStatus: ProposalStatus,
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('captation_status_history')
    .insert({
      site_id: siteId,
      old_status: oldStatus,
      new_status: newStatus,
      notes
    })

  if (error) {
    console.error('Erro ao adicionar histórico:', error)
  }
}

// Atualizar contato realizado
export const updateLastContact = async (siteId: string): Promise<void> => {
  const { error } = await supabase
    .from('captation_sites')
    .update({ last_contact_date: new Date().toISOString() })
    .eq('id', siteId)

  if (error) {
    console.error('Erro ao atualizar último contato:', error)
  }
} 