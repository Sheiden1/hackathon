import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qxoztewtmlhbsapenssu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4b3p0ZXd0bWxoYnNhcGVuc3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzU4ODEsImV4cCI6MjA3ODIxMTg4MX0.vDQ4y2HQGSWDOqK-hDrdlV81S1lzIgrQmfAghW-ve1c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
