// Runs once a day (via a Supabase Cron Job) to push a reminder for any
// entry in `dates` whose month/day match today, to every subscribed device.
//
// Required secrets (set with `supabase secrets set NAME=value`, never
// committed to the repo):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  - the app's push keypair
//   CRON_SECRET                          - shared secret the cron job sends
//                                          as "Authorization: Bearer <secret>"
//                                          so this endpoint can't be triggered
//                                          by anyone who finds the URL
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase Edge Functions runtime.

import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const CRON_SECRET = Deno.env.get("CRON_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

webpush.setVapidDetails("mailto:noam@geri.org", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization") || "";
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const { data: todaysDates, error: datesError } = await supabase
    .from("dates")
    .select("*")
    .eq("month", month)
    .eq("day", day);

  if (datesError) {
    return new Response(JSON.stringify({ error: datesError.message }), { status: 500 });
  }
  if (!todaysDates || todaysDates.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: "no events today" }));
  }

  const { data: subs, error: subsError } = await supabase.from("push_subscriptions").select("*");
  if (subsError) {
    return new Response(JSON.stringify({ error: subsError.message }), { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: "no subscriptions" }));
  }

  const body =
    todaysDates.length === 1
      ? `Today: ${todaysDates[0].name}'s ${(todaysDates[0].label || "Birthday").toLowerCase()}!`
      : `Today: ${todaysDates.map((d) => d.name).join(", ")}`;

  const payload = JSON.stringify({ title: "It's a Date", body, url: "./" });

  let sent = 0;
  const staleEndpoints: string[] = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (err) {
      if (err && (err.statusCode === 404 || err.statusCode === 410)) {
        staleEndpoints.push(sub.endpoint);
      } else {
        console.error("push failed for", sub.endpoint, err);
      }
    }
  }

  if (staleEndpoints.length) {
    await supabase.from("push_subscriptions").delete().in("endpoint", staleEndpoints);
  }

  return new Response(JSON.stringify({ sent, events: todaysDates.length }));
});
