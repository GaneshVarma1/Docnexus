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
      doctors: {
        Row: {
          id: string
          npi_number: string
          name: string
          specialty: string
          city: string
          state: string
          hco: string
          health_system: string
          num_publications: number
          num_clinical_trials: number
          num_payments: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          npi_number: string
          name: string
          specialty: string
          city: string
          state: string
          hco: string
          health_system: string
          num_publications?: number
          num_clinical_trials?: number
          num_payments?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          npi_number?: string
          name?: string
          specialty?: string
          city?: string
          state?: string
          hco?: string
          health_system?: string
          num_publications?: number
          num_clinical_trials?: number
          num_payments?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}