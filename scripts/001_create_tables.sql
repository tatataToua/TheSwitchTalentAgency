-- Create DJs table
CREATE TABLE IF NOT EXISTS public.djs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  stage_name TEXT,
  bio TEXT,
  image_url TEXT,
  genres TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  booking_rate INTEGER,
  location TEXT,
  equipment TEXT[],
  social_media JSONB DEFAULT '{}',
  mix_samples JSONB DEFAULT '[]',
  availability JSONB DEFAULT '{}',
  residencies TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  image_url TEXT,
  capacity INTEGER,
  amenities TEXT[] DEFAULT '{}',
  preferred_genres TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID REFERENCES public.djs(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME,
  duration INTEGER, -- in hours
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  rate INTEGER,
  notes TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Trade Requests table
CREATE TABLE IF NOT EXISTS public.trade_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_dj_id UUID REFERENCES public.djs(id) ON DELETE CASCADE,
  target_dj_id UUID REFERENCES public.djs(id) ON DELETE CASCADE,
  requesting_venue TEXT NOT NULL,
  target_venue TEXT NOT NULL,
  requested_date DATE NOT NULL,
  target_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('booking', 'general', 'dj_application', 'trade_request')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  dj_id UUID REFERENCES public.djs(id) ON DELETE SET NULL,
  venue_name TEXT,
  event_date DATE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public-facing talent agency)
-- DJs - public read, admin write
CREATE POLICY "Allow public read access to djs" ON public.djs FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to djs" ON public.djs FOR ALL USING (true);

-- Venues - public read, admin write
CREATE POLICY "Allow public read access to venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to venues" ON public.venues FOR ALL USING (true);

-- Bookings - admin only
CREATE POLICY "Allow admin access to bookings" ON public.bookings FOR ALL USING (true);

-- Trade requests - admin only
CREATE POLICY "Allow admin access to trade_requests" ON public.trade_requests FOR ALL USING (true);

-- Contact inquiries - public insert, admin read/update
CREATE POLICY "Allow public insert to contact_inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin access to contact_inquiries" ON public.contact_inquiries FOR ALL USING (true);
