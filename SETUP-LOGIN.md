# Turning on Profiles, the Shared Forum & Email Notifications

Two free accounts to create, about 20 minutes total. Until these steps are
done, the site keeps working in "guest mode" (posts save in each visitor's
own browser). Nothing breaks either way.

---

## Part 1 — Supabase (accounts + the shared forum database)

1. Go to **https://supabase.com** → Start your project → sign up (free).
2. Click **New project**. Name it `never-roam-alone`, set any database
   password (save it somewhere — you won't need it day-to-day), pick the
   region closest to your visitors, and click Create. Wait ~2 minutes.
3. **Run the database setup:** in the left menu click **SQL Editor** →
   **New query** → open the file `supabase-setup.sql` from this folder,
   copy ALL of it, paste, and press **Run**. You should see "Success".
4. **Get your two public keys:** left menu → **Project Settings** → **API**.
   - Copy **Project URL** → paste it into `nra-config.js` as SUPABASE_URL
   - Copy the **anon public** key → paste as SUPABASE_ANON_KEY
   (These two are safe to be public — the database rules limit what they
   can do. The **service_role** key on the same page is NOT safe: it goes
   only into Netlify in Part 3.)
5. **Password + magic-link sign-in work immediately.** For the Google
   button: left menu → **Authentication** → **Sign In / Up** → **Google** →
   follow the "Setup" link there. It walks you through creating a free
   Google credential (about 10 clicks in Google Cloud Console); you copy a
   Client ID + Secret back into Supabase and hit Save.
5b. **Facebook button** (free): left menu → **Authentication** →
   **Sign In / Up** → **Facebook** → follow the "Setup" link there. It
   walks you through creating a free Facebook App at
   developers.facebook.com (a few clicks — App Type "Consumer"); you copy
   an App ID + App Secret back into Supabase and hit Save.
6. Also in **Authentication → URL Configuration**, set the **Site URL** to
   your Netlify address (e.g. `https://YOURSITE.netlify.app`) so magic
   links send people back to the right place.

## Part 2 — Resend (sends the "someone replied" emails)

1. Go to **https://resend.com** → Sign up (free — 3,000 emails/month).
2. In the dashboard: **API Keys** → **Create API Key** → name it
   `never-roam-alone` → copy the key (starts with `re_`).
   That's it. (Emails send from Resend's built-in address for now; later
   you can verify your own domain there to send from @yourdomain.com.)

## Part 3 — Connect the secret keys to Netlify

In Netlify → your site → **Site settings → Environment variables**, add
these three (scope: **All scopes**, same as your existing keys):

| Name | Value |
|---|---|
| `SUPABASE_URL` | same Project URL from Part 1 step 4 |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → **service_role** key |
| `RESEND_API_KEY` | the `re_...` key from Part 2 |
| `SITE_URL` | your site address, e.g. `https://YOURSITE.netlify.app` |

Then **Trigger redeploy**.

## Done — how to check it worked

1. Open your live site → Ask A Roamer → the sidebar shows **"Join the
   community"** with a Sign in button (instead of "coming online soon").
2. Create an account, post a question.
3. From another browser (or a friend's phone), reply to it — you should
   get the notification email within a minute.
4. Untick "Email me when someone replies" in the sidebar and reply again —
   no email this time.
