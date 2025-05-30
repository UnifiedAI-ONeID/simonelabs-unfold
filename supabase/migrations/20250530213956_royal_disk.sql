-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon text,
    points integer DEFAULT 0,
    category text,
    requirements jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Create gamification_stats table
CREATE TABLE IF NOT EXISTS public.gamification_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    level integer DEFAULT 1,
    xp_points integer DEFAULT 0,
    streak_count integer DEFAULT 0,
    last_activity_date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create course_reviews table
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Create discussion_threads table
CREATE TABLE IF NOT EXISTS public.discussion_threads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    section_id uuid REFERENCES public.course_sections(id) ON DELETE CASCADE,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    topic text DEFAULT 'general' NOT NULL,
    tags text[],
    is_answered boolean DEFAULT false NOT NULL,
    reply_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create discussion_replies table
CREATE TABLE IF NOT EXISTS public.discussion_replies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id uuid REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create RLS policies
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements
    FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (true);

-- Gamification stats policies
CREATE POLICY "Users can view their own stats" ON public.gamification_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage gamification stats" ON public.gamification_stats
    FOR ALL USING (true);

-- Course reviews policies
CREATE POLICY "Course reviews are viewable by everyone" ON public.course_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.course_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.course_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Discussion threads policies
CREATE POLICY "Users can view threads of published courses" ON public.discussion_threads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = discussion_threads.course_id 
            AND courses.status = 'published'
        )
    );

CREATE POLICY "Users can create threads" ON public.discussion_threads
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own threads" ON public.discussion_threads
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own threads" ON public.discussion_threads
    FOR DELETE USING (auth.uid() = author_id);

-- Discussion replies policies
CREATE POLICY "Users can view replies of published courses" ON public.discussion_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.discussion_threads
            JOIN public.courses ON courses.id = discussion_threads.course_id
            WHERE discussion_threads.id = discussion_replies.thread_id
            AND courses.status = 'published'
        )
    );

CREATE POLICY "Users can create replies" ON public.discussion_replies
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies" ON public.discussion_replies
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" ON public.discussion_replies
    FOR DELETE USING (auth.uid() = author_id);

-- Create trigger function to update reply count
CREATE OR REPLACE FUNCTION public.update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.discussion_threads
        SET reply_count = reply_count + 1
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.discussion_threads
        SET reply_count = reply_count - 1
        WHERE id = OLD.thread_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reply count
CREATE TRIGGER update_thread_reply_count_insert
    AFTER INSERT ON public.discussion_replies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_thread_reply_count();

CREATE TRIGGER update_thread_reply_count_delete
    AFTER DELETE ON public.discussion_replies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_thread_reply_count();

-- Create function to update course rating
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.courses
    SET rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM public.course_reviews
        WHERE course_id = NEW.course_id
    )
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for course rating
CREATE TRIGGER update_course_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_course_rating();