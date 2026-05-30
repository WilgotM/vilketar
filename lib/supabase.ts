import { createClient } from "@supabase/supabase-js";

type SupabaseRequestOptions = {
  body?: unknown;
  method?: "GET" | "POST";
  searchParams?: Record<string, string | number | null | undefined>;
};

const FALLBACK_SUPABASE_URL = "https://rivzcvgbauthpoutiiog.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "sb_publishable_NC1ouO1HHWd9tEvg2El2aQ_QKcVhJbI";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export function getSupabasePublicConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    anonKey: SUPABASE_ANON_KEY,
    url: SUPABASE_URL,
  };
}

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          lockAcquireTimeout: 5000,
          persistSession: true,
        },
      })
    : null;

function getRestUrl(
  path: string,
  searchParams?: SupabaseRequestOptions["searchParams"],
) {
  if (!SUPABASE_URL) {
    return null;
  }

  const url = new URL(`/rest/v1/${path}`, SUPABASE_URL);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function supabaseRest<T>(
  path: string,
  options: SupabaseRequestOptions = {},
): Promise<T | null> {
  const url = getRestUrl(path, options.searchParams);
  if (!url || !SUPABASE_ANON_KEY) {
    return null;
  }

  const response = await fetch(url, {
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}
