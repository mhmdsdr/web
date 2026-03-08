import { createClient } from '@supabase/supabase-js'

// 1. Identify variables (Checking multiple possible names used in Vercel)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

// 2. Diagnostic Logs (Keys are NEVER logged)
console.log("🛠️ VERCEL BUILD - Checking Supabase Credentials:");
console.log("   - URL Available:", !!url && url.startsWith('http') ? "✅ YES" : "❌ NO");
console.log("   - KEY Available:", !!key ? "✅ YES" : "❌ NO");

/**
 * Checks if Supabase is properly configured for runtime use.
 */
export const isSupabaseConfigured = () => {
    return typeof url === 'string' && url.trim().startsWith('http') && typeof key === 'string' && key.trim().length > 0;
}

/**
 * The core supabase instance.
 * We ONLY call createClient if we have a valid URL and Key.
 * If missing (e.g. during build phase), we return a dummy object that mimics the structure 
 * to prevent 'property of undefined' errors, but WITHOUT calling createClient.
 */
export const supabase = isSupabaseConfigured()
    ? createClient(url, key)
    : {
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: new Error("Supabase is not configured") }),
                getPublicUrl: () => ({ data: { publicUrl: "" } })
            })
        }
    } as any;
