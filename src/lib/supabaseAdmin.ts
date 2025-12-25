import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. ' +
    'Make sure you have a server-only .env.local with SUPABASE_SERVICE_ROLE_KEY set.'
  );
}

/**
 * ADMIN client (service_role key) — NEVER use this in client-side code.
 * Use only inside server-side code: route handlers, server actions, cron jobs, etc.
 */
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
