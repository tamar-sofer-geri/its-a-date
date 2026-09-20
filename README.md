# 🎂 It's a Date

A mobile-friendly web app to keep birthdays and anniversaries in one place — sorted chronologically (soonest first), color-coded by group, with anything coming up within a week highlighted. No build step — plain HTML/CSS/JavaScript, deployable to GitHub Pages.

One unified list instead of separate tabs per group, since the whole point is seeing everything together. A row of filter chips — **All**, **Framily** (purple), **Sofers** (blue), **Geris** (orange), **Friends** (red), **Dia-birthdays** (light blue) — narrows the same list down to one group. A person can belong to more than one group (e.g. someone who's both Framily and Geris) and still only shows up once in **All**; the edit form's group picker is a set of checkboxes rather than a single choice. The group tag(s) on each row only show up in the **All** view, since they're redundant once you've filtered. Tap a date to edit its name, month/day/year, groups, or occasion (Birthday / Anniversary / Dia-birthday, from a dropdown), or to delete it — or swipe a row right to delete it directly from the list (a brief **Undo** bar lets you reverse it for a few seconds). Tap **+** to add a new one.

Each entry shows an icon based on its occasion — 🎂 for birthdays, 🥂 for anniversaries, 💉 for dia-birthdays — which doubles as a button that opens a pre-filled "Add to Google Calendar" link (one click, no sign-in needed) so you can mirror any date onto your own calendar; saving a new date also offers this immediately. Any entry with a year on file shows the count next to its name — age for a birthday, years for an anniversary or dia-birthday (e.g. "Negev Geri 22") — note this is only as accurate as the year in the source data, which for some contacts is just the year the calendar entry was created rather than an actual birth year.

If a birthday falls today, opening the app runs a brief confetti/balloon celebration with the person's name floating across the screen, colored to match their group. A 🔔 button in the header (shown once Supabase + a VAPID key are configured — see **Push reminders** below) lets a device subscribe to a daily push notification for anything happening that day, so you don't have to open the app to be reminded.

## Starting data

Seeded from two Google "Birthdays" calendar exports (one per account) — 110 birthdays/anniversaries combined, auto-sorted into groups by surname (Simon/Schwarz/Hamam/Katznelson → Framily, Sofer/Rubel → Sofers, Geri → Geris, everyone else → Friends for now), plus a hand-picked Dia-birthdays group for a few diagnosis-anniversary dates. Family-cluster calendar entries (e.g. "Kid: Parent's Name") are split into one entry per person. These seed automatically the first time the app runs — in local-only mode via `localStorage`, or in Supabase mode via the app itself if the `dates` table is empty on first load — and a small batch-tracking mechanism (`SEED_BATCHES` in `app.js`) lets a later import add itself to devices that already seeded earlier batches, without duplicating them. Since groups are editable on every entry, misfiled people can be moved (or added to more groups) any time.

## Configuration

Backend connection lives in `config.js`:

```js
window.ITSADATE_CONFIG = {
  supabaseUrl: "https://<project>.supabase.co",
  supabaseAnonKey: "<anon public key>",
  vapidPublicKey: "<public half of the push keypair, see Push reminders below>"
};
```

Leave `supabaseUrl`/`supabaseAnonKey` blank to run in **local-only mode** (this device only, no sync, no push reminders — the default as shipped). `vapidPublicKey` only matters once Supabase is configured; leave it blank to keep Supabase sync without the reminders feature.

### Database schema

To enable multi-device sync, create a Supabase project and run this once in its SQL editor:

```sql
create table if not exists public.dates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  month int not null check (month between 1 and 12),
  day int not null check (day between 1 and 31),
  year int,
  groups text[] not null,
  label text not null default 'Birthday',
  created_at timestamptz not null default now()
);
alter table public.dates enable row level security;
create policy "public read"   on public.dates for select using (true);
create policy "public insert" on public.dates for insert with check (true);
create policy "public update" on public.dates for update using (true) with check (true);
create policy "public delete" on public.dates for delete using (true);
alter publication supabase_realtime add table public.dates;
```

Then paste the project's URL and anon key into `config.js`. The app will seed the *empty* table from whatever is already in this device's `localStorage` on first load (falling back to the built-in starting list if that's empty too) — so switching a device that's already been used over to Supabase won't lose any edits made before it was connected.

> Access is currently **open** (anyone with the app can read/write). To lock it down later, tighten these policies or add Supabase Auth.

## Push reminders

Requires Supabase to already be configured above — the daily check needs a database it can query, since it runs on a schedule with nobody's phone open.

**1. Create the subscriptions table** (SQL editor, once):

```sql
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "public read"   on public.push_subscriptions for select using (true);
create policy "public insert" on public.push_subscriptions for insert with check (true);
create policy "public update" on public.push_subscriptions for update using (true) with check (true);
create policy "public delete" on public.push_subscriptions for delete using (true);
```

> All four policies matter even though the client only ever inserts/upserts/deletes: the client's upsert (insert-or-update on a repeat subscribe) is implemented as `INSERT ... ON CONFLICT DO UPDATE`, and Postgres's RLS needs both the **select** policy (to check for an existing conflicting row) and the **update** policy (to authorize the DO UPDATE path) for that statement to succeed at all — even on a subscription's very first save, when there's no actual conflict yet.

**2. Generate a VAPID keypair** — a public/private key pair the app uses to authorize its own push messages. Anyone with `web-push` installed can run `npx web-push generate-vapid-keys`, or use OpenSSL. Put the **public** key in `config.js` (`vapidPublicKey` — safe to commit). The **private** key is a real secret: never put it in a file in this repo — only paste it into the Edge Function's secrets in step 4.

**3. Install the Supabase CLI and link this repo to your project** (once):

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

**4. Set the function's secrets** (the private key from step 2, plus a random string you make up for `CRON_SECRET` — e.g. `openssl rand -hex 32` — used so only your own scheduled job can trigger it):

```bash
npx supabase secrets set VAPID_PUBLIC_KEY="<public key>" VAPID_PRIVATE_KEY="<private key>" CRON_SECRET="<random string>"
```

**5. Deploy the function** (code lives in `supabase/functions/send-reminders/index.ts`):

```bash
npx supabase functions deploy send-reminders --no-verify-jwt
```

**6. Schedule it to run daily** — easiest via the Supabase Dashboard's **Edge Functions → send-reminders → Cron** tab (pick a time), making sure to add an `Authorization: Bearer <CRON_SECRET>` header in the schedule's request config. Or via SQL, if `pg_cron`/`pg_net` are enabled for your project (**Database → Extensions**):

```sql
select cron.schedule(
  'send-daily-reminders',
  '0 13 * * *', -- UTC; adjust for your timezone and preferred time of day
  $$
  select net.http_post(
    url := 'https://<your-project-ref>.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>')
  );
  $$
);
```

**7. On your phone**, open the app and tap the 🔔 in the header to grant notification permission and subscribe this device. Repeat on any other device you want reminders on — each one subscribes independently.

Notes:
- Android only for now (per the app's current setup) — Chrome on Android supports push from a regular installed PWA. iOS needs the app added to the home screen first (iOS 16.4+) and has historically been less reliable.
- Uninstalling the app, clearing site data, or the browser expiring a subscription will silently stop that device's reminders; the function prunes subscriptions it finds are dead when it tries to send to them.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Create a new GitHub repo and push this folder to it.
2. In the repo's **Settings → Pages**, set the source to the `main` branch, root folder.
3. The `.nojekyll` file is already included so GitHub Pages serves the files as-is.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Header, filter chips, chronological list, add/edit modal, saved-toast |
| `styles.css` | Rainbow group colors, mobile-first styling |
| `app.js` | Supabase data access, real-time sync, localStorage fallback, date math, rendering, Google Calendar link generation |
| `config.js` | Supabase URL + anon key + VAPID public key (blank = local-only mode / no reminders) |
| `sw.js` | Service worker — receives push events and shows the notification while the app isn't open |
| `supabase/functions/send-reminders/index.ts` | Edge Function, deployed separately, run on a daily schedule to send the actual reminders |
| `manifest.webmanifest`, `icon.svg`, `icon-maskable.svg`, `apple-touch-icon.png`, `icon-maskable-512.png` | Home-screen install support |
