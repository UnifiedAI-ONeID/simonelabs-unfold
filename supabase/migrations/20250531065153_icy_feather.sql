-- Add Stripe customer ID to users_profiles
ALTER TABLE public.users_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id text NOT NULL,
    stripe_price_id text NOT NULL,
    status text NOT NULL,
    current_period_end timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create prices table for educators
CREATE TABLE IF NOT EXISTS public.course_prices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    stripe_price_id text NOT NULL,
    amount decimal NOT NULL,
    currency text NOT NULL DEFAULT 'usd',
    interval text NOT NULL DEFAULT 'month',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(course_id, stripe_price_id)
);

-- Add RLS policies for course prices
ALTER TABLE public.course_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course prices"
    ON public.course_prices
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Course instructors can manage prices"
    ON public.course_prices
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_prices.course_id
            AND courses.instructor_id = auth.uid()
        )
    );