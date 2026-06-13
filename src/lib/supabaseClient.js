import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xodfpyvwjhwrdyzzpncr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGZweXZ3amh3cmR5enpwbmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDYwODIsImV4cCI6MjA5Njc4MjA4Mn0.zsXV2UFkp1_gLKzHXcAxgv6itlF9Q9QCrRFzXfuZf3U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);