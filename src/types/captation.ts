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
  created_at?: string
  updated_at?: string
}

export type ProposalStatus = 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid'

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
  created_at?: string
  updated_at?: string
}

export interface CaptationStats {
  total_sites: number
  pending_proposals: number
  to_send_proposals: number
  accepted_proposals: number
  rejected_proposals: number
  in_progress_proposals: number
  paid_proposals: number
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
}

export interface UpdateCaptationSiteData extends Partial<CreateCaptationSiteData> {
  id: string
} 