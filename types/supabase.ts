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
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          org_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          org_id: string
          name: string
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          status: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wizard_sessions: {
        Row: {
          id: string
          org_id: string
          project_id: string | null
          current_step: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          project_id?: string | null
          current_step?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          project_id?: string | null
          current_step?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wizard_answers: {
        Row: {
          id: string
          session_id: string
          step_number: number
          data: Json
          org_id: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          step_number: number
          data: Json
          org_id: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          step_number?: number
          data?: Json
          org_id?: string
          created_at?: string
        }
        Relationships: []
      }
      context_snapshots: {
        Row: {
          id: string
          org_id: string
          project_id: string | null
          version: number
          is_active: boolean
          summary: string
          metrics: Json
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          project_id?: string | null
          version?: number
          is_active?: boolean
          summary: string
          metrics: Json
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          project_id?: string | null
          version?: number
          is_active?: boolean
          summary?: string
          metrics?: Json
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          org_id: string
          client_id: string
          status: string
          current_step: number
          progress: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          client_id: string
          status?: string
          current_step?: number
          progress?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          client_id?: string
          status?: string
          current_step?: number
          progress?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}