# 🎂 It's a Date

A mobile-friendly web app to keep birthdays and anniversaries in one place — sorted chronologically (soonest first), color-coded by group, with anything coming up within a week highlighted. No build step — plain HTML/CSS/JavaScript, deployable to GitHub Pages.

One unified list instead of separate tabs per group, since the whole point is seeing everything together. A row of filter chips — **All**, **Yoga**, **Sofers**, **Geris**, **Friends**, **Dia-birthdays** — narrows the same list down to one group. Tap a date to edit its name, month/day/year, group, or occasion label, or to delete it. Tap **+** to add a new one. Every entry has a small 📅 button that opens a pre-filled "Add to Google Calendar" link (one click, no sign-in needed) so you can mirror any date onto your own calendar; saving a new date also offers this immediately.

## Starting data

Seeded from an export of a Google "Birthdays" calendar — 54 birthdays/anniversaries, auto-sorted into groups by surname (Simon/Schwarz/Hamam/Katznelson → Yoga, Sofer/Rubel → Sofers, Geri → Geris, Ben Ari family diagnosis dates → Dia-birthdays, everyone else → Friends for now). These seed automatically the first time the app runs — in local-only mode via `localStorage`, or in Supabase mode via the app itself if the `dates` table is empty on first load. No manual insert needed. Since group is an editable field on every entry, misfiled people can be moved any time.

## Configuration

Backend connection lives in `config.js`:

```js
window.ITSADATE_CONFIG = {
  supabaseUrl: "https://<project>.supabase.co",
  supabaseAnonKey: "<anon public key>"
};
```

Leave both blank to run in **local-only mode** (this device only, no sync — the default as shipped).

### Database schema

To enable multi-device sync, create a Supabase project and run this once in its SQL editor:

```sql
create table if not exists public.dates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  month int not null check (month between 1 and 12),
  day int not null check (day between 1 and 31),
  year int,
  group_name text not null,
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

Then paste the project's URL and anon key into `config.js`. The app will seed the starting dates into the empty table automatically on first load.

> Access is currently **open** (anyone with the app can read/write). To lock it down later, tighten these policies or add Supabase Auth.

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
| `config.js` | Supabase URL + anon key (blank = local-only mode) |
| `manifest.webmanifest`, `icon.svg`, `icon-maskable.svg`, `apple-touch-icon.png`, `icon-maskable-512.png` | Home-screen install support |
