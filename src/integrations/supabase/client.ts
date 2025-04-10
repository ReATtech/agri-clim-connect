
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://huokwicjlglpwzmyacng.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1b2t3aWNqbGdscHd6bXlhY25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzk5NDcsImV4cCI6MjA1OTgxNTk0N30.gDvRefwfpvaTgCB-5MgpAWUM8Twif6IPNQ5ThvMv_88";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});
