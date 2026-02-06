import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abogsfnjbyrshuayczrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib2dzZm5qYnlyc2h1YXljenJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTExOTUsImV4cCI6MjA4NTQ4NzE5NX0.szOCRyUbLVgSJ08zvpyjgPGGvQUGmT6yLHx5kNVGcJ8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
