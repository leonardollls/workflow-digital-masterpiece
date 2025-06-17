export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calculator_data: {
        Row: {
          calculation_name: string | null
          created_at: string | null
          data: Json
          id: string
          tool_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calculation_name?: string | null
          created_at?: string | null
          data: Json
          id?: string
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calculation_name?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculator_data_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculator_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculator_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_briefings: {
        Row: {
          additional_notes: string | null
          analytics_tracking: string | null
          brand_colors: string | null
          budget: string | null
          business_segment: string
          call_to_action: string
          company_description: string
          company_name: string
          competitive_advantage: string
          content_materials: string | null
          created_at: string | null
          current_website: string | null
          deadline: string
          domain_info: string
          guarantees: string | null
          has_logo: string
          id: string
          integrations: string | null
          landing_page_goal: string
          landing_page_sections: string | null
          lead_destination: string
          logo_files: string[] | null
          main_benefits: string
          material_files: string[] | null
          number_of_offers: string | null
          offer_details: string | null
          price_range: string | null
          pricing_model: string | null
          product_description: string
          product_name: string
          proposal_date: string | null
          proposal_value: number | null
          responsible_name: string
          specific_requirements: string | null
          start_date: string | null
          target_audience: string
          updated_at: string | null
          visual_files: string[] | null
          visual_references: string | null
        }
        Insert: {
          additional_notes?: string | null
          analytics_tracking?: string | null
          brand_colors?: string | null
          budget?: string | null
          business_segment: string
          call_to_action: string
          company_description: string
          company_name: string
          competitive_advantage: string
          content_materials?: string | null
          created_at?: string | null
          current_website?: string | null
          deadline: string
          domain_info: string
          guarantees?: string | null
          has_logo: string
          id?: string
          integrations?: string | null
          landing_page_goal: string
          landing_page_sections?: string | null
          lead_destination: string
          logo_files?: string[] | null
          main_benefits: string
          material_files?: string[] | null
          number_of_offers?: string | null
          offer_details?: string | null
          price_range?: string | null
          pricing_model?: string | null
          product_description: string
          product_name: string
          proposal_date?: string | null
          proposal_value?: number | null
          responsible_name: string
          specific_requirements?: string | null
          start_date?: string | null
          target_audience: string
          updated_at?: string | null
          visual_files?: string[] | null
          visual_references?: string | null
        }
        Update: {
          additional_notes?: string | null
          analytics_tracking?: string | null
          brand_colors?: string | null
          budget?: string | null
          business_segment?: string
          call_to_action?: string
          company_description?: string
          company_name?: string
          competitive_advantage?: string
          content_materials?: string | null
          created_at?: string | null
          current_website?: string | null
          deadline?: string
          domain_info?: string
          guarantees?: string | null
          has_logo?: string
          id?: string
          integrations?: string | null
          landing_page_goal?: string
          landing_page_sections?: string | null
          lead_destination?: string
          logo_files?: string[] | null
          main_benefits?: string
          material_files?: string[] | null
          number_of_offers?: string | null
          offer_details?: string | null
          price_range?: string | null
          pricing_model?: string | null
          product_description?: string
          product_name?: string
          proposal_date?: string | null
          proposal_value?: number | null
          responsible_name?: string
          specific_requirements?: string | null
          start_date?: string | null
          target_audience?: string
          updated_at?: string | null
          visual_files?: string[] | null
          visual_references?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          created_at: string | null
          description: string
          href: string
          icon: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          href: string
          icon: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          href?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string | null
          id: string
          last_used: string | null
          progress: number | null
          tool_id: string | null
          total_uses: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          progress?: number | null
          tool_id?: string | null
          total_uses?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          progress?: number | null
          tool_id?: string | null
          total_uses?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          membership_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          membership_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          membership_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      category_progress: {
        Row: {
          active_users: number | null
          avg_progress: number | null
          category: string | null
          total_uses: number | null
        }
        Relationships: []
      }
      daily_activity: {
        Row: {
          active_users: number | null
          activity_date: string | null
          avg_progress: number | null
          tool_interactions: number | null
        }
        Relationships: []
      }
      tool_usage_stats: {
        Row: {
          avg_progress: number | null
          category: string | null
          last_used: string | null
          title: string | null
          total_users: number | null
          total_uses: number | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          avg_progress: number | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          last_activity: string | null
          membership_type: string | null
          tools_accessed: number | null
          total_tool_uses: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_briefings_by_period: {
        Args: { period_days?: number }
        Returns: number
      }
      create_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_public_url: {
        Args: { bucket_name: string; file_path: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Tipo específico para client_briefings
export type ClientBriefingRow = Tables<'client_briefings'>
export type ClientBriefingInsert = TablesInsert<'client_briefings'>
export type ClientBriefingUpdate = TablesUpdate<'client_briefings'> 