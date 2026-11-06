// Builds one newsletter file per upcoming queued post, ready to paste into beehiiv.
// Runs on its own (npm run newsletter) or as a step after the batch job.
// Every run deletes the old newsletter files first, so the folder never grows.
import fs from 'node:fs';
import path from 'node:path';
import { halifaxDate } from '../src/todaysPost.js';

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, 'src/content/queue.json');
const OUT_DIR = path.join(ROOT, 'newsletter');
const SITE_URL = 'https://puppiesandaffirmations.com';

const longDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Halifax',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

// Noon UTC keeps the calendar day the same in every time zone.
function prettyDate(date) {
  return longDate.format(new Date(`${date}T12:00:00Z`));
}

function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…';
}

function buildFile(post) {
  const { date, text, photo } = post;
  const subject = truncate(text, 70);
  const preview = `Your affirmation and a good dog photo for ${prettyDate(date)}.`;
  const unsplash = 'https://unsplash.com/?utm_source=puppies_affirmations&utm_medium=referral';

  return `---
date: ${date}
publish_at: ${date} 06:00 America/Halifax
subject: ${subject}
preview: ${preview}
---

# ${text}

![${photo.alt}](${photo.src})

Photo by [${photo.photographer}](${photo.photographerUrl}) on [Unsplash](${unsplash}).

Visit the site: ${SITE_URL}

<!-- beehiiv adds the unsubscribe footer. Don't add your own. -->
`;
}

function main() {
  const queue = fs.existsSync(QUEUE_PATH)
    ? JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'))
    : { posts: [] };

  const today = halifaxDate();
  const upcoming = queue.posts
    .filter((p) => p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Clear the old files before writing new ones.
  const removed = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.md')).length : 0;
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const post of upcoming) {
    fs.writeFileSync(path.join(OUT_DIR, `${post.date}.md`), buildFile(post));
  }

  console.log(`Removed ${removed} old newsletter file(s).`);
  console.log(`Wrote ${upcoming.length} newsletter file(s) to newsletter/.`);
}

main();
