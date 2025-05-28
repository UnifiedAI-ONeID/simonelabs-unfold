
export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  course_id: string;
  section_id?: string;
  topic: string;
  tags: string[];
  is_answered: boolean;
  created_at: string;
  author_profile?: {
    display_name: string;
    avatar_url?: string;
  };
  reply_count?: number;
}

export interface Reply {
  id: string;
  content: string;
  author_id: string;
  thread_id: string;
  created_at: string;
  author_profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface DiscussionForumProps {
  courseId: string;
  sectionId?: string;
}
