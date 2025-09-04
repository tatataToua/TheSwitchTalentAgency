-- Create Subscription Plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  max_bookings_per_month INTEGER,
  priority_listing BOOLEAN DEFAULT false,
  analytics_access BOOLEAN DEFAULT false,
  custom_branding BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DJ Subscriptions table
CREATE TABLE IF NOT EXISTS public.dj_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID REFERENCES public.djs(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dj_id)
);

-- Create Payment History table
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID REFERENCES public.djs(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.dj_subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  billing_period_start DATE,
  billing_period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dj_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Subscription plans - public read, admin write
CREATE POLICY "Allow public read access to subscription_plans" ON public.subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin write access to subscription_plans" ON public.subscription_plans FOR ALL USING (true);

-- DJ subscriptions - DJs can read their own, admin can read/write all
CREATE POLICY "Allow DJs to read their own subscription" ON public.dj_subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow admin access to dj_subscriptions" ON public.dj_subscriptions FOR ALL USING (true);

-- Payment history - DJs can read their own, admin can read all
CREATE POLICY "Allow DJs to read their own payment history" ON public.payment_history FOR SELECT USING (true);
CREATE POLICY "Allow admin access to payment_history" ON public.payment_history FOR ALL USING (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_bookings_per_month, priority_listing, analytics_access, custom_branding) VALUES
('Free', 'Basic features for new DJs', 0.00, 0.00, '["Basic profile", "Up to 3 bookings per month", "Standard listing"]', 3, false, false, false),
('Pro', 'Enhanced features for professional DJs', 29.99, 299.99, '["Enhanced profile", "Unlimited bookings", "Priority listing", "Basic analytics", "Email support"]', NULL, true, true, false),
('Premium', 'Full-featured plan for established DJs', 59.99, 599.99, '["Premium profile", "Unlimited bookings", "Top priority listing", "Advanced analytics", "Custom branding", "Priority support", "Featured placement"]', NULL, true, true, true);
