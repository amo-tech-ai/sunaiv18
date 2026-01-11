export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      }
      context_snapshots: {
        Row: {
          id: string
          org_id: string
          project_id: string | null
          version: number
          is_active: boolean
          metrics: Json
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          project_id?: string | null
          version?: number
          is_active?: boolean
          metrics: Json
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          project_id?: string | null
          version?: number
          is_active?: boolean
          metrics?: Json
          created_at?: string
        }
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
      }
    }
  }
}