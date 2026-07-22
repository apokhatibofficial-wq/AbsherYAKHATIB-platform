/**
 * Hand-authored to match supabase/migrations/*.sql. Once the project is
 * linked, prefer regenerating with:
 *   supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */
export type UserRoleDb = "customer" | "professional" | "admin";
export type AccountStatusDb = "active" | "suspended";
export type ProfessionalStatusDb = "pending_review" | "approved" | "rejected";
export type EditStatusDb = "pending" | "approved" | "rejected";
export type DocumentKindDb = "id_front" | "id_back" | "work_photo";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRoleDb;
          full_name: string;
          email: string;
          status: AccountStatusDb;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRoleDb;
          full_name: string;
          email: string;
          status?: AccountStatusDb;
        };
        Update: Partial<{
          role: UserRoleDb;
          full_name: string;
          email: string;
          status: AccountStatusDb;
        }>;
        Relationships: [];
      };
      professional_profiles: {
        Row: {
          id: string;
          full_name: string;
          profession: string;
          city: string;
          phone: string;
          description: string;
          view_count: number;
          status: ProfessionalStatusDb;
          submitted_at: string;
          reviewed_at: string | null;
          location_url: string | null;
        };
        Insert: {
          id: string;
          full_name: string;
          profession: string;
          city: string;
          phone: string;
          description?: string;
          status?: ProfessionalStatusDb;
          location_url?: string | null;
        };
        Update: Partial<{
          full_name: string;
          profession: string;
          city: string;
          phone: string;
          description: string;
          status: ProfessionalStatusDb;
          reviewed_at: string | null;
          location_url: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "professional_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      professional_documents: {
        Row: {
          id: string;
          professional_id: string;
          kind: DocumentKindDb;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          professional_id: string;
          kind: DocumentKindDb;
          storage_path: string;
        };
        Update: Partial<{
          kind: DocumentKindDb;
          storage_path: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "professional_documents_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professional_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pending_edits: {
        Row: {
          id: string;
          professional_id: string;
          field: string;
          old_value: string | null;
          new_value: string;
          status: EditStatusDb;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          professional_id: string;
          field: string;
          old_value?: string | null;
          new_value: string;
          status?: EditStatusDb;
        };
        Update: Partial<{
          status: EditStatusDb;
          reviewed_at: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "pending_edits_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professional_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      professions: {
        Row: { name: string; created_at: string };
        Insert: { name: string };
        Update: Partial<{ name: string }>;
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          professional_id: string;
          customer_id: string;
          stars: number;
          created_at: string;
        };
        Insert: {
          professional_id: string;
          customer_id: string;
          stars: number;
        };
        Update: Partial<{ stars: number }>;
        Relationships: [
          {
            foreignKeyName: "ratings_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: false;
            referencedRelation: "professional_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      featured_listings: {
        Row: {
          id: string;
          professional_id: string;
          added_at: string;
        };
        Insert: {
          professional_id: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "featured_listings_professional_id_fkey";
            columns: ["professional_id"];
            isOneToOne: true;
            referencedRelation: "professional_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      increment_professional_view: { Args: { p_professional_id: string }; Returns: undefined };
      approve_professional_request: { Args: { p_professional_id: string }; Returns: undefined };
      reject_professional_request: { Args: { p_professional_id: string }; Returns: undefined };
      approve_pending_edit: { Args: { p_edit_id: string }; Returns: undefined };
      reject_pending_edit: { Args: { p_edit_id: string }; Returns: undefined };
      set_user_status: { Args: { p_user_id: string; p_status: AccountStatusDb }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
