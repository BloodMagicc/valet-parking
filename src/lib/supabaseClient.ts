import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Automatically clean the URL string
const supabaseUrl = rawUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');

if (typeof window !== 'undefined') {
  console.log('Clean Supabase URL:', supabaseUrl);
  console.log('Supabase Key loaded:', !!supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);