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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      jaifferson_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          fireflies_meeting_id: string | null
          gcal_event_id: string | null
          global_report_url: string | null
          host_id: string
          id: string
          is_public: boolean | null
          max_participants: number | null
          meet_link: string | null
          scheduled_at: string | null
          status: string | null
          title: string
          topic_raw: string | null
          topic_refined: string | null
          transcript_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          fireflies_meeting_id?: string | null
          gcal_event_id?: string | null
          global_report_url?: string | null
          host_id: string
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          meet_link?: string | null
          scheduled_at?: string | null
          status?: string | null
          title: string
          topic_raw?: string | null
          topic_refined?: string | null
          transcript_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          fireflies_meeting_id?: string | null
          gcal_event_id?: string | null
          global_report_url?: string | null
          host_id?: string
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          meet_link?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
          topic_raw?: string | null
          topic_refined?: string | null
          transcript_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jaifferson_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          name: string
          session_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          name: string
          session_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          name?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          ai_better: string
          ai_usage: string
          ai_worry: string
          background: string
          current_focus: string
          hardest_problem: string
          id: string
          location: string
          participant_id: string
          question_for_group: string | null
          reaction_to_jaifferson: string
          session_value: string
          submitted_at: string
        }
        Insert: {
          ai_better: string
          ai_usage: string
          ai_worry: string
          background: string
          current_focus: string
          hardest_problem: string
          id?: string
          location: string
          participant_id: string
          question_for_group?: string | null
          reaction_to_jaifferson: string
          session_value: string
          submitted_at?: string
        }
        Update: {
          ai_better?: string
          ai_usage?: string
          ai_worry?: string
          background?: string
          current_focus?: string
          hardest_problem?: string
          id?: string
          location?: string
          participant_id?: string
          question_for_group?: string | null
          reaction_to_jaifferson?: string
          session_value?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      session_applications: {
        Row: {
          answers: Json | null
          applied_at: string | null
          id: string
          reviewed_at: string | null
          session_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          applied_at?: string | null
          id?: string
          reviewed_at?: string | null
          session_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          applied_at?: string | null
          id?: string
          reviewed_at?: string | null
          session_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_applications_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jaifferson_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          id: string
          joined_at: string | null
          report_sent_at: string | null
          report_url: string | null
          session_id: string
          speech_pct: number | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          report_sent_at?: string | null
          report_url?: string | null
          session_id: string
          speech_pct?: number | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          report_sent_at?: string | null
          report_url?: string | null
          session_id?: string
          speech_pct?: number | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jaifferson_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_questions: {
        Row: {
          id: string
          order_index: number
          question: string
          session_id: string
        }
        Insert: {
          id?: string
          order_index: number
          question: string
          session_id: string
        }
        Update: {
          id?: string
          order_index?: number
          question?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jaifferson_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_ratings: {
        Row: {
          best_moment: string | null
          depth_score: number | null
          host_rating: number | null
          id: string
          preparation: number | null
          rated_user_id: string
          rater_id: string
          session_id: string
          submitted_at: string | null
          want_to_meet_again: boolean | null
        }
        Insert: {
          best_moment?: string | null
          depth_score?: number | null
          host_rating?: number | null
          id?: string
          preparation?: number | null
          rated_user_id: string
          rater_id: string
          session_id: string
          submitted_at?: string | null
          want_to_meet_again?: boolean | null
        }
        Update: {
          best_moment?: string | null
          depth_score?: number | null
          host_rating?: number | null
          id?: string
          preparation?: number | null
          rated_user_id?: string
          rater_id?: string
          session_id?: string
          submitted_at?: string | null
          want_to_meet_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "session_ratings_rated_user_id_fkey"
            columns: ["rated_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_ratings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jaifferson_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          id: string
          name: string
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          topic?: string
        }
        Relationships: []
      }
      user_archetypes: {
        Row: {
          archetype: string | null
          disc: string | null
          enneagram: string | null
          generated_at: string | null
          id: string
          mbti: string | null
          session_id: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          archetype?: string | null
          disc?: string | null
          enneagram?: string | null
          generated_at?: string | null
          id?: string
          mbti?: string | null
          session_id: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          archetype?: string | null
          disc?: string | null
          enneagram?: string | null
          generated_at?: string | null
          id?: string
          mbti?: string | null
          session_id?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_archetypes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jaifferson_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_archetypes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          archetype: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_public: boolean | null
          last_name: string | null
          linkedin_url: string | null
          mbti_estimate: string | null
          rating_avg: number | null
          sessions_hosted: number | null
          sessions_joined: number | null
        }
        Insert: {
          archetype?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_public?: boolean | null
          last_name?: string | null
          linkedin_url?: string | null
          mbti_estimate?: string | null
          rating_avg?: number | null
          sessions_hosted?: number | null
          sessions_joined?: number | null
        }
        Update: {
          archetype?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_public?: boolean | null
          last_name?: string | null
          linkedin_url?: string | null
          mbti_estimate?: string | null
          rating_avg?: number | null
          sessions_hosted?: number | null
          sessions_joined?: number | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          intent: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          intent: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          intent?: string
          topic?: string | null
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
    Enums: {},
  },
} as const
