// Date helpers shared by the site and the batch generator, so "today's post"
// means the same thing in both places.

export const TIME_ZONE = 'America/Halifax';
const SWITCH_MS = 6 * 60 * 60 * 1000; // a new post starts at 6 a.m. Halifax time

// Returns the calendar date in Halifax as YYYY-MM-DD ('en-CA' uses that format).
export function halifaxDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Before 6 a.m. Halifax time, the previous day's post is still showing.
export function publishDate(now = new Date()) {
  return halifaxDate(new Date(now.getTime() - SWITCH_MS));
}

export function addDays(dateString, days) {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function currentPost(queue, now = new Date()) {
  const today = publishDate(now);
  return queue.posts.find((p) => p.date === today) ?? null;
}
