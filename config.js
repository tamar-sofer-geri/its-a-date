/* Supabase connection settings.
 *
 * Paste your project's values below. Both are safe to commit:
 * the anon key is a public client key, and access is governed by the
 * table's Row Level Security policies.
 *
 *   Project Settings -> Data API (or the "Connect" button) => Project URL => supabaseUrl
 *   Project Settings -> API Keys                                => anon / public => supabaseAnonKey
 *
 * Leave them blank to run in local-only mode (no cross-device sync, and no
 * push reminders - those need a backend to check dates and send pushes
 * while the app isn't open). See README.md "Push reminders" for setup.
 *
 * vapidPublicKey is also safe to commit - it's the public half of the
 * VAPID keypair used to authorize push subscriptions. Leave it blank to
 * disable the reminders feature even when Supabase is configured.
 */
// `self` (not `window`) so sw.js can importScripts() this same file.
(typeof window !== 'undefined' ? window : self).ITSADATE_CONFIG = {
  supabaseUrl: "https://vnxmckzbtygyeswfucnw.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueG1ja3pidHlneWVzd2Z1Y253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzE0OTMsImV4cCI6MjEwNTQ0NzQ5M30.GfIcEwZitWpbmkn4duM9n4rWHacz1ibicIA5HN0fhDI",
  vapidPublicKey: "BNTbPGSb3nCyuoKm7NO5oGrmJTcdEzxWrFExI8rb9ReHFDZX_6zBWahFJLQgnAxriUec7ELQmJJQCymydJbNIGo"
};
