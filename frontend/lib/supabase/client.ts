import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // We use placeholder keys. In Mock Mode, Supabase will be instantiated
  // but any actual queries will fail naturally or be bypassed by our hooks.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
