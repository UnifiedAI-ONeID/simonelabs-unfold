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
      accessibility_settings: {
        Row: {
          caption_settings: Json | null
          created_at: string | null
          font_size: string | null
          high_contrast: boolean | null
          id: string
          keyboard_navigation: boolean | null
          reduced_motion: boolean | null
          screen_reader_optimized: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          caption_settings?: Json | null
          created_at?: string | null
          font_size?: string | null
          high_contrast?: boolean | null
          id?: string
          keyboard_navigation?: boolean | null
          reduced_motion?: boolean | null
          screen_reader_optimized?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          caption_settings?: Json | null
          created_at?: string | null
          font_size?: string | null
          high_contrast?: boolean | null
          id?: string
          keyboard_navigation?: boolean | null
          reduced_motion?: boolean | null
          screen_reader_optimized?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          points_reward: number | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          points_reward?: number | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          points_reward?: number | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      affiliate_programs: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          lifetime_earnings: number | null
          payment_threshold: number | null
          referral_code: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_rate: number
          created_at?: string | null
          id?: string
          lifetime_earnings?: number | null
          payment_threshold?: number | null
          referral_code: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          lifetime_earnings?: number | null
          payment_threshold?: number | null
          referral_code?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_versions: {
        Row: {
          changes: Json | null
          created_at: string | null
          hash: string
          id: string
          required: boolean | null
          url: string
          version: string
        }
        Insert: {
          changes?: Json | null
          created_at?: string | null
          hash?: string
          id?: string
          required?: boolean | null
          url: string
          version: string
        }
        Update: {
          changes?: Json | null
          created_at?: string | null
          hash?: string
          id?: string
          required?: boolean | null
          url?: string
          version?: string
        }
        Relationships: []
      }
      auth_audit_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          avg_time_spent: unknown | null
          completion_rate: number | null
          content_id: string
          content_type: string
          dropout_points: Json | null
          feedback_score: number | null
          id: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          avg_time_spent?: unknown | null
          completion_rate?: number | null
          content_id: string
          content_type: string
          dropout_points?: Json | null
          feedback_score?: number | null
          id?: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          avg_time_spent?: unknown | null
          completion_rate?: number | null
          content_id?: string
          content_type?: string
          dropout_points?: Json | null
          feedback_score?: number | null
          id?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      content_variations: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          maturity_level: string
          section_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          maturity_level: string
          section_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          maturity_level?: string
          section_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_variations_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      course_ab_tests: {
        Row: {
          course_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          metrics: Json
          start_date: string
          status: string | null
          test_name: string
          updated_at: string | null
          variants: Json
          winner_variant: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          metrics: Json
          start_date: string
          status?: string | null
          test_name: string
          updated_at?: string | null
          variants: Json
          winner_variant?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json
          start_date?: string
          status?: string | null
          test_name?: string
          updated_at?: string | null
          variants?: Json
          winner_variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_ab_tests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_analytics: {
        Row: {
          active_students: number | null
          average_completion_time: unknown | null
          course_id: string
          dropout_rate: number | null
          id: string
          total_enrollments: number | null
          updated_at: string | null
        }
        Insert: {
          active_students?: number | null
          average_completion_time?: unknown | null
          course_id: string
          dropout_rate?: number | null
          id?: string
          total_enrollments?: number | null
          updated_at?: string | null
        }
        Update: {
          active_students?: number | null
          average_completion_time?: unknown | null
          course_id?: string
          dropout_rate?: number | null
          id?: string
          total_enrollments?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_analytics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_challenges: {
        Row: {
          company_name: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          evaluation_criteria: Json | null
          id: string
          max_participants: number | null
          requirements: Json | null
          rewards: Json | null
          submission_deadline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          evaluation_criteria?: Json | null
          id?: string
          max_participants?: number | null
          requirements?: Json | null
          rewards?: Json | null
          submission_deadline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          evaluation_criteria?: Json | null
          id?: string
          max_participants?: number | null
          requirements?: Json | null
          rewards?: Json | null
          submission_deadline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_challenges_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_collaborators: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          permissions: Json
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          permissions?: Json
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_collaborators_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_files: {
        Row: {
          course_id: string | null
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          section_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          section_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_files_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_files_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      course_pricing: {
        Row: {
          amount: number | null
          billing_interval: string | null
          bulk_discount_rules: Json | null
          course_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          price_type: string
          student_discount: number | null
          trial_period_days: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          billing_interval?: string | null
          bulk_discount_rules?: Json | null
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          price_type: string
          student_discount?: number | null
          trial_period_days?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          billing_interval?: string | null
          bulk_discount_rules?: Json | null
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          price_type?: string
          student_discount?: number | null
          trial_period_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_pricing_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_recommendations: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          reason: string
          score: number
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          score: number
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sections: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          order: number
          quiz: Json | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order: number
          quiz?: Json | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order?: number
          quiz?: Json | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_templates: {
        Row: {
          ai_generated: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          structure: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          structure: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          structure?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_translations: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          language_code: string
          machine_translated: boolean | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          language_code: string
          machine_translated?: boolean | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          language_code?: string
          machine_translated?: boolean | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_translations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_versions: {
        Row: {
          changes_description: string | null
          content: Json
          course_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          published: boolean | null
          version_number: number
        }
        Insert: {
          changes_description?: string | null
          content: Json
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published?: boolean | null
          version_number: number
        }
        Update: {
          changes_description?: string | null
          content?: Json
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published?: boolean | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_versions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          accessibility_features: Json | null
          age_range: string[] | null
          ai_assisted_content: Json | null
          bandwidth_optimized: boolean | null
          category_id: string | null
          collaborative_features: Json | null
          content: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          difficulty_rating: number | null
          estimated_duration: unknown | null
          has_hands_on_projects: boolean | null
          id: string
          instructor_id: string | null
          learning_objectives: Json | null
          offline_access: boolean | null
          points_reward: number | null
          prerequisites: string[] | null
          rating: number | null
          required_skills: string[] | null
          review_count: number | null
          status: string | null
          student_count: number | null
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          accessibility_features?: Json | null
          age_range?: string[] | null
          ai_assisted_content?: Json | null
          bandwidth_optimized?: boolean | null
          category_id?: string | null
          collaborative_features?: Json | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          difficulty_rating?: number | null
          estimated_duration?: unknown | null
          has_hands_on_projects?: boolean | null
          id?: string
          instructor_id?: string | null
          learning_objectives?: Json | null
          offline_access?: boolean | null
          points_reward?: number | null
          prerequisites?: string[] | null
          rating?: number | null
          required_skills?: string[] | null
          review_count?: number | null
          status?: string | null
          student_count?: number | null
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          accessibility_features?: Json | null
          age_range?: string[] | null
          ai_assisted_content?: Json | null
          bandwidth_optimized?: boolean | null
          category_id?: string | null
          collaborative_features?: Json | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          difficulty_rating?: number | null
          estimated_duration?: unknown | null
          has_hands_on_projects?: boolean | null
          id?: string
          instructor_id?: string | null
          learning_objectives?: Json | null
          offline_access?: boolean | null
          points_reward?: number | null
          prerequisites?: string[] | null
          rating?: number | null
          required_skills?: string[] | null
          review_count?: number | null
          status?: string | null
          student_count?: number | null
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_threads: {
        Row: {
          author_id: string | null
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          is_answered: boolean | null
          section_id: string | null
          tags: string[] | null
          title: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          section_id?: string | null
          tags?: string[] | null
          title: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          section_id?: string | null
          tags?: string[] | null
          title?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_threads_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_threads_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      educator_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          education: string | null
          expertise: string[] | null
          id: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          education?: string | null
          expertise?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          education?: string | null
          expertise?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      educator_stats: {
        Row: {
          average_rating: number | null
          completion_rate: number | null
          created_at: string | null
          educator_id: string
          id: string
          total_courses: number | null
          total_students: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          completion_rate?: number | null
          created_at?: string | null
          educator_id: string
          id?: string
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          completion_rate?: number | null
          created_at?: string | null
          educator_id?: string
          id?: string
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_duration: unknown | null
          id: string
          prerequisites: Json | null
          skill_level: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          prerequisites?: Json | null
          skill_level: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          prerequisites?: Json | null
          skill_level?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_styles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      mentorship_matches: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_matches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_matches_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_matches_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_environments: {
        Row: {
          config: Json
          course_id: string | null
          created_at: string | null
          environment_type: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          course_id?: string | null
          created_at?: string | null
          environment_type: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          course_id?: string | null
          created_at?: string | null
          environment_type?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_environments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          id: string
          score: number
          section_id: string | null
          time_taken: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score: number
          section_id?: string | null
          time_taken: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number
          section_id?: string | null
          time_taken?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_feedback: {
        Row: {
          course_id: string
          created_at: string | null
          educator_id: string
          feedback: string | null
          id: string
          rating: number | null
          student_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          educator_id: string
          feedback?: string | null
          id?: string
          rating?: number | null
          student_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          educator_id?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_feedback_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_preferences: {
        Row: {
          accessibility_needs: string[] | null
          career_goals: string[] | null
          comprehension_level: number | null
          created_at: string | null
          id: string
          learning_style_id: string | null
          maturity_level: string
          preferred_content_types: string[] | null
          preferred_pace: string | null
          study_schedule: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string[] | null
          career_goals?: string[] | null
          comprehension_level?: number | null
          created_at?: string | null
          id?: string
          learning_style_id?: string | null
          maturity_level: string
          preferred_content_types?: string[] | null
          preferred_pace?: string | null
          study_schedule?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string[] | null
          career_goals?: string[] | null
          comprehension_level?: number | null
          created_at?: string | null
          id?: string
          learning_style_id?: string | null
          maturity_level?: string
          preferred_content_types?: string[] | null
          preferred_pace?: string | null
          study_schedule?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_preferences_learning_style_id_fkey"
            columns: ["learning_style_id"]
            isOneToOne: false
            referencedRelation: "learning_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_passkeys: {
        Row: {
          counter: number
          created_at: string | null
          credential_id: string
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string | null
        }
        Insert: {
          counter?: number
          created_at?: string | null
          credential_id: string
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id?: string | null
        }
        Update: {
          counter?: number
          created_at?: string | null
          credential_id?: string
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          course_id: string | null
          created_at: string | null
          id: string
          last_accessed: string | null
          last_activity_type: string | null
          learning_style: string | null
          preferred_pace: string | null
          progress: number | null
          project_submissions: Json | null
          quiz_performance: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          last_activity_type?: string | null
          learning_style?: string | null
          preferred_pace?: string | null
          progress?: number | null
          project_submissions?: Json | null
          quiz_performance?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          last_activity_type?: string | null
          learning_style?: string | null
          preferred_pace?: string | null
          progress?: number | null
          project_submissions?: Json | null
          quiz_performance?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_security_settings: {
        Row: {
          created_at: string | null
          id: string
          require_2fa: boolean | null
          session_timeout: number | null
          totp_enabled: boolean | null
          totp_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          require_2fa?: boolean | null
          session_timeout?: number | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          require_2fa?: boolean | null
          session_timeout?: number | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device: string
          id: string
          ip_address: unknown | null
          last_active: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device: string
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device?: string
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          level: number | null
          simone_points: number | null
          updated_at: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          level?: number | null
          simone_points?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          level?: number | null
          simone_points?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      virtual_environments: {
        Row: {
          base_image: string
          config: Json
          created_at: string | null
          description: string | null
          environment_type: string
          id: string
          name: string
          resources: Json
          updated_at: string | null
        }
        Insert: {
          base_image: string
          config: Json
          created_at?: string | null
          description?: string | null
          environment_type: string
          id?: string
          name: string
          resources?: Json
          updated_at?: string | null
        }
        Update: {
          base_image?: string
          config?: Json
          created_at?: string | null
          description?: string | null
          environment_type?: string
          id?: string
          name?: string
          resources?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status:
            | Database["public"]["Enums"]["stripe_order_status"]
            | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      disable_totp: {
        Args: { token: string }
        Returns: boolean
      }
      generate_course_outline: {
        Args: { topic: string; difficulty: string; duration: unknown }
        Returns: Json
      }
      generate_totp_secret: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_adapted_content: {
        Args: { p_section_id: string; p_user_id: string }
        Returns: Json
      }
      has_role: {
        Args: { role_name: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      update_passkey_counter: {
        Args: { p_credential_id: string; p_new_counter: number }
        Returns: undefined
      }
      verify_totp: {
        Args: { token: string; secret: string }
        Returns: boolean
      }
      verify_totp_login: {
        Args: { token: string }
        Returns: boolean
      }
    }
    Enums: {
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      user_role: "admin" | "educator" | "student"
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
    Enums: {
      stripe_order_status: ["pending", "completed", "canceled"],
      stripe_subscription_status: [
        "not_started",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      user_role: ["admin", "educator", "student"],
    },
  },
} as const
