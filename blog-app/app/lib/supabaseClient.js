// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = 'https://ppxclfscuebswbjhjtcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNsZnNjdWVic3diamhqdGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3OTU5MjgsImV4cCI6MjA0NDM3MTkyOH0.WYUHZcJNDf1J9k1VNMpjKP_woxKS5CmHMoDFUPh2GI0';

// Initialize Supabase client
const Supabase = createClient(supabaseUrl, supabaseAnonKey);

export default Supabase;
