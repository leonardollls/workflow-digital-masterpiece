export interface State {
  id: string
  name: string
  abbreviation: string
  created_at?: string
  updated_at?: string
}

export interface City {
  id: string
  name: string
  state_id: string
  state?: State
  population?: number
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  whatsapp_template?: string
  created_at?: string
  updated_at?: string
}

export type ProposalStatus = 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid' | 'contact_no_site'

export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type SortField = 'created_at' | 'company_name' | 'google_rating' | 'proposal_status' | 'next_contact_date'
export type SortOrder = 'asc' | 'desc'

export interface CaptationSite {
  id: string
  company_name: string
  website_url?: string
  city_id: string
  city?: City
  category_id: string
  category?: Category
  contact_link?: string
  proposal_link?: string
  proposal_status: ProposalStatus
  service_value?: number
  notes?: string
  contact_person?: string
  phone?: string
  email?: string
  google_rating?: number
  google_reviews_count?: number
  google_maps_url?: string
  // Novos campos Fase 2/3/5
  next_contact_date?: string
  last_contact_date?: string
  status_changed_at?: string
  source?: 'manual' | 'import'
  priority?: Priority
  is_archived?: boolean
  tags?: Tag[]
  created_at?: string
  updated_at?: string
}

export interface Tag {
  id: string
  name: string
  color: string
  created_at?: string
}

export interface StatusHistoryEntry {
  id: string
  site_id: string
  old_status?: ProposalStatus
  new_status: ProposalStatus
  changed_at: string
  notes?: string
}

export interface CaptationStats {
  total_sites: number
  pending_proposals: number
  to_send_proposals: number
  accepted_proposals: number
  rejected_proposals: number
  in_progress_proposals: number
  paid_proposals: number
  contact_no_site_proposals: number
  total_paid_value: number
  conversion_rate: number
  sites_by_category: Array<{
    category_name: string
    category_color: string
    count: number
  }>
  sites_by_city: Array<{
    city_name: string
    count: number
  }>
}

export interface CreateCaptationSiteData {
  company_name: string
  website_url?: string
  city_id: string
  category_id: string
  contact_link?: string
  proposal_link?: string
  proposal_status?: ProposalStatus
  service_value?: number
  notes?: string
  contact_person?: string
  phone?: string
  email?: string
  google_rating?: number
  google_reviews_count?: number
  google_maps_url?: string
  next_contact_date?: string
  last_contact_date?: string
  source?: 'manual' | 'import'
  priority?: Priority
  is_archived?: boolean
}

export interface UpdateCaptationSiteData extends Partial<CreateCaptationSiteData> {
  id: string
}

export interface CaptationFilters {
  stateId?: string
  cityId?: string
  categoryId?: string
  status?: ProposalStatus | 'all'
  priority?: Priority | 'all'
  isArchived?: boolean
  tagIds?: string[]
  search?: string
  sortField?: SortField
  sortOrder?: SortOrder
  page?: number
  limit?: number
} 