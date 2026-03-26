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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      agents: {
        Row: {
          completed_at: string | null
          created_at: string
          current_task: string | null
          id: string
          model: string
          name: string
          session_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["agent_status"]
          thought_stream: Json
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_task?: string | null
          id?: string
          model?: string
          name: string
          session_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          thought_stream?: Json
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_task?: string | null
          id?: string
          model?: string
          name?: string
          session_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          thought_stream?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      changelog_entries: {
        Row: {
          category: Database["public"]["Enums"]["changelog_category"]
          created_at: string
          description: string
          id: string
          pr_number: number | null
          pr_url: string | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          category: Database["public"]["Enums"]["changelog_category"]
          created_at?: string
          description?: string
          id?: string
          pr_number?: number | null
          pr_url?: string | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          category?: Database["public"]["Enums"]["changelog_category"]
          created_at?: string
          description?: string
          id?: string
          pr_number?: number | null
          pr_url?: string | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      chunks: {
        Row: {
          chunk_index: number
          component_name: string
          component_type: Database["public"]["Enums"]["component_type"]
          content: string
          created_at: string
          embedding: string | null
          fts: unknown
          heading_path: string[]
          id: number
          metadata: Json
          token_count: number | null
          updated_at: string
        }
        Insert: {
          chunk_index?: number
          component_name: string
          component_type: Database["public"]["Enums"]["component_type"]
          content: string
          created_at?: string
          embedding?: string | null
          fts?: unknown
          heading_path?: string[]
          id?: never
          metadata?: Json
          token_count?: number | null
          updated_at?: string
        }
        Update: {
          chunk_index?: number
          component_name?: string
          component_type?: Database["public"]["Enums"]["component_type"]
          content?: string
          created_at?: string
          embedding?: string | null
          fts?: unknown
          heading_path?: string[]
          id?: never
          metadata?: Json
          token_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          created_at: string
          description: string | null
          embedding: string | null
          fts: unknown
          id: string
          metadata: Json
          name: string
          type: Database["public"]["Enums"]["component_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          fts?: unknown
          id?: string
          metadata?: Json
          name: string
          type: Database["public"]["Enums"]["component_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          fts?: unknown
          id?: string
          metadata?: Json
          name?: string
          type?: Database["public"]["Enums"]["component_type"]
          updated_at?: string
        }
        Relationships: []
      }
      cross_references: {
        Row: {
          created_at: string
          id: string
          relationship: Database["public"]["Enums"]["relationship_type"]
          source_name: string
          source_type: Database["public"]["Enums"]["component_type"]
          target_name: string
          target_type: Database["public"]["Enums"]["component_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          relationship: Database["public"]["Enums"]["relationship_type"]
          source_name: string
          source_type: Database["public"]["Enums"]["component_type"]
          target_name: string
          target_type: Database["public"]["Enums"]["component_type"]
        }
        Update: {
          created_at?: string
          id?: string
          relationship?: Database["public"]["Enums"]["relationship_type"]
          source_name?: string
          source_type?: Database["public"]["Enums"]["component_type"]
          target_name?: string
          target_type?: Database["public"]["Enums"]["component_type"]
        }
        Relationships: []
      }
      pipeline_phases: {
        Row: {
          completed_at: string | null
          created_at: string
          gate_approved: boolean | null
          id: string
          name: string
          phase_id: number
          session_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["pipeline_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          gate_approved?: boolean | null
          id?: string
          name: string
          phase_id: number
          session_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          gate_approved?: boolean | null
          id?: string
          name?: string
          phase_id?: number
          session_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_phases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_gates: {
        Row: {
          additional_gates: Json
          created_at: string
          id: string
          phases: Json
          score: number
          session_id: string
          updated_at: string
        }
        Insert: {
          additional_gates?: Json
          created_at?: string
          id?: string
          phases?: Json
          score?: number
          session_id: string
          updated_at?: string
        }
        Update: {
          additional_gates?: Json
          created_at?: string
          id?: string
          phases?: Json
          score?: number
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_gates_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_learnings: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          fts: unknown
          id: string
          learning_type: Database["public"]["Enums"]["learning_type"]
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          fts?: unknown
          id?: string
          learning_type: Database["public"]["Enums"]["learning_type"]
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          fts?: unknown
          id?: string
          learning_type?: Database["public"]["Enums"]["learning_type"]
          session_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          active: boolean
          branch: string | null
          context_max: number
          context_used: number
          created_at: string
          ended_at: string | null
          id: string
          model: string
          started_at: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          branch?: string | null
          context_max?: number
          context_used?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          model?: string
          started_at?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          branch?: string | null
          context_max?: number
          context_used?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          model?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          acceptance_criteria: Json
          blocked_by: string[]
          blocks: string[]
          column: Database["public"]["Enums"]["task_column"]
          created_at: string
          description: string
          dri: string
          files: string[]
          id: string
          phase: Database["public"]["Enums"]["task_phase"]
          project_name: string
          session_id: string | null
          tag: Database["public"]["Enums"]["task_tag"] | null
          task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          acceptance_criteria?: Json
          blocked_by?: string[]
          blocks?: string[]
          column?: Database["public"]["Enums"]["task_column"]
          created_at?: string
          description?: string
          dri?: string
          files?: string[]
          id?: string
          phase?: Database["public"]["Enums"]["task_phase"]
          project_name?: string
          session_id?: string | null
          tag?: Database["public"]["Enums"]["task_tag"] | null
          task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          acceptance_criteria?: Json
          blocked_by?: string[]
          blocks?: string[]
          column?: Database["public"]["Enums"]["task_column"]
          created_at?: string
          description?: string
          dri?: string
          files?: string[]
          id?: string
          phase?: Database["public"]["Enums"]["task_phase"]
          project_name?: string
          session_id?: string | null
          tag?: Database["public"]["Enums"]["task_tag"] | null
          task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_session: { Args: never; Returns: Json }
      get_session_tasks: { Args: { p_session_id: string }; Returns: Json }
      hybrid_search_chunks: {
        Args: {
          filter_type?: Database["public"]["Enums"]["component_type"]
          full_text_weight?: number
          match_count?: number
          query_embedding?: string
          query_text: string
          rrf_k?: number
          semantic_weight?: number
        }
        Returns: {
          component_name: string
          component_type: Database["public"]["Enums"]["component_type"]
          content: string
          heading_path: string[]
          id: number
          metadata: Json
          rank_score: number
        }[]
      }
      hybrid_search_components: {
        Args: {
          filter_type?: Database["public"]["Enums"]["component_type"]
          full_text_weight?: number
          match_count?: number
          query_embedding?: string
          query_text: string
          rrf_k?: number
          semantic_weight?: number
        }
        Returns: {
          description: string
          id: string
          metadata: Json
          name: string
          rank_score: number
          type: Database["public"]["Enums"]["component_type"]
        }[]
      }
      match_components: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          description: string
          id: string
          metadata: Json
          name: string
          similarity: number
          type: Database["public"]["Enums"]["component_type"]
        }[]
      }
      match_learnings: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          learning_type: Database["public"]["Enums"]["learning_type"]
          session_id: string
          similarity: number
        }[]
      }
      search_chunks_text: {
        Args: {
          filter_type?: Database["public"]["Enums"]["component_type"]
          match_count?: number
          query_text: string
        }
        Returns: {
          component_name: string
          component_type: Database["public"]["Enums"]["component_type"]
          content: string
          heading_path: string[]
          id: number
          metadata: Json
          rank: number
        }[]
      }
    }
    Enums: {
      agent_status: "idle" | "active" | "completed" | "failed"
      changelog_category: "added" | "changed" | "fixed" | "removed"
      component_type: "agent" | "skill" | "script" | "hook" | "rule"
      learning_type: "error" | "correction" | "success" | "pattern"
      pipeline_status: "idle" | "active" | "complete" | "failed"
      relationship_type: "uses" | "references" | "depends_on"
      task_column: "backlog" | "todo" | "in-progress" | "review" | "done"
      task_phase: "P0" | "P1" | "P2"
      task_tag:
        | "feat"
        | "fix"
        | "refactor"
        | "docs"
        | "chore"
        | "perf"
        | "a11y"
        | "security"
        | "test"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      agent_status: ["idle", "active", "completed", "failed"],
      changelog_category: ["added", "changed", "fixed", "removed"],
      component_type: ["agent", "skill", "script", "hook", "rule"],
      learning_type: ["error", "correction", "success", "pattern"],
      pipeline_status: ["idle", "active", "complete", "failed"],
      relationship_type: ["uses", "references", "depends_on"],
      task_column: ["backlog", "todo", "in-progress", "review", "done"],
      task_phase: ["P0", "P1", "P2"],
      task_tag: [
        "feat",
        "fix",
        "refactor",
        "docs",
        "chore",
        "perf",
        "a11y",
        "security",
        "test",
      ],
    },
  },
} as const
