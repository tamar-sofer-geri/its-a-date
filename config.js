/* Supabase connection settings.
 *
 * Paste your project's values below. Both are safe to commit:
 * the anon key is a public client key, and access is governed by the
 * table's Row Level Security policies.
 *
 *   Project Settings -> API -> Project URL       => supabaseUrl
 *   Project Settings -> API -> Project API keys  => anon / public => supabaseAnonKey
 *
 * Leave them blank to run in local-only mode (no cross-device sync, and no
 * push reminders - those need a backend to check dates and send pushes
 * while the app isn't open). See README.md "Push reminders" for setup.
 *
 * vapidPublicKey is also safe to commit - it's the public half of the
 * VAPID keypair used to authorize push subscriptions. Leave it blank to
 * disable the reminders feature even when Supabase is configured.
 */
window.ITSADATE_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  vapidPublicKey: "BNTbPGSb3nCyuoKm7NO5oGrmJTcdEzxWrFExI8rb9ReHFDZX_6zBWahFJLQgnAxriUec7ELQmJJQCymydJbNIGo"
};
