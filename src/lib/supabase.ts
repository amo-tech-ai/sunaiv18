import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Safe access to import.meta.env
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://necxcwhuzylsumlkkmlk.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LFstdKVxHEJ5wntLWtmCoA_P-mQ92kS';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);