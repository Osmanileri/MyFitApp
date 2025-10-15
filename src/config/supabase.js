// Supabase Client Configuration
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase Project Credentials
const SUPABASE_URL = "https://nqsvaqeiaovhnlolvixb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xc3ZhcWVpYW92aG5sb2x2aXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDM3NTksImV4cCI6MjA3NjA3OTc1OX0.xfn2cBPttIRaWvy8DPdgIO2fd_XB4IlE9X2DubscmrI";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Enable PKCE for native OAuth flows
    flowType: "pkce",
  },
});

// Export configuration for reference
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};

export default supabase;
