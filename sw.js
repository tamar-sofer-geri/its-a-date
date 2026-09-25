// Minimal service worker: exists only to receive push events and show
// notifications while the app isn't open. No caching/offline behavior.

// Same config the page uses (Supabase URL/anon key + VAPID public key), so
// the pushsubscriptionchange handler below can re-save a renewed subscription
// without the app being open. Wrapped so a failed import can never stop the
// worker from installing and receiving pushes.
try { importScripts('config.js?v=4'); } catch (e) { /* handler below just no-ops */ }

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: "It's a Date", body: 'You have an event today!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  // A push is only ever sent when there's a real match (the function returns
  // early otherwise), so any push arriving means the icon should show a
  // badge - this runs whether or not the app is open.
  if (self.registration.setAppBadge) {
    self.registration.setAppBadge(1).catch(() => {});
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "It's a Date", {
      body: data.body || '',
      icon: 'apple-touch-icon.png?v=1',
      badge: 'apple-touch-icon.png?v=1',
      tag: data.tag || 'its-a-date-reminder',
      // Keeps the notification visible until dismissed instead of
      // auto-collapsing after a few seconds. Chrome desktop honors this;
      // Android's own notification-shade behavior isn't affected by it
      // either way (the heads-up banner auto-collapsing is the OS's own
      // behavior for all apps, not something a site can extend), but the
      // notification itself stays in the shade regardless until swiped away.
      requireInteraction: true,
      data: { url: data.url || './' },
    })
  );
});

// The browser fired this because it invalidated/renewed our push subscription
// (its endpoint changes, and the old one starts returning 410 Gone). Without
// handling it, the server keeps the dead endpoint until a scheduled send
// discovers it - by which point the reminder is already lost.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const cfg = self.ITSADATE_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !cfg.vapidPublicKey) return;

    const headers = {
      apikey: cfg.supabaseAnonKey,
      Authorization: 'Bearer ' + cfg.supabaseAnonKey,
      'Content-Type': 'application/json',
    };
    const rest = (path, init) => fetch(cfg.supabaseUrl + '/rest/v1/' + path, { headers, ...init });

    const oldEndpoint = event.oldSubscription && event.oldSubscription.endpoint;
    let sub = event.newSubscription;
    if (!sub) {
      sub = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(cfg.vapidPublicKey),
      });
    }
    const json = sub.toJSON();

    await rest('push_subscriptions?on_conflict=endpoint', {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth }),
    });
    await rest('push_events', {
      method: 'POST',
      body: JSON.stringify({
        endpoint: json.endpoint,
        event: 'subscription_change_event',
        detail: 'replaced ' + (oldEndpoint ? oldEndpoint.slice(-14) : '(unknown)'),
      }),
    });
    if (oldEndpoint && oldEndpoint !== json.endpoint) {
      await rest('push_subscriptions?endpoint=eq.' + encodeURIComponent(oldEndpoint), { method: 'DELETE' });
    }
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (self.registration.clearAppBadge) {
    self.registration.clearAppBadge().catch(() => {});
  }
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
