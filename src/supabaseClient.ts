/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Supabase Project URL (Configured from env or default project)
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__) ||
  'https://tdoqxjwcotmlfpchmquu.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb3F4andjb3RtbGZwY2htcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4OTY3MDEsImV4cCI6MjEwMzQ3MjcwMX0.Sd3RHINC_KdDoWoAoCZl4bNuqt7VYo6R0v64hay1KXk';

console.log('Supabase Project URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
