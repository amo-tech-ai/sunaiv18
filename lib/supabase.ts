import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://necxcwhuzylsumlkkmlk.supabase.co';
const supabaseKey = 'sb_publishable_LFstdKVxHEJ5wntLWtmCoA_P-mQ92kS';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);