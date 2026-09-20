(function () {
  'use strict';

  const GROUPS = ['Yoga', 'Sofers', 'Geris', 'Friends', 'Dia-birthdays'];
  const GROUP_COLORS = {
    Yoga: '#2f9e44',
    Sofers: '#f08c00',
    Geris: '#e03131',
    Friends: '#1971c2',
    'Dia-birthdays': '#9c36b5',
  };
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const STORAGE_KEY = 'its-a-date-entries-v1';
  const UPCOMING_WINDOW_DAYS = 7;

  const SEED_ENTRIES = [
    { name: "Tia Geri", month: 1, day: 8, year: 2009, group: "Dia-birthdays", label: "Dia-birthday" },
    { name: "Benjamin Colton Robb", month: 1, day: 8, year: 2009, group: "Dia-birthdays", label: "Dia-birthday" },
    { name: "Jairi Vargas", month: 1, day: 8, year: 2013, group: "Dia-birthdays", label: "Dia-birthday" },
    { name: "Shlomi Cahlon", month: 1, day: 11, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Dr. Saleh Adi", month: 1, day: 12, year: 1961, group: "Friends", label: "Birthday" },
    { name: "Gadi Ponte", month: 1, day: 20, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Delali Bruce", month: 1, day: 25, year: 2004, group: "Friends", label: "Birthday" },
    { name: "Melissa and Michael Riordan", month: 1, day: 29, year: 2013, group: "Friends", label: "Birthday" },
    { name: "Motti Hamam", month: 2, day: 1, year: 2023, group: "Yoga", label: "Birthday" },
    { name: "Elizabeth McCracken", month: 2, day: 17, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Henriette Ponte", month: 2, day: 18, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Noa Geri", month: 2, day: 19, year: 2000, group: "Geris", label: "Birthday" },
    { name: "Tia Geri", month: 3, day: 3, year: 2000, group: "Geris", label: "Birthday" },
    { name: "Adam Lasher", month: 3, day: 14, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Nancy Nagel", month: 3, day: 15, year: 2009, group: "Friends", label: "Birthday" },
    { name: "Hilary Brehaut", month: 3, day: 20, year: 2009, group: "Friends", label: "Birthday" },
    { name: "Yoram Barak", month: 3, day: 28, year: 2026, group: "Friends", label: "Birthday" },
    { name: "Yali Schwarz", month: 4, day: 7, year: 2000, group: "Yoga", label: "Birthday" },
    { name: "Irit Avidov-Shachrur", month: 4, day: 14, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Neta Simon", month: 4, day: 18, year: 1998, group: "Yoga", label: "Birthday" },
    { name: "Benjamin Colton Robb", month: 4, day: 28, year: 1999, group: "Friends", label: "Birthday" },
    { name: "Jairi Vargas", month: 5, day: 12, year: 2004, group: "Friends", label: "Birthday" },
    { name: "Jennifer Makower", month: 5, day: 12, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Shiri Eshed-Shahar", month: 5, day: 16, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Sheer Hamam", month: 5, day: 26, year: 2005, group: "Yoga", label: "Birthday" },
    { name: "Noam", month: 6, day: 11, year: 1998, group: "Friends", label: "Birthday" },
    { name: "Barbara Marom Pollack", month: 6, day: 23, year: 1947, group: "Friends", label: "Birthday" },
    { name: "Mechal Ben Ari", month: 6, day: 24, year: 1993, group: "Friends", label: "Anniversary" },
    { name: "Natsumi Mori", month: 7, day: 12, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Ido Simon", month: 7, day: 14, year: 1995, group: "Yoga", label: "Birthday" },
    { name: "Mike Sands", month: 7, day: 14, year: 1955, group: "Friends", label: "Birthday" },
    { name: "Ellie Schwarz", month: 7, day: 16, year: 2003, group: "Yoga", label: "Birthday" },
    { name: "Nick Cuttriss", month: 7, day: 16, year: 1980, group: "Friends", label: "Birthday" },
    { name: "Shlomi", month: 7, day: 16, year: 2024, group: "Friends", label: "Birthday" },
    { name: "Ty Geri", month: 7, day: 27, year: 1998, group: "Geris", label: "Birthday" },
    { name: "Omer", month: 8, day: 5, year: 2024, group: "Friends", label: "Birthday" },
    { name: "Efrat Bigman-Volk", month: 8, day: 5, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Patrick Mertes", month: 8, day: 17, year: 2022, group: "Friends", label: "Birthday" },
    { name: "Ariel Spivak", month: 9, day: 2, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Abby Twoy", month: 9, day: 30, year: 2000, group: "Friends", label: "Birthday" },
    { name: "Cambria", month: 10, day: 6, year: 1997, group: "Friends", label: "Birthday" },
    { name: "Ma'ayan", month: 10, day: 22, year: 2002, group: "Friends", label: "Birthday" },
    { name: "Adina", month: 10, day: 24, year: 2024, group: "Friends", label: "Birthday" },
    { name: "Beth Sorenson", month: 10, day: 26, year: 1976, group: "Friends", label: "Birthday" },
    { name: "Juyi Spivak", month: 10, day: 29, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Noa Simon", month: 10, day: 31, year: 2003, group: "Yoga", label: "Birthday" },
    { name: "Mechal Ben Ari", month: 11, day: 6, year: 1968, group: "Friends", label: "Birthday" },
    { name: "Sharon Hoffman", month: 11, day: 6, year: 1970, group: "Friends", label: "Birthday" },
    { name: "Zoe Geri", month: 11, day: 8, year: 1994, group: "Geris", label: "Birthday" },
    { name: "Ed Damiano", month: 11, day: 30, year: 2023, group: "Friends", label: "Birthday" },
    { name: "Smadar Sweiry", month: 12, day: 1, year: 2025, group: "Friends", label: "Birthday" },
    { name: "Larry Katznelson", month: 12, day: 3, year: 2023, group: "Yoga", label: "Birthday" },
    { name: "Laura Myszne", month: 12, day: 25, year: 2024, group: "Friends", label: "Birthday" },
    { name: "Jonathan Rubel, JR.", month: 12, day: 29, year: 1964, group: "Sofers", label: "Birthday" }
  ];

  const config = window.ITSADATE_CONFIG || {};
  const useSupabase = !!(config.supabaseUrl && config.supabaseAnonKey);
  let supabase = null;
  let entries = [];
  let activeFilter = 'all';

  const entryList = document.getElementById('entry-list');
  const emptyState = document.getElementById('empty-state');
  const filterChips = document.getElementById('filter-chips');

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

  // ---------- Backend: local storage ----------
  function localLoad() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = SEED_ENTRIES.map((e) => ({ id: uid(), ...e }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    try {
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }
  function localSave(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ---------- Backend: supabase ----------
  function fromRow(row) {
    return { id: row.id, name: row.name, month: row.month, day: row.day, year: row.year, group: row.group_name, label: row.label };
  }
  function toRow(entry) {
    return { name: entry.name, month: entry.month, day: entry.day, year: entry.year, group_name: entry.group, label: entry.label };
  }

  async function refetchFromSupabase() {
    const { data, error } = await supabase.from('dates').select('*');
    if (error) throw error;
    if (!data.length) {
      const { error: insErr } = await supabase.from('dates').insert(SEED_ENTRIES.map(toRow));
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
    populateGroupSelect();
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
    const filtered = activeFilter === 'all' ? entries : entries.filter((e) => e.group === activeFilter);

    const withDays = filtered.map((e) => ({ entry: e, next: nextOccurrence(e.month, e.day) }));
    withDays.sort((a, b) => a.next - b.next);

    entryList.innerHTML = '';
    emptyState.hidden = withDays.length > 0;

    withDays.forEach(({ entry, next }) => {
      const days = daysUntil(next);
      const isUpcoming = days <= UPCOMING_WINDOW_DAYS;
      const color = GROUP_COLORS[entry.group] || '#7d7d94';

      const row = document.createElement('li');
      row.className = 'entry-row' + (isUpcoming ? ' is-upcoming' : '');
      row.style.setProperty('--group-color', color);
      row.addEventListener('click', () => openEntryModal(entry));

      const dateCol = document.createElement('div');
      dateCol.className = 'entry-date';
      dateCol.innerHTML = `<span class="month">${MONTH_NAMES[entry.month - 1]}</span><span class="day">${entry.day}</span>`;

      const info = document.createElement('div');
      info.className = 'entry-info';

      const nameEl = document.createElement('div');
      nameEl.className = 'entry-name';
      nameEl.textContent = entry.name;

      const meta = document.createElement('div');
      meta.className = 'entry-meta';

      const labelEl = document.createElement('span');
      labelEl.className = 'entry-label';
      labelEl.textContent = entry.label || 'Birthday';
      meta.appendChild(labelEl);

      const groupTag = document.createElement('span');
      groupTag.className = 'entry-group-tag';
      groupTag.style.setProperty('--group-color', color);
      groupTag.textContent = entry.group;
      meta.appendChild(groupTag);

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
      gcalBtn.textContent = '📅';
      gcalBtn.addEventListener('click', (e) => e.stopPropagation());

      row.append(dateCol, info, gcalBtn);
      entryList.appendChild(row);
    });
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
  const groupInput = document.getElementById('group-input');
  const labelInput = document.getElementById('label-input');
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

  function populateGroupSelect() {
    groupInput.innerHTML = '';
    GROUPS.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      groupInput.appendChild(opt);
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
    groupInput.value = entry ? entry.group : 'Friends';
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

    const patch = {
      name,
      month: Number(monthInput.value),
      day: Number(dayInput.value),
      year: yearInput.value ? Number(yearInput.value) : null,
      group: groupInput.value,
      label: labelInput.value.trim() || 'Birthday',
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

  deleteBtn.addEventListener('click', () => {
    if (editingId && confirm('Delete this date?')) {
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
    savedToastText.textContent = `Saved ${entry.name}`;
    savedToastGcal.href = gcalUrl(entry);
    savedToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { savedToast.hidden = true; }, 6000);
  }

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
