(function () {
  'use strict';

  const GROUPS = ['Framily', 'Sofers', 'Geris', 'Friends', 'Dia-birthdays'];
  const GROUP_COLORS = {
    Framily: '#9c36b5',
    Sofers: '#1971c2',
    Geris: '#f08c00',
    Friends: '#e03131',
    'Dia-birthdays': '#4dabf7',
  };
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const STORAGE_KEY = 'its-a-date-entries-v1';
  const UPCOMING_WINDOW_DAYS = 7;

  const SEED_ENTRIES = [
    { name: "Tia Geri", month: 1, day: 8, year: 2009, groups: ["Dia-birthdays"], label: "Dia-birthday" },
    { name: "Benjamin Colton Robb", month: 1, day: 8, year: 2009, groups: ["Dia-birthdays"], label: "Dia-birthday" },
    { name: "Jairi Vargas", month: 1, day: 8, year: 2013, groups: ["Dia-birthdays"], label: "Dia-birthday" },
    { name: "Shlomi Cahlon", month: 1, day: 11, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Dr. Saleh Adi", month: 1, day: 12, year: 1961, groups: ["Friends"], label: "Birthday" },
    { name: "Gadi Ponte", month: 1, day: 20, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Delali Bruce", month: 1, day: 25, year: 2004, groups: ["Friends"], label: "Birthday" },
    { name: "Melissa and Michael Riordan", month: 1, day: 29, year: 2013, groups: ["Friends"], label: "Birthday" },
    { name: "Motti Hamam", month: 2, day: 1, year: 2023, groups: ["Framily"], label: "Birthday" },
    { name: "Elizabeth McCracken", month: 2, day: 17, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Henriette Ponte", month: 2, day: 18, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Noa Geri", month: 2, day: 19, year: 2000, groups: ["Geris"], label: "Birthday" },
    { name: "Tia Geri", month: 3, day: 3, year: 2000, groups: ["Geris"], label: "Birthday" },
    { name: "Adam Lasher", month: 3, day: 14, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Nancy Nagel", month: 3, day: 15, year: 2009, groups: ["Friends"], label: "Birthday" },
    { name: "Hilary Brehaut", month: 3, day: 20, year: 2009, groups: ["Friends"], label: "Birthday" },
    { name: "Yoram Barak", month: 3, day: 28, year: 2026, groups: ["Friends"], label: "Birthday" },
    { name: "Yali Schwarz", month: 4, day: 7, year: 2000, groups: ["Framily"], label: "Birthday" },
    { name: "Irit Avidov-Shachrur", month: 4, day: 14, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Neta Simon", month: 4, day: 18, year: 1998, groups: ["Framily"], label: "Birthday" },
    { name: "Benjamin Colton Robb", month: 4, day: 28, year: 1999, groups: ["Friends"], label: "Birthday" },
    { name: "Jairi Vargas", month: 5, day: 12, year: 2004, groups: ["Friends"], label: "Birthday" },
    { name: "Jennifer Makower", month: 5, day: 12, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Shiri Eshed-Shahar", month: 5, day: 16, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Sheer Hamam", month: 5, day: 26, year: 2005, groups: ["Framily"], label: "Birthday" },
    { name: "Noam", month: 6, day: 11, year: 1998, groups: ["Friends"], label: "Birthday" },
    { name: "Barbara Marom Pollack", month: 6, day: 23, year: 1947, groups: ["Friends"], label: "Birthday" },
    { name: "Mechal Ben Ari", month: 6, day: 24, year: 1993, groups: ["Friends"], label: "Anniversary" },
    { name: "Natsumi Mori", month: 7, day: 12, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Ido Simon", month: 7, day: 14, year: 1995, groups: ["Framily"], label: "Birthday" },
    { name: "Mike Sands", month: 7, day: 14, year: 1955, groups: ["Friends"], label: "Birthday" },
    { name: "Ellie Schwarz", month: 7, day: 16, year: 2003, groups: ["Framily"], label: "Birthday" },
    { name: "Nick Cuttriss", month: 7, day: 16, year: 1980, groups: ["Friends"], label: "Birthday" },
    { name: "Shlomi", month: 7, day: 16, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Ty Geri", month: 7, day: 27, year: 1998, groups: ["Geris"], label: "Birthday" },
    { name: "Omer", month: 8, day: 5, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Efrat Bigman-Volk", month: 8, day: 5, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Patrick Mertes", month: 8, day: 17, year: 2022, groups: ["Friends"], label: "Birthday" },
    { name: "Ariel Spivak", month: 9, day: 2, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Abby Twoy", month: 9, day: 30, year: 2000, groups: ["Friends"], label: "Birthday" },
    { name: "Cambria", month: 10, day: 6, year: 1997, groups: ["Friends"], label: "Birthday" },
    { name: "Ma'ayan", month: 10, day: 22, year: 2002, groups: ["Friends"], label: "Birthday" },
    { name: "Adina", month: 10, day: 24, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Beth Sorenson", month: 10, day: 26, year: 1976, groups: ["Friends"], label: "Birthday" },
    { name: "Juyi Spivak", month: 10, day: 29, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Noa Simon", month: 10, day: 31, year: 2003, groups: ["Framily"], label: "Birthday" },
    { name: "Mechal Ben Ari", month: 11, day: 6, year: 1968, groups: ["Friends"], label: "Birthday" },
    { name: "Sharon Hoffman", month: 11, day: 6, year: 1970, groups: ["Friends"], label: "Birthday" },
    { name: "Zoe Geri", month: 11, day: 8, year: 1994, groups: ["Geris"], label: "Birthday" },
    { name: "Ed Damiano", month: 11, day: 30, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Smadar Sweiry", month: 12, day: 1, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Larry Katznelson", month: 12, day: 3, year: 2023, groups: ["Framily"], label: "Birthday" },
    { name: "Laura Myszne", month: 12, day: 25, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Jonathan Rubel, JR.", month: 12, day: 29, year: 1964, groups: ["Sofers"], label: "Birthday" }
  ];

  // Second batch: imported from a birthdays calendar on a different account.
  // Kept separate from SEED_ENTRIES so applyNewSeedBatches() can add these to
  // installs that already seeded the first batch, without duplicating it.
  const SEED_ENTRIES_2 = [
    { name: "Faina Prager", month: 1, day: 7, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Tamar Sofer-Geri", month: 1, day: 11, year: 1968, groups: ["Friends"], label: "Birthday" },
    { name: "Wendy Geri", month: 1, day: 26, year: 2023, groups: ["Geris"], label: "Anniversary" },
    { name: "Christina & Phillip Mills Leslie", month: 2, day: 10, year: 2010, groups: ["Friends"], label: "Birthday" },
    { name: "Yael Geri", month: 2, day: 19, year: 2000, groups: ["Geris"], label: "Birthday" },
    { name: "Harper", month: 2, day: 24, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Laura Geri", month: 2, day: 27, year: 1965, groups: ["Geris"], label: "Birthday" },
    { name: "Aretha Fiebig", month: 2, day: 28, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Eleanor", month: 3, day: 13, year: 2026, groups: ["Friends"], label: "Birthday" },
    { name: "Ilan Geri", month: 3, day: 17, year: 1962, groups: ["Geris"], label: "Birthday" },
    { name: "Ellen Waxman", month: 3, day: 21, year: 2009, groups: ["Friends"], label: "Birthday" },
    { name: "Nomi Sofer", month: 4, day: 2, year: 1966, groups: ["Sofers"], label: "Birthday" },
    { name: "Chen Hamam", month: 5, day: 4, year: 2024, groups: ["Framily"], label: "Birthday" },
    { name: "Amalia", month: 5, day: 12, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Tracy Weatherby", month: 5, day: 16, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Tess Geri", month: 5, day: 20, year: 1996, groups: ["Geris"], label: "Birthday" },
    { name: "Yoav", month: 5, day: 21, year: 2004, groups: ["Friends"], label: "Birthday" },
    { name: "Laura Geri", month: 5, day: 24, year: 2023, groups: ["Geris"], label: "Anniversary" },
    { name: "Miriam Klein", month: 7, day: 6, year: 1948, groups: ["Friends"], label: "Birthday" },
    { name: "Renana Barak", month: 7, day: 8, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Doron Simon", month: 8, day: 1, year: 1965, groups: ["Framily"], label: "Birthday" },
    { name: "Camille Morhardt", month: 8, day: 6, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Batya Sella Razon", month: 8, day: 7, year: 2024, groups: ["Friends"], label: "Anniversary" },
    { name: "Sarit Bentov Schwarz", month: 8, day: 17, year: 2024, groups: ["Framily"], label: "Anniversary" },
    { name: "Tess Geri", month: 8, day: 18, year: 2022, groups: ["Geris"], label: "Anniversary" },
    { name: "Chen Hamam", month: 8, day: 27, year: 1999, groups: ["Framily"], label: "Anniversary" },
    { name: "Sarit Bentov Schwarz", month: 9, day: 1, year: 2024, groups: ["Framily"], label: "Birthday" },
    { name: "Bev Alpert", month: 9, day: 4, year: 2025, groups: ["Friends"], label: "Anniversary" },
    { name: "Wendy Geri", month: 9, day: 18, year: 1938, groups: ["Geris"], label: "Birthday" },
    { name: "Miriam Klein", month: 9, day: 18, year: 2025, groups: ["Friends"], label: "Anniversary" },
    { name: "Myron Sofer", month: 9, day: 18, year: 2025, groups: ["Sofers"], label: "Anniversary" },
    { name: "Katie Craft", month: 9, day: 21, year: 1987, groups: ["Friends"], label: "Birthday" },
    { name: "Danielle Harel", month: 9, day: 26, year: 1970, groups: ["Friends"], label: "Birthday" },
    { name: "Miko & Dan O'leary Yamaguchi", month: 9, day: 28, year: 2009, groups: ["Friends"], label: "Birthday" },
    { name: "Roni Greif", month: 10, day: 3, year: 1991, groups: ["Friends"], label: "Anniversary" },
    { name: "Negev Geri", month: 10, day: 4, year: 2004, groups: ["Geris"], label: "Birthday" },
    { name: "Ariel Geri", month: 10, day: 8, year: 1995, groups: ["Geris"], label: "Birthday" },
    { name: "Danny Tice", month: 10, day: 11, year: 2004, groups: ["Friends"], label: "Birthday" },
    { name: "Ophir", month: 10, day: 13, year: 2000, groups: ["Friends"], label: "Birthday" },
    { name: "Bev Alpert", month: 10, day: 21, year: 2025, groups: ["Friends"], label: "Birthday" },
    { name: "Hadar", month: 10, day: 30, year: 2000, groups: ["Friends"], label: "Birthday" },
    { name: "Stephen Geri", month: 10, day: 31, year: 1960, groups: ["Geris"], label: "Birthday" },
    { name: "Barbara Marom Pollack", month: 11, day: 2, year: 1947, groups: ["Friends"], label: "Birthday" },
    { name: "Ma'ayan", month: 11, day: 4, year: 2006, groups: ["Friends"], label: "Birthday" },
    { name: "Yaara", month: 11, day: 4, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Greer", month: 11, day: 8, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Joanne Robb", month: 11, day: 11, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Galit Simon", month: 11, day: 12, year: 2024, groups: ["Framily"], label: "Birthday" },
    { name: "Yaron", month: 11, day: 24, year: 2024, groups: ["Friends"], label: "Birthday" },
    { name: "Shakaed", month: 11, day: 25, year: 1996, groups: ["Friends"], label: "Birthday" },
    { name: "Jeffrey Geri", month: 11, day: 26, year: 2011, groups: ["Geris"], label: "Birthday" },
    { name: "Roni Greif", month: 12, day: 11, year: 1967, groups: ["Friends"], label: "Birthday" },
    { name: "Shuli Geri", month: 12, day: 11, year: 2023, groups: ["Geris"], label: "Birthday" },
    { name: "Batya Sella Razon", month: 12, day: 30, year: 1968, groups: ["Friends"], label: "Birthday" },
    { name: "Sean", month: 12, day: 30, year: 2023, groups: ["Friends"], label: "Birthday" },
    { name: "Sheryl Klein", month: 12, day: 31, year: 1965, groups: ["Friends"], label: "Birthday" }
  ];

  const config = window.ITSADATE_CONFIG || {};
  const useSupabase = !!(config.supabaseUrl && config.supabaseAnonKey);
  const canUsePush = useSupabase && !!config.vapidPublicKey && 'serviceWorker' in navigator && 'PushManager' in window;
  let supabase = null;
  let entries = [];
  let activeFilter = 'all';
  let swRegistration = null;

  const entryList = document.getElementById('entry-list');
  const emptyState = document.getElementById('empty-state');
  const filterChips = document.getElementById('filter-chips');
  const notifBtn = document.getElementById('notif-btn');

  // ---------- Styled confirm dialog (replaces window.confirm) ----------
  const confirmModal = document.getElementById('confirm-modal');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmOkBtn = document.getElementById('confirm-ok-btn');

  function showConfirm(message, okLabel) {
    return new Promise((resolve) => {
      confirmMessage.textContent = message;
      confirmOkBtn.textContent = okLabel || 'OK';
      confirmModal.hidden = false;

      function finish(result) {
        confirmModal.hidden = true;
        confirmOkBtn.removeEventListener('click', onOk);
        confirmModal.querySelectorAll('[data-confirm-cancel]').forEach((el) => el.removeEventListener('click', onCancel));
        resolve(result);
      }
      function onOk() { finish(true); }
      function onCancel() { finish(false); }

      confirmOkBtn.addEventListener('click', onOk);
      confirmModal.querySelectorAll('[data-confirm-cancel]').forEach((el) => el.addEventListener('click', onCancel));
    });
  }

  function uid() {
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function daysInMonth(month, year) {
    return new Date(year || 2024, month, 0).getDate();
  }

  // ---------- Date math ----------
  function todayMidnight() {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }

  function nextOccurrence(month, day) {
    const today = todayMidnight();
    const thisYear = today.getFullYear();
    let candidate = new Date(thisYear, month - 1, day);
    candidate.setHours(0, 0, 0, 0);
    if (candidate < today) {
      candidate = new Date(thisYear + 1, month - 1, day);
      candidate.setHours(0, 0, 0, 0);
    }
    return candidate;
  }

  function daysUntil(date) {
    return Math.round((date - todayMidnight()) / 86400000);
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatYYYYMMDD(date) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
  }

  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  function gcalUrl(entry) {
    const start = nextOccurrence(entry.month, entry.day);
    const end = addDays(start, 1);
    const text = encodeURIComponent(`${entry.name} — ${entry.label || 'Birthday'}`);
    const details = encodeURIComponent("Added from It's a Date");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatYYYYMMDD(start)}/${formatYYYYMMDD(end)}&recur=RRULE:FREQ=YEARLY&details=${details}`;
  }

  function setEntryIcon(btn, label) {
    const l = label.toLowerCase();
    btn.classList.remove('icon-birthday', 'icon-anniversary', 'icon-dia');
    if (l === 'anniversary') {
      btn.textContent = '🥂';
      btn.classList.add('icon-anniversary');
    } else if (l.includes('dia')) {
      btn.textContent = '💉';
      btn.classList.add('icon-dia');
    } else {
      btn.textContent = '🎂';
      btn.classList.add('icon-birthday');
    }
  }

  // Each entry here is a seed batch imported at a different time. Extend this
  // array (never edit past entries) when importing another calendar, so
  // installs that already have earlier batches only pick up the new one.
  const SEED_BATCHES = [SEED_ENTRIES, SEED_ENTRIES_2];
  const ALL_SEED_ENTRIES = SEED_BATCHES.flat();
  const SEED_BATCH_KEY = 'its-a-date-seed-batch-v1';

  // ---------- Backend: local storage ----------
  function applyNewSeedBatches(entries) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const storedBatch = localStorage.getItem(SEED_BATCH_KEY);
    // A device that already has entries but no batch marker got them from the
    // pre-migration code, which only ever seeded SEED_BATCHES[0].
    let appliedBatch = storedBatch !== null ? Number(storedBatch) : (raw === null ? 0 : 1);
    let changed = false;
    for (let i = appliedBatch; i < SEED_BATCHES.length; i++) {
      SEED_BATCHES[i].forEach((e) => entries.push({ id: uid(), ...e }));
      changed = true;
    }
    if (changed) {
      localStorage.setItem(SEED_BATCH_KEY, String(SEED_BATCHES.length));
    }
    return changed;
  }

  // Devices that seeded before groups became multi-select stored a single
  // `group` string per entry. Fold it into the new `groups` array in place.
  function migrateSingularGroup(entries) {
    let changed = false;
    entries.forEach((e) => {
      if (!e.groups) {
        e.groups = e.group ? [e.group] : ['Friends'];
        delete e.group;
        changed = true;
      }
    });
    return changed;
  }

  // Group names that were renamed after some devices already had entries
  // tagged with the old name. Extend this map (never remove old entries)
  // whenever a group gets renamed again.
  const GROUP_RENAMES = { Yoga: 'Framily' };
  function renameLegacyGroups(entries) {
    let changed = false;
    entries.forEach((e) => {
      e.groups.forEach((g, i) => {
        if (GROUP_RENAMES[g]) {
          e.groups[i] = GROUP_RENAMES[g];
          changed = true;
        }
      });
    });
    return changed;
  }

  function localLoad() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let entries = [];
    if (raw !== null) {
      try {
        entries = JSON.parse(raw) || [];
      } catch (e) {
        entries = [];
      }
    }
    const batchesChanged = applyNewSeedBatches(entries);
    const groupsChanged = migrateSingularGroup(entries);
    const renamedChanged = renameLegacyGroups(entries);
    if (raw === null || batchesChanged || groupsChanged || renamedChanged) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
    return entries;
  }
  function localSave(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ---------- Backend: supabase ----------
  function fromRow(row) {
    return { id: row.id, name: row.name, month: row.month, day: row.day, year: row.year, groups: row.groups, label: row.label };
  }
  function toRow(entry) {
    return { name: entry.name, month: entry.month, day: entry.day, year: entry.year, groups: entry.groups, label: entry.label };
  }

  async function refetchFromSupabase() {
    const { data, error } = await supabase.from('dates').select('*');
    if (error) throw error;
    if (!data.length) {
      // Seed from whatever's already in localStorage on this device (which
      // may include edits made before Supabase was configured) rather than
      // the static seed list, so switching backends never loses real data.
      // On a brand-new device with nothing local yet, localLoad() itself
      // falls back to the static seed.
      const seedSource = localLoad();
      const { error: insErr } = await supabase.from('dates').insert(seedSource.map(toRow));
      if (insErr) throw insErr;
      const again = await supabase.from('dates').select('*');
      if (again.error) throw again.error;
      entries = again.data.map(fromRow);
    } else {
      entries = data.map(fromRow);
    }
  }

  function subscribeRealtime() {
    supabase
      .channel('dates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dates' }, async () => {
        try {
          const { data, error } = await supabase.from('dates').select('*');
          if (error) throw error;
          entries = data.map(fromRow);
          render();
        } catch (err) {
          console.error(err);
        }
      })
      .subscribe();
  }

  // ---------- Init ----------
  async function init() {
    populateMonthSelect();
    populateGroupCheckboxes();
    populateLabelSelect();
    populateDaySelect(1);

    if (useSupabase) {
      supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      try {
        await refetchFromSupabase();
        subscribeRealtime();
      } catch (err) {
        console.error('Supabase init failed, falling back to local storage', err);
        entries = localLoad();
      }
    } else {
      entries = localLoad();
    }
    render();
    celebrateBirthdaysToday();
    initPush();
  }

  // ---------- Push reminders ----------
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
    return output;
  }

  function setNotifVisual(enabled) {
    notifBtn.classList.toggle('is-enabled', enabled);
    notifBtn.title = enabled ? 'Reminders on — tap to turn off' : 'Tap to enable reminders';
  }

  // Thorough check: confirms against the server, not just the browser's
  // local subscription object (which can outlive its server-side row after
  // an earlier failed save, or the reminder function pruning it as stale).
  // Only needed on page load - once *we* just created or removed the row
  // ourselves, setNotifVisual() alone is enough and avoids an extra
  // round-trip that would otherwise delay the button's feedback.
  // Records what each app-open found (permission, local vs. server state,
  // installed-app vs. browser tab) and whether Chrome swapped our endpoint
  // since last time - evidence for diagnosing why subscriptions keep dying.
  const LAST_ENDPOINT_KEY = 'its-a-date-last-endpoint';
  async function logOpenDiagnostics(sub, foundOnServer) {
    const tail = (e) => (e ? e.slice(-14) : 'none');
    let last = null;
    try { last = localStorage.getItem(LAST_ENDPOINT_KEY); } catch (e) { /* ignore */ }
    const current = sub ? sub.endpoint : null;
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    await logPushEvent(
      current || 'none',
      'app_open',
      `perm=${Notification.permission} local=${tail(current)} onServer=${foundOnServer} standalone=${standalone}`
    );
    if (last && current && last !== current) {
      await logPushEvent(current, 'endpoint_changed', `was ${tail(last)}`);
    }
    try { if (current) localStorage.setItem(LAST_ENDPOINT_KEY, current); } catch (e) { /* ignore */ }
  }

  async function refreshNotifButton() {
    if (!swRegistration) return;
    let sub = await swRegistration.pushManager.getSubscription();
    let enabled = !!sub && Notification.permission === 'granted';
    if (enabled) {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('endpoint', sub.endpoint)
        .maybeSingle();
      enabled = !error && !!data;
    }
    logOpenDiagnostics(sub, enabled).catch(() => {});

    // Self-heal: Android/Chrome can silently drop a push subscription on its
    // own (battery optimization killing the FCM connection is the common
    // cause) well before we'd otherwise notice, at the next scheduled send.
    // If permission is already granted - so no prompt is needed - quietly
    // create a fresh subscription instead of leaving reminders "off" until
    // the user happens to notice and re-tap the bell themselves.
    if (!enabled && Notification.permission === 'granted') {
      try {
        sub = await swRegistration.pushManager.getSubscription();
        if (!sub) {
          sub = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
          });
        }
        await saveSubscription(sub);
        enabled = true;
      } catch (err) {
        console.error('Auto re-subscribe failed', err);
      }
    }

    setNotifVisual(enabled);
  }

  async function logPushEvent(endpoint, event, detail) {
    const { error } = await supabase.from('push_events').insert({ endpoint, event, detail: detail || null });
    if (error) console.error('logPushEvent failed', error);
  }

  async function saveSubscription(sub) {
    const json = sub.toJSON();
    const { error } = await supabase.from('push_subscriptions').upsert(
      { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth },
      { onConflict: 'endpoint' }
    );
    if (error) {
      await logPushEvent(json.endpoint, 'save_failed', error.message);
      throw error;
    }
    await logPushEvent(json.endpoint, 'subscribed');
  }

  async function removeSubscription(endpoint) {
    await logPushEvent(endpoint, 'unsubscribed_by_user');
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
    if (error) console.error(error);
  }

  async function initPush() {
    if (!canUsePush) return;
    try {
      swRegistration = await navigator.serviceWorker.register('sw.js');
    } catch (err) {
      console.error('Service worker registration failed', err);
      return;
    }
    notifBtn.hidden = false;
    await refreshNotifButton();
  }

  let notifBusy = false;

  if (notifBtn) {
    notifBtn.addEventListener('click', async () => {
      // Ignore taps while a previous toggle is still in flight - without
      // this, a quick second tap during the (network-bound) turn-on flow
      // could land just after the button flips to "on" and get read as a
      // request to turn it back off.
      if (!swRegistration || notifBusy) return;
      notifBusy = true;
      notifBtn.disabled = true;

      try {
        // Act on what the button is actually showing, not on whether a local
        // subscription object happens to exist - those can disagree (a stale
        // local subscription whose server-side row is gone would otherwise
        // make a tap-to-enable get treated as tap-to-disable).
        const wasEnabled = notifBtn.classList.contains('is-enabled');

        if (wasEnabled) {
          if (!(await showConfirm('Turn off reminders on this device?', 'Turn off'))) return;
          const existing = await swRegistration.pushManager.getSubscription();
          if (existing) {
            await removeSubscription(existing.endpoint);
            await existing.unsubscribe();
          }
          setNotifVisual(false);
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Reminders need notification permission — you can enable it in your browser or app settings.');
          return;
        }
        let sub = null;
        try {
          // Reuse an existing local subscription if there is one (subscribing
          // again with the same key just returns it) instead of assuming we
          // need a brand new one - then make sure the server actually has it.
          sub = await swRegistration.pushManager.getSubscription();
          if (!sub) {
            sub = await swRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
            });
          }
          await saveSubscription(sub);
          setNotifVisual(true);
        } catch (err) {
          console.error('Push subscribe failed', err);
          // Don't leave a subscription the server doesn't know about - that
          // would show as "enabled" locally while never actually receiving a push.
          if (sub) await sub.unsubscribe().catch(() => {});
          setNotifVisual(false);
          const detail = (err && (err.message || err.error_description || err.name)) || String(err);
          alert('Could not enable reminders on this device:\n' + detail);
        }
      } finally {
        notifBusy = false;
        notifBtn.disabled = false;
      }
    });
  }

  // ---------- Birthday-today celebration ----------
  const CONFETTI_COLORS = ['#ff6f91', '#ffd23f', '#4dabf7', '#9c36b5', '#2f9e44', '#f08c00'];
  const celebrationOverlay = document.getElementById('celebration-overlay');

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function celebrateBirthdaysToday() {
    const todaysBirthdays = entries.filter((e) => {
      const label = (e.label || '').toLowerCase();
      return label === 'birthday' && daysUntil(nextOccurrence(e.month, e.day)) === 0;
    });
    if (!todaysBirthdays.length) return;
    launchCelebration(todaysBirthdays);
  }

  function balloonSvg(color) {
    return `<svg viewBox="0 0 40 54" width="40" height="54" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="18" ry="20" fill="${color}"/>
      <polygon points="20,40 16,46 24,46" fill="${color}"/>
      <line x1="20" y1="46" x2="20" y2="54" stroke="#8a8a8a" stroke-width="1.5"/>
    </svg>`;
  }

  function launchCelebration(people) {
    celebrationOverlay.innerHTML = '';
    celebrationOverlay.hidden = false;

    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = randomBetween(0, 100) + 'vw';
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.animationDuration = randomBetween(2.5, 4.5) + 's';
      piece.style.animationDelay = randomBetween(0, 2.5) + 's';
      celebrationOverlay.appendChild(piece);
    }

    for (let i = 0; i < 9; i++) {
      const person = people[i % people.length];
      const color = GROUP_COLORS[person.groups[0]] || '#e03131';
      const balloon = document.createElement('div');
      balloon.className = 'celebration-balloon';
      balloon.innerHTML = balloonSvg(color);
      balloon.style.left = randomBetween(0, 90) + 'vw';
      balloon.style.setProperty('--drift', randomBetween(-40, 40) + 'px');
      balloon.style.animationDuration = randomBetween(6, 9) + 's';
      balloon.style.animationDelay = randomBetween(0, 2.5) + 's';
      celebrationOverlay.appendChild(balloon);
    }

    const floaters = [];
    people.forEach((p) => {
      const color = GROUP_COLORS[p.groups[0]] || '#e03131';
      floaters.push({ text: p.name, isName: true, color });
      floaters.push({ text: p.name, isName: true, color });
      floaters.push({ text: p.name, isName: true, color });
    });
    for (let i = 0; i < 6; i++) {
      floaters.push({ text: '🎉', isName: false });
    }

    floaters.forEach((f) => {
      const el = document.createElement('div');
      el.className = 'celebration-float ' + (f.isName ? 'is-name' : 'is-emoji');
      el.textContent = f.text;
      if (f.isName) {
        el.style.background = f.color;
        el.style.color = '#fff';
      }
      el.style.top = randomBetween(8, 82) + 'vh';
      el.style.setProperty('--vdrift', randomBetween(-40, 40) + 'px');
      el.style.animationDuration = randomBetween(4.5, 7) + 's';
      el.style.animationDelay = randomBetween(0, 4) + 's';
      celebrationOverlay.appendChild(el);
    });

    setTimeout(() => {
      celebrationOverlay.hidden = true;
      celebrationOverlay.innerHTML = '';
    }, 9000);
  }

  // ---------- Mutations ----------
  async function addEntry(entry) {
    if (useSupabase) {
      const { data, error } = await supabase.from('dates').insert(toRow(entry)).select().single();
      if (error) { console.error(error); return null; }
      const saved = fromRow(data);
      entries.push(saved);
      render();
      return saved;
    }
    const saved = { id: uid(), ...entry };
    entries.push(saved);
    localSave(entries);
    render();
    return saved;
  }

  async function updateEntry(id, patch) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return null;
    Object.assign(entry, patch);
    render();
    if (useSupabase) {
      const { error } = await supabase.from('dates').update(toRow(entry)).eq('id', id);
      if (error) console.error(error);
    } else {
      localSave(entries);
    }
    return entry;
  }

  async function deleteEntry(id) {
    entries = entries.filter((e) => e.id !== id);
    render();
    if (useSupabase) {
      const { error } = await supabase.from('dates').delete().eq('id', id);
      if (error) console.error(error);
    } else {
      localSave(entries);
    }
  }

  // ---------- Rendering ----------
  function render() {
    const filtered = activeFilter === 'all' ? entries : entries.filter((e) => e.groups.includes(activeFilter));

    const withDays = filtered.map((e) => ({ entry: e, next: nextOccurrence(e.month, e.day) }));
    withDays.sort((a, b) => a.next - b.next);

    entryList.innerHTML = '';
    emptyState.hidden = withDays.length > 0;

    const thisYear = todayMidnight().getFullYear();

    withDays.forEach(({ entry, next }) => {
      const days = daysUntil(next);
      const isUpcoming = days <= UPCOMING_WINDOW_DAYS;
      const isNextYear = next.getFullYear() > thisYear;
      const primaryGroup = activeFilter === 'all' ? entry.groups[0] : activeFilter;
      const color = GROUP_COLORS[primaryGroup] || '#7d7d94';
      const label = entry.label || 'Birthday';

      const wrap = document.createElement('li');
      wrap.className = 'entry-row-wrap';

      const deleteBg = document.createElement('div');
      deleteBg.className = 'entry-row-delete-bg';
      deleteBg.textContent = 'Delete';
      deleteBg.setAttribute('aria-hidden', 'true');

      const row = document.createElement('div');
      row.className = 'entry-row' + (isUpcoming ? ' is-upcoming' : '') + (isNextYear ? ' is-next-year' : '');
      row.style.setProperty('--group-color', color);
      row.addEventListener('click', () => {
        if (row.dataset.swiped) { delete row.dataset.swiped; return; }
        openEntryModal(entry);
      });

      const dateCol = document.createElement('div');
      dateCol.className = 'entry-date';
      dateCol.innerHTML = `<span class="month">${MONTH_NAMES[entry.month - 1]}</span><span class="day">${entry.day}</span>`;

      const info = document.createElement('div');
      info.className = 'entry-info';

      const nameEl = document.createElement('div');
      nameEl.className = 'entry-name';
      nameEl.textContent = entry.name;

      if (entry.year) {
        const ageEl = document.createElement('span');
        ageEl.className = 'entry-age';
        ageEl.textContent = ' ' + (next.getFullYear() - entry.year);
        nameEl.appendChild(ageEl);
      }

      const meta = document.createElement('div');
      meta.className = 'entry-meta';

      const labelEl = document.createElement('span');
      labelEl.className = 'entry-label';
      labelEl.textContent = label;
      meta.appendChild(labelEl);

      if (activeFilter === 'all') {
        entry.groups.forEach((g) => {
          const groupTag = document.createElement('span');
          groupTag.className = 'entry-group-tag';
          groupTag.style.setProperty('--group-color', GROUP_COLORS[g] || '#7d7d94');
          groupTag.textContent = g;
          meta.appendChild(groupTag);
        });
      }

      if (isUpcoming) {
        const badge = document.createElement('span');
        badge.className = 'entry-upcoming-badge';
        badge.textContent = days === 0 ? '🎉 Today!' : days === 1 ? 'Tomorrow' : `In ${days} days`;
        meta.appendChild(badge);
      }

      info.append(nameEl, meta);

      const gcalBtn = document.createElement('a');
      gcalBtn.className = 'entry-gcal-btn';
      gcalBtn.href = gcalUrl(entry);
      gcalBtn.target = '_blank';
      gcalBtn.rel = 'noopener';
      gcalBtn.setAttribute('aria-label', `Add ${entry.name} to Google Calendar`);
      setEntryIcon(gcalBtn, label);
      gcalBtn.addEventListener('click', (e) => e.stopPropagation());

      row.append(dateCol, info, gcalBtn);
      wrap.append(deleteBg, row);
      attachSwipeToDelete(row, entry);
      entryList.appendChild(wrap);
    });

    updateAppBadge();
  }

  // ---------- Home-screen icon badge ----------
  // Only does anything where the Badging API exists (desktop Chrome/Edge,
  // and installed PWAs on iOS 16.4+). Chrome for Android does NOT expose
  // navigator.setAppBadge at all - on Android the icon's dot comes solely from
  // an unread notification sitting in the shade, so there this is a no-op.
  function updateAppBadge() {
    const hasEventToday = entries.some((e) => daysUntil(nextOccurrence(e.month, e.day)) === 0);
    if (hasEventToday) {
      if ('setAppBadge' in navigator) navigator.setAppBadge(1).catch(() => {});
    } else if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
  }

  // ---------- Filter chips ----------
  filterChips.querySelectorAll('.chip').forEach((chip) => {
    chip.style.setProperty('--chip-color', GROUP_COLORS[chip.dataset.group] || '#7d7d94');
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.group;
      filterChips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      render();
    });
  });

  // ---------- Add/Edit modal ----------
  const entryModal = document.getElementById('entry-modal');
  const entryForm = document.getElementById('entry-form');
  const modalTitle = document.getElementById('modal-title');
  const nameInput = document.getElementById('name-input');
  const monthInput = document.getElementById('month-input');
  const dayInput = document.getElementById('day-input');
  const yearInput = document.getElementById('year-input');
  const groupCheckboxes = document.getElementById('group-checkboxes');
  const labelInput = document.getElementById('label-input');
  const OCCASIONS = ['Birthday', 'Anniversary', 'Dia-birthday'];
  const deleteBtn = document.getElementById('delete-btn');
  const headerAddBtn = document.getElementById('header-add-btn');

  let editingId = null;

  function populateMonthSelect() {
    monthInput.innerHTML = '';
    MONTH_NAMES.forEach((name, i) => {
      const opt = document.createElement('option');
      opt.value = String(i + 1);
      opt.textContent = name;
      monthInput.appendChild(opt);
    });
    monthInput.addEventListener('change', () => {
      const keepDay = Number(dayInput.value) || 1;
      populateDaySelect(Number(monthInput.value), keepDay);
    });
  }

  function populateDaySelect(month, keepDay) {
    const max = daysInMonth(month, Number(yearInput.value) || undefined);
    const current = keepDay || Number(dayInput.value) || 1;
    dayInput.innerHTML = '';
    for (let d = 1; d <= max; d++) {
      const opt = document.createElement('option');
      opt.value = String(d);
      opt.textContent = String(d);
      dayInput.appendChild(opt);
    }
    dayInput.value = String(Math.min(current, max));
  }

  function populateGroupCheckboxes() {
    groupCheckboxes.innerHTML = '';
    GROUPS.forEach((g) => {
      const chip = document.createElement('label');
      chip.className = 'group-chip';
      chip.style.setProperty('--chip-color', GROUP_COLORS[g] || '#7d7d94');

      const box = document.createElement('input');
      box.type = 'checkbox';
      box.value = g;

      const text = document.createElement('span');
      text.textContent = g;

      chip.append(box, text);
      groupCheckboxes.appendChild(chip);
    });
  }

  function populateLabelSelect() {
    labelInput.innerHTML = '';
    OCCASIONS.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      labelInput.appendChild(opt);
    });
  }

  function getCheckedGroups() {
    return [...groupCheckboxes.querySelectorAll('input:checked')].map((cb) => cb.value);
  }

  function setCheckedGroups(groups) {
    groupCheckboxes.querySelectorAll('input').forEach((cb) => {
      cb.checked = groups.includes(cb.value);
    });
  }

  function openEntryModal(entry) {
    editingId = entry ? entry.id : null;
    modalTitle.textContent = entry ? 'Edit date' : 'Add a date';
    deleteBtn.hidden = !entry;

    nameInput.value = entry ? entry.name : '';
    monthInput.value = String(entry ? entry.month : 1);
    populateDaySelect(Number(monthInput.value), entry ? entry.day : 1);
    yearInput.value = entry && entry.year ? entry.year : '';
    setCheckedGroups(entry ? entry.groups : ['Friends']);
    labelInput.value = entry ? entry.label : 'Birthday';

    entryModal.hidden = false;
    nameInput.focus();
  }

  headerAddBtn.addEventListener('click', () => openEntryModal(null));

  entryModal.querySelectorAll('[data-close]').forEach((el) =>
    el.addEventListener('click', () => { entryModal.hidden = true; })
  );

  entryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    const groups = getCheckedGroups();
    if (!groups.length) {
      alert('Pick at least one group.');
      return;
    }

    const patch = {
      name,
      month: Number(monthInput.value),
      day: Number(dayInput.value),
      year: yearInput.value ? Number(yearInput.value) : null,
      groups,
      label: labelInput.value || 'Birthday',
    };

    entryModal.hidden = true;

    let saved;
    if (editingId) {
      saved = await updateEntry(editingId, patch);
    } else {
      saved = await addEntry(patch);
    }
    if (saved) showSavedToast(saved);
  });

  deleteBtn.addEventListener('click', async () => {
    if (editingId && (await showConfirm('Delete this date?', 'Delete'))) {
      deleteEntry(editingId);
      entryModal.hidden = true;
    }
  });

  // ---------- Saved toast (with quick add-to-Google-Calendar) ----------
  const savedToast = document.getElementById('saved-toast');
  const savedToastText = document.getElementById('saved-toast-text');
  const savedToastGcal = document.getElementById('saved-toast-gcal');
  let toastTimer = null;

  function showSavedToast(entry) {
    undoBar.hidden = true;
    savedToastText.textContent = `Saved ${entry.name}`;
    savedToastGcal.href = gcalUrl(entry);
    savedToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { savedToast.hidden = true; }, 6000);
  }

  // ---------- Swipe-to-delete with undo ----------
  const undoBar = document.getElementById('undo-bar');
  const undoLabel = document.getElementById('undo-label');
  const undoBtn = document.getElementById('undo-btn');
  let lastDeleted = null;
  let undoTimer = null;

  function showUndoBar(entry) {
    savedToast.hidden = true;
    undoLabel.textContent = `Deleted ${entry.name}`;
    undoBar.hidden = false;
    clearTimeout(undoTimer);
    undoTimer = setTimeout(() => { undoBar.hidden = true; lastDeleted = null; }, 6000);
  }

  async function swipeDeleteEntry(entry) {
    lastDeleted = { ...entry };
    delete lastDeleted.id;
    await deleteEntry(entry.id);
    showUndoBar(entry);
  }

  undoBtn.addEventListener('click', async () => {
    if (!lastDeleted) return;
    clearTimeout(undoTimer);
    undoBar.hidden = true;
    const toRestore = lastDeleted;
    lastDeleted = null;
    await addEntry(toRestore);
  });

  function attachSwipeToDelete(row, entry) {
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let swiping = false;

    row.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      dragging = true;
      swiping = false;
      row.style.transition = 'none';
    });

    row.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!swiping) {
        if (dx > 8 && Math.abs(dx) > Math.abs(dy)) {
          swiping = true;
          row.dataset.swiped = '1';
          row.setPointerCapture(e.pointerId);
        } else if (Math.abs(dy) > 8 || dx < -8) {
          dragging = false;
          return;
        } else {
          return;
        }
      }
      const clamped = Math.max(0, Math.min(dx, row.offsetWidth));
      row.style.transform = `translateX(${clamped}px)`;
      e.preventDefault();
    });

    function finishDrag(e) {
      if (!dragging) return;
      dragging = false;
      if (!swiping) return;
      swiping = false;
      const dx = e.clientX - startX;
      const threshold = row.offsetWidth * 0.4;
      row.style.transition = 'transform 0.2s ease';
      if (dx > threshold) {
        row.style.transform = 'translateX(100%)';
        setTimeout(() => swipeDeleteEntry(entry), 150);
      } else {
        row.style.transform = 'translateX(0)';
      }
    }

    row.addEventListener('pointerup', finishDrag);
    row.addEventListener('pointercancel', finishDrag);
  }

  // ---------- Scroll to top ----------
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    scrollTopBtn.hidden = window.scrollY < 400;
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Back-gesture guard (Android) ----------
  function closeAnyOpenModal() {
    if (!entryModal.hidden) { entryModal.hidden = true; return true; }
    return false;
  }

  function armBackGuard() {
    try { history.pushState({ dateGuard: true }, ''); } catch (e) { /* ignore */ }
  }

  window.addEventListener('popstate', () => {
    closeAnyOpenModal();
    armBackGuard();
  });

  armBackGuard();

  init();
})();
