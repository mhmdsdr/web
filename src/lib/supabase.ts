import { createClient } from '@supabase/supabase-js'

// Defensive reading of environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Diagnostic logs for Vercel Build (Keys are NEVER logged)
console.log("🛠️ VERCEL BUILD - Checking Supabase Env Vars:");
console.log("   - NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ FOUND" : "❌ MISSING (Required)");
console.log("   - SUPABASE_SERVICE_ROLE_KEY/ANON_KEY:", supabaseKey ? "✅ FOUND" : "❌ MISSING (Required)");

// Function to safely create the client only if both params are non-empty strings
const getSafeClient = () => {
    if (typeof supabaseUrl === 'string' && supabaseUrl.trim().length > 0 &&
        typeof supabaseKey === 'string' && supabaseKey.trim().length > 0) {
        try {
            return createClient(supabaseUrl, supabaseKey);
        } catch (e) {
            console.error("❌ Failed to create Supabase client:", e);
            return null;
        }
    }
    return null;
}

export const supabase = getSafeClient() as any;
