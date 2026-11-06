import { useState } from 'react';
import queue from '../content/queue.json';
import { halifaxDate } from '../todaysPost.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const pad = (n) => String(n).padStart(2, '0');

export default function Calendar() {
  const [open, setOpen] = useState(false);
  const [selectedIso, setSelectedIso] = useState(null);

  // "Today" is the Halifax date, the same one the site uses to pick the post.
  const todayIso = halifaxDate();
  const [year, month1, todayDate] = todayIso.split('-').map(Number);
  const month = month1 - 1;
  const monthName = MONTHS[month];

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null), // blank cells before the 1st
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isoFor = (day) => `${year}-${pad(month1)}-${pad(day)}`;

  // Future days are disabled. Dates compare as YYYY-MM-DD strings, which sort correctly.
  const isFuture = (day) => isoFor(day) > todayIso;

  function dayClass(day) {
    const iso = isoFor(day);
    if (iso === todayIso) return 'pa-cal-day is-today';
    if (iso === selectedIso) return 'pa-cal-day is-selected';
    return 'pa-cal-day';
  }

  // Shows the affirmation that ran on the chosen past day, if one was saved.
  function noteFor(iso) {
    const post = queue.posts.find((p) => p.date === iso);
    if (post) return `${monthName} ${Number(iso.slice(8))}: “${post.text}”`;
    return `No affirmation was saved for ${monthName} ${Number(iso.slice(8))}.`;
  }

  return (
    <div className="pa-popover-wrap">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <i className="ph-duotone ph-calendar-blank" />
        {monthName.slice(0, 3)} {todayDate}
        <i className="ph-duotone ph-caret-down" />
      </button>

      {open && (
        <div className="card elev-lg pa-popover pa-calendar">
          <div className="pa-cal-head">
            <span className="card-title">{monthName} {year}</span>
            <i className="ph-duotone ph-calendar-heart" />
          </div>

          <div className="pa-cal-grid">
            {WEEKDAYS.map((wd, i) => (
              <span key={i} className="pa-weekday">{wd}</span>
            ))}
          </div>

          <div className="pa-cal-grid">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`blank-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  className={dayClass(day)}
                  disabled={isFuture(day)}
                  aria-label={isFuture(day) ? `${monthName} ${day}, not yet available` : undefined}
                  onClick={() => {
                    const iso = isoFor(day);
                    setSelectedIso((s) => (s === iso ? null : iso));
                  }}
                >
                  {day}
                </button>
              ),
            )}
          </div>

          {selectedIso && <p className="pa-cal-note">{noteFor(selectedIso)}</p>}
        </div>
      )}
    </div>
  );
}
