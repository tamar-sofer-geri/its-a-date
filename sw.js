// Minimal service worker: exists only to receive push events and show
// notifications while the app isn't open. No caching/offline behavior.

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
