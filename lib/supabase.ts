import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Allow environment variables to override hardcoded values
// This is critical for local development where you might want to point to localhost
// Fix: Safe access to import.meta.env to prevent runtime errors if undefined
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://necxcwhuzylsumlkkmlk.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LFstdKVxHEJ5wntLWtmCoA_P-mQ92kS';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);