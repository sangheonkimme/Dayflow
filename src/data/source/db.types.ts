// ============================================================
// Generated Supabase types — do not edit by hand.
// 재생성: mcp__supabase__generate_typescript_types
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          archived: boolean;
          balance: number;
          created_at: string;
          currency: string;
          id: string;
          name: string;
          type: string | null;
          user_id: string;
        };
        Insert: {
          archived?: boolean;
          balance?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          name: string;
          type?: string | null;
          user_id: string;
        };
        Update: {
          archived?: boolean;
          balance?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          name?: string;
          type?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          all_day: boolean;
          color: string | null;
          created_at: string;
          description: string | null;
          ends_at: string | null;
          id: string;
          recurrence_rule: string | null;
          starts_at: string;
          title: string;
          user_id: string;
        };
        Insert: {
          all_day?: boolean;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          recurrence_rule?: string | null;
          starts_at: string;
          title: string;
          user_id: string;
        };
        Update: {
          all_day?: boolean;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          recurrence_rule?: string | null;
          starts_at?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          color: string | null;
          icon: string | null;
          id: string;
          kind: string;
          name: string;
          parent_id: string | null;
          position: number;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          icon?: string | null;
          id?: string;
          kind: string;
          name: string;
          parent_id?: string | null;
          position?: number;
          user_id: string;
        };
        Update: {
          color?: string | null;
          icon?: string | null;
          id?: string;
          kind?: string;
          name?: string;
          parent_id?: string | null;
          position?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      checklist_items: {
        Row: {
          completed_at: string | null;
          content: string;
          created_at: string;
          date: string;
          done: boolean;
          due_at: string | null;
          id: string;
          position: number;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          content: string;
          created_at?: string;
          date?: string;
          done?: boolean;
          due_at?: string | null;
          id?: string;
          position?: number;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          content?: string;
          created_at?: string;
          date?: string;
          done?: boolean;
          due_at?: string | null;
          id?: string;
          position?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_logs: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          mood: string | null;
          one_line: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          mood?: string | null;
          one_line?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          mood?: string | null;
          one_line?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          body: string | null;
          created_at: string;
          folder: string | null;
          id: string;
          pinned: boolean;
          starred: boolean;
          tags: string[];
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          folder?: string | null;
          id?: string;
          pinned?: boolean;
          starred?: boolean;
          tags?: string[];
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          folder?: string | null;
          id?: string;
          pinned?: boolean;
          starred?: boolean;
          tags?: string[];
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pinned_info: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          is_secret: boolean;
          label: string;
          position: number;
          user_id: string;
          value: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          is_secret?: boolean;
          label: string;
          position?: number;
          user_id: string;
          value: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          is_secret?: boolean;
          label?: string;
          position?: number;
          user_id?: string;
          value?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          theme: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          theme?: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          theme?: string;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sticky_notes: {
        Row: {
          body: string | null;
          color: string;
          created_at: string;
          emoji: string | null;
          id: string;
          position: number;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          color: string;
          created_at?: string;
          emoji?: string | null;
          id?: string;
          position?: number;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          color?: string;
          created_at?: string;
          emoji?: string | null;
          id?: string;
          position?: number;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          account_id: string | null;
          active: boolean;
          amount: number;
          category_id: string | null;
          created_at: string;
          cycle: string;
          id: string;
          name: string;
          next_billing_at: string;
          user_id: string;
        };
        Insert: {
          account_id?: string | null;
          active?: boolean;
          amount: number;
          category_id?: string | null;
          created_at?: string;
          cycle: string;
          id?: string;
          name: string;
          next_billing_at: string;
          user_id: string;
        };
        Update: {
          account_id?: string | null;
          active?: boolean;
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          cycle?: string;
          id?: string;
          name?: string;
          next_billing_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          account_id: string | null;
          amount: number;
          category_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          kind: string;
          memo: string | null;
          occurred_at: string;
          user_id: string;
        };
        Insert: {
          account_id?: string | null;
          amount: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          kind: string;
          memo?: string | null;
          occurred_at?: string;
          user_id: string;
        };
        Update: {
          account_id?: string | null;
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          kind?: string;
          memo?: string | null;
          occurred_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
