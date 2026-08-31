import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug log to verify key presence in browser console
if (typeof window !== 'undefined') {
  console.log('Supabase URL loaded:', !!supabaseUrl);
  console.log('Supabase Key loaded:', !!supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);