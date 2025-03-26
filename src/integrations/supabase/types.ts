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
      completed_tasks: {
        Row: {
          completed_at: string | null
          id: string
          task_id: string
          user_nullifier_hash: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          task_id: string
          user_nullifier_hash?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          task_id?: string
          user_nullifier_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_tasks_user_nullifier_hash_fkey"
            columns: ["user_nullifier_hash"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nullifier_hash"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reward: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reward?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reward?: number
          title?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          recipient_address: string | null
          status: string | null
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          recipient_address?: string | null
          status?: string | null
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          recipient_address?: string | null
          status?: string | null
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_auth_logs: {
        Row: {
          auth_provider: string
          email: string | null
          id: string
          ip_address: string | null
          login_status: string | null
          login_time: string | null
          phone: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_provider: string
          email?: string | null
          id?: string
          ip_address?: string | null
          login_status?: string | null
          login_time?: string | null
          phone?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_provider?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          login_status?: string | null
          login_time?: string | null
          phone?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed_at: string | null
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verifications: {
        Row: {
          id: string
          last_claim: string | null
          next_claim_time: string | null
          nullifier_hash: string
          total_claimed: number | null
          user_id: string | null
          verification_level: string
          verified_at: string | null
        }
        Insert: {
          id?: string
          last_claim?: string | null
          next_claim_time?: string | null
          nullifier_hash: string
          total_claimed?: number | null
          user_id?: string | null
          verification_level?: string
          verified_at?: string | null
        }
        Update: {
          id?: string
          last_claim?: string | null
          next_claim_time?: string | null
          nullifier_hash?: string
          total_claimed?: number | null
          user_id?: string | null
          verification_level?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          address: string
          balance: number | null
          id: string
          updated_at: string | null
          user_nullifier_hash: string | null
        }
        Insert: {
          address: string
          balance?: number | null
          id?: string
          updated_at?: string | null
          user_nullifier_hash?: string | null
        }
        Update: {
          address?: string
          balance?: number | null
          id?: string
          updated_at?: string | null
          user_nullifier_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_user_nullifier_hash_fkey"
            columns: ["user_nullifier_hash"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["nullifier_hash"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          last_login: string | null
          next_claim_time: number | null
          nullifier_hash: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          last_login?: string | null
          next_claim_time?: number | null
          nullifier_hash: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          last_login?: string | null
          next_claim_time?: number | null
          nullifier_hash?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string
          balance: number | null
          created_at: string
          id: string
          last_claim: string | null
          savings: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          balance?: number | null
          created_at?: string
          id?: string
          last_claim?: string | null
          savings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          balance?: number | null
          created_at?: string
          id?: string
          last_claim?: string | null
          savings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_tokens: {
        Args: {
          wallet_address: string
        }
        Returns: Json
      }
      deposit_to_savings: {
        Args: {
          wallet_address: string
          amount: number
        }
        Returns: Json
      }
      send_tokens: {
        Args: {
          sender_address: string
          recipient_address: string
          amount: number
        }
        Returns: Json
      }
      verify_wallet_ownership: {
        Args: {
          wallet_address: string
        }
        Returns: boolean
      }
      withdraw_from_savings: {
        Args: {
          wallet_address: string
          amount: number
        }
        Returns: Json
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
