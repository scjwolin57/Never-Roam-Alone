/* =====================================================================
   NRA-CONFIG.JS — site configuration.

   To turn on accounts + the shared community forum:
   1. Create a free project at https://supabase.com
   2. In Supabase: Project Settings → API → copy the "Project URL" and
      the "anon public" key, and paste them below between the quotes.
   3. Run supabase-setup.sql in Supabase's SQL Editor (one time).
   Full walkthrough: see SETUP-LOGIN.md

   The "anon public" key is DESIGNED to be visible in a webpage — it can
   only do what the database rules (in supabase-setup.sql) allow.
   Never put the "service_role" key here; that one belongs ONLY in
   Netlify environment variables.

   While these are empty, the site runs in guest mode: everything works,
   but forum posts only save in each visitor's own browser.
   ===================================================================== */

window.NRA_CONFIG = {
  SUPABASE_URL: "https://supabase.com/dashboard/project/oferixjdgwwjpstowqis/settings/api-keys",        // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZXJpeGpkZ3d3anBzdG93cWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDI1OTIsImV4cCI6MjA5ODYxODU5Mn0.TNjuvQbevpPOY7ALCIY1rp__N0aMNDREYB3ruU9LGGE"    // the long "anon public" key
};
