-- SQL Script to create the coupons table
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent NUMERIC NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In older Supabase versions, using "gen_random_uuid()" might require "extensions.uuid_ossp"
-- If it fails, use: id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;

-- Enable Row Level Security
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow Public READ access to active coupons (so users can check them during checkout)
CREATE POLICY "Active coupons are viewable by everyone" 
ON coupons FOR SELECT 
USING (is_active = true);

-- Allow Insert/Update/Delete ONLY for service_role (Admin)
-- These will be managed via the Supabase dashboard or a protected Admin API.
CREATE POLICY "Only admins can modify coupons" 
ON coupons FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Sample Coupon (Uncomment to add)
-- INSERT INTO coupons (code, discount_percent, is_active) VALUES ('SAVE10', 10, true);
