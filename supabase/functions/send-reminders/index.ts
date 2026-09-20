// Runs twice a day (via two Supabase Cron Jobs) to push a reminder for any
// entry in `dates` whose month/day match the target date, to every
// subscribed device. Called with no query string (or ?when=today) for the
// morning-of check, and ?when=tomorrow for a heads-up the night before.
//
// Dates are evaluated in America/Los_Angeles, not the server's UTC clock -
// otherwise the ?when=tomorrow run at 10pm Pacific (already past midnight
// UTC) would compute the wrong day.
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

function pacificMonthDay(offsetDays: number) {
  const shifted = new Date(Date.now() + offsetDays * 86400000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "numeric",
    day: "numeric",
  }).formatToParts(shifted);
  return {
    month: Number(parts.find((p) => p.type === "month")!.value),
    day: Number(parts.find((p) => p.type === "day")!.value),
  };
}

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization") || "";
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const isTomorrow = url.searchParams.get("when") === "tomorrow";
  const { month, day } = pacificMonthDay(isTomorrow ? 1 : 0);
  const when = isTomorrow ? "Tomorrow" : "Today";

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: matches, error: datesError } = await supabase
    .from("dates")
    .select("*")
    .eq("month", month)
    .eq("day", day);

  if (datesError) {
    return new Response(JSON.stringify({ error: datesError.message }), { status: 500 });
  }
  if (!matches || matches.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: `no events ${when.toLowerCase()}` }));
  }

  const { data: subs, error: subsError } = await supabase.from("push_subscriptions").select("*");
  if (subsError) {
    return new Response(JSON.stringify({ error: subsError.message }), { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: "no subscriptions" }));
  }

  const body =
    matches.length === 1
      ? `${when}: ${matches[0].name}'s ${(matches[0].label || "Birthday").toLowerCase()}!`
      : `${when}: ${matches.map((d) => d.name).join(", ")}`;

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

  return new Response(JSON.stringify({ sent, events: matches.length, when }));
});
