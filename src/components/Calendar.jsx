import { useState } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function Calendar({ affirmation }) {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();
  const monthName = MONTHS[month];

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null), // blank cells before the 1st
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dayClass(day) {
    if (day === todayDate) return 'pa-cal-day is-today';
    if (day === selectedDay) return 'pa-cal-day is-selected';
    return 'pa-cal-day';
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
                  onClick={() => setSelectedDay((s) => (s === day ? null : day))}
                >
                  {day}
                </button>
              ),
            )}
          </div>

          {selectedDay && (
            <p className="pa-cal-note">
              {monthName} {selectedDay}: “{affirmation}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
