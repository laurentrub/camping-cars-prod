export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bank_settings: {
        Row: {
          account_holder: string | null
          bank_name: string | null
          bic: string | null
          default_deposit_amount: number
          hold_days: number
          iban: string | null
          id: string
          instructions: string | null
          singleton: boolean
          updated_at: string
        }
        Insert: {
          account_holder?: string | null
          bank_name?: string | null
          bic?: string | null
          default_deposit_amount?: number
          hold_days?: number
          iban?: string | null
          id?: string
          instructions?: string | null
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          account_holder?: string | null
          bank_name?: string | null
          bic?: string | null
          default_deposit_amount?: number
          hold_days?: number
          iban?: string | null
          id?: string
          instructions?: string | null
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string | null
          preferred_contact: string | null
          status: Database["public"]["Enums"]["lead_status"]
          type: Database["public"]["Enums"]["lead_type"]
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone?: string | null
          preferred_contact?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          type?: Database["public"]["Enums"]["lead_type"]
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string | null
          preferred_contact?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          type?: Database["public"]["Enums"]["lead_type"]
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          admin_notes: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          deposit_amount: number
          deposit_received_amount: number | null
          deposit_received_at: string | null
          email: string
          expires_at: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string | null
          reference: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          admin_notes?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          deposit_amount: number
          deposit_received_amount?: number | null
          deposit_received_at?: string | null
          email: string
          expires_at: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone?: string | null
          reference: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          admin_notes?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          deposit_amount?: number
          deposit_received_amount?: number | null
          deposit_received_at?: string | null
          email?: string
          expires_at?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      trade_ins: {
        Row: {
          admin_notes: string | null
          ai_analysis: string | null
          brand: string
          condition: Database["public"]["Enums"]["trade_in_condition"]
          created_at: string
          email: string
          estimate_high: number | null
          estimate_low: number | null
          first_name: string
          fuel: string | null
          id: string
          last_name: string
          length_cm: number | null
          message: string | null
          mileage: number
          model: string
          phone: string | null
          photos: string[] | null
          seats: number | null
          status: Database["public"]["Enums"]["trade_in_status"]
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Insert: {
          admin_notes?: string | null
          ai_analysis?: string | null
          brand: string
          condition: Database["public"]["Enums"]["trade_in_condition"]
          created_at?: string
          email: string
          estimate_high?: number | null
          estimate_low?: number | null
          first_name: string
          fuel?: string | null
          id?: string
          last_name: string
          length_cm?: number | null
          message?: string | null
          mileage: number
          model: string
          phone?: string | null
          photos?: string[] | null
          seats?: number | null
          status?: Database["public"]["Enums"]["trade_in_status"]
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Update: {
          admin_notes?: string | null
          ai_analysis?: string | null
          brand?: string
          condition?: Database["public"]["Enums"]["trade_in_condition"]
          created_at?: string
          email?: string
          estimate_high?: number | null
          estimate_low?: number | null
          first_name?: string
          fuel?: string | null
          id?: string
          last_name?: string
          length_cm?: number | null
          message?: string | null
          mileage?: number
          model?: string
          phone?: string | null
          photos?: string[] | null
          seats?: number | null
          status?: Database["public"]["Enums"]["trade_in_status"]
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          beds: number
          brand: string
          condition: Database["public"]["Enums"]["vehicle_condition"]
          cover_image: string | null
          created_at: string
          deposit_override: number | null
          description: string
          features: string[] | null
          fuel: string | null
          id: string
          images: string[] | null
          is_featured: boolean
          length_cm: number | null
          mileage: number | null
          model: string
          power_hp: number | null
          price: number
          reserved_until: string | null
          seats: number
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at: string
          year: number
        }
        Insert: {
          beds?: number
          brand: string
          condition?: Database["public"]["Enums"]["vehicle_condition"]
          cover_image?: string | null
          created_at?: string
          deposit_override?: number | null
          description: string
          features?: string[] | null
          fuel?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean
          length_cm?: number | null
          mileage?: number | null
          model: string
          power_hp?: number | null
          price: number
          reserved_until?: string | null
          seats?: number
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission?: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
          year: number
        }
        Update: {
          beds?: number
          brand?: string
          condition?: Database["public"]["Enums"]["vehicle_condition"]
          cover_image?: string | null
          created_at?: string
          deposit_override?: number | null
          description?: string
          features?: string[] | null
          fuel?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean
          length_cm?: number | null
          mileage?: number | null
          model?: string
          power_hp?: number | null
          price?: number
          reserved_until?: string | null
          seats?: number
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          title?: string
          transmission?: string | null
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      lead_status: "nouveau" | "en_cours" | "traite" | "archive"
      lead_type: "contact" | "rappel" | "vehicule" | "reprise" | "financement"
      reservation_status:
        | "en_attente_virement"
        | "acompte_recu"
        | "vente_finalisee"
        | "annulee"
        | "expiree"
        | "demande_visite"
        | "visite_confirmee"
        | "visite_realisee"
      trade_in_condition: "excellent" | "bon" | "moyen" | "a_renover"
      trade_in_status: "nouveau" | "en_cours" | "estime" | "refuse" | "archive"
      vehicle_condition: "neuf" | "occasion"
      vehicle_status: "disponible" | "reserve" | "vendu" | "pre_reserve"
      vehicle_type: "profile" | "integral" | "fourgon" | "capucine"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      lead_status: ["nouveau", "en_cours", "traite", "archive"],
      lead_type: ["contact", "rappel", "vehicule", "reprise", "financement"],
      reservation_status: [
        "en_attente_virement",
        "acompte_recu",
        "vente_finalisee",
        "annulee",
        "expiree",
        "demande_visite",
        "visite_confirmee",
        "visite_realisee",
      ],
      trade_in_condition: ["excellent", "bon", "moyen", "a_renover"],
      trade_in_status: ["nouveau", "en_cours", "estime", "refuse", "archive"],
      vehicle_condition: ["neuf", "occasion"],
      vehicle_status: ["disponible", "reserve", "vendu", "pre_reserve"],
      vehicle_type: ["profile", "integral", "fourgon", "capucine"],
    },
  },
} as const
