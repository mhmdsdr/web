import { createClient } from '@supabase/supabase-js'

// Diagnostic logs for Vercel Build (Keys are NEVER logged)
console.log("🛠️ VERCEL BUILD - Supabase Config Status:");
console.log("   - URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ FOUND" : "❌ MISSING");
console.log("   - ServiceRole/AnonKey:", (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? "✅ FOUND" : "❌ MISSING");

/**
 * Checks if the Supabase environment variables are present.
 */
export const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && url.trim().startsWith('http'));
}

let cachedClient: any = null;

/**
 * A proxy that delays Supabase initialization until it's actually used.
 * This prevents the 'supabaseUrl is required' error during the build phase.
 */
export const supabase = new Proxy({} as any, {
    get(_, prop) {
        if (!isSupabaseConfigured()) {
            console.error("❌ CRITICAL: Attempted to use Supabase without valid configuration!");
            return undefined;
        }

        if (!cachedClient) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
            cachedClient = createClient(url, key);
        }

        return cachedClient[prop];
    }
});
