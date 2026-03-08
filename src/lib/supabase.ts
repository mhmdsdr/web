import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error('❌ CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing!');
}

// Only export if we have a URL, otherwise export a proxy or handle it in routes
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null as any; // Using 'any' to avoid type issues while allowing the app to build
