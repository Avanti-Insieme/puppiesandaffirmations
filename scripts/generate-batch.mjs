// Generates a batch of affirmations and Unsplash photos and adds them to the queue.
// Runs in GitHub Actions (or locally with the same environment variables).
// Uses only built-in Node APIs (Node 18+) plus the date helpers in src/.
import fs from 'node:fs';
import path from 'node:path';
import { addDays, publishDate } from '../src/todaysPost.js';
import { mergePosts } from '../src/posts.js';

const BATCH_SIZE = 21;
const REFILL_BELOW = 7;     // start a new batch when fewer upcoming posts remain
const COOLDOWN_DAYS = 90;   // a photo is not reused within this many days
const TEXT_MEMORY = 90;     // recent affirmations remembered to avoid repeats
const PAGES_PER_TERM = 3;   // 6 terms x 3 pages = 18 search requests per run
const SEARCH_TERMS = ['puppy', 'dog', 'golden retriever', 'corgi', 'puppies playing', 'happy dog'];
// Set GEMINI_MODEL as a repository variable (Settings → Secrets and variables → Actions → Variables)
// to change models without editing code. The fallback is the model Google's error message recommends.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, 'src/content/queue.json');
const HISTORY_PATH = path.join(ROOT, 'src/content/history.json');
const ARCHIVE_PATH = path.join(ROOT, 'src/content/archive.json');

// ── Files ────────────────────────────────────────────────────────

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function setChanged(changed) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  }
  console.log(`changed=${changed}`);
}

// ── Affirmations (Gemini) ────────────────────────────────────────

// Retries temporary failures (429 rate limits and 503 overloads) with growing waits.
// Other errors are returned at once, so a wrong key or model still fails quickly.
async function fetchWithRetry(url, options, attempts = 5) {
  let res;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    res = await fetch(url, options);
    const temporary = res.status === 429 || res.status === 503 || res.status === 500;
    if (!temporary || attempt === attempts) return res;
    const waitMs = 15000 * attempt; // 15s, 30s, 45s, 60s
    console.log(`Gemini returned ${res.status}; retrying in ${waitMs / 1000}s (attempt ${attempt + 1} of ${attempts}).`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  return res;
}

async function generateAffirmations(count, avoid) {
  const avoidList = avoid.slice(0, 60);
  const prompt = `Write ${count} short affirmations for a calm, warm website that pairs each one with a photo of a dog.
Rules:
- One sentence each, under 120 characters.
- Sincere and gentle. Never preachy, and never a command to feel a certain way.
- No medical, financial, political, or religious claims. Do not mention illness, death, weight, or diet.
- Every affirmation must differ in wording and idea from the others.
- Do not repeat or closely resemble any of these: ${JSON.stringify(avoidList)}
Return only a JSON array of ${count} strings.`;

  const res = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY.trim(),
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.9 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text (the request may have been blocked).');

  const list = JSON.parse(text);
  if (!Array.isArray(list)) throw new Error('Gemini did not return a JSON array.');

  const blocked = new Set(avoid.map((s) => s.trim().toLowerCase()));
  const clean = [...new Set(list.map((s) => String(s).trim()))].filter(
    (s) => s.length > 0 && s.length <= 140 && !blocked.has(s.toLowerCase()),
  );
  if (clean.length < count) throw new Error(`Only ${clean.length} usable affirmations, need ${count}.`);
  return clean.slice(0, count);
}

// ── Photos (Unsplash) ────────────────────────────────────────────

function unsplashHeaders() {
  return {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    'Accept-Version': 'v1',
  };
}

async function unsplashSearch(term, page) {
  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}` +
    `&orientation=landscape&per_page=30&page=${page}&content_filter=high`;
  const res = await fetch(url, { headers: unsplashHeaders() });
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status} ${await res.text()}`);
  return (await res.json()).results;
}

// Collects unique photos across all search terms.
async function fetchCandidates() {
  const seen = new Map();
  for (const term of SEARCH_TERMS) {
    for (let page = 1; page <= PAGES_PER_TERM; page++) {
      const results = await unsplashSearch(term, page);
      for (const photo of results) if (!seen.has(photo.id)) seen.set(photo.id, photo);
      if (results.length === 0) break;
    }
  }
  return [...seen.values()];
}

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks photos that haven't been used within the cooldown and aren't already queued.
// If there aren't enough, it reuses the photos whose last use is oldest, and reports that.
function choosePhotos(count, candidates, history, queuedIds, today) {
  const cutoff = addDays(today, -COOLDOWN_DAYS);
  const recentlyUsed = new Set(history.photos.filter((h) => h.usedOn >= cutoff).map((h) => h.id));
  const lastUsed = new Map(history.photos.map((h) => [h.id, h.usedOn]));

  const picks = shuffle(
    candidates.filter((p) => !recentlyUsed.has(p.id) && !queuedIds.has(p.id)),
  ).slice(0, count);

  let usedFallback = false;
  if (picks.length < count) {
    const pickedIds = new Set(picks.map((p) => p.id));
    const stale = candidates
      .filter((p) => !queuedIds.has(p.id) && !pickedIds.has(p.id))
      .sort((a, b) => (lastUsed.get(a.id) ?? '').localeCompare(lastUsed.get(b.id) ?? ''));
    picks.push(...stale.slice(0, count - picks.length));
    usedFallback = true;
  }
  if (picks.length < count) throw new Error(`Only ${picks.length} photos available, need ${count}.`);
  return { picks, usedFallback };
}

// Unsplash's API guidelines ask apps to report each photo they display.
async function trackDownload(photo) {
  await fetch(photo.links.download_location, { headers: unsplashHeaders() });
}

// Keeps only what the site needs, with the attribution links Unsplash asks for.
function photoRecord(photo) {
  const utm = '?utm_source=puppies_affirmations&utm_medium=referral';
  return {
    id: photo.id,
    src: photo.urls.regular,
    alt: photo.alt_description || 'A dog',
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html + utm,
    photoUrl: photo.links.html + utm,
  };
}

// ── Summary for the draft email ──────────────────────────────────

function writeSummary(posts, usedFallback) {
  const lines = posts.map(
    (p) => `${p.date}  ${p.text}\n    Photo: ${p.photo.photographer} (${p.photo.photoUrl})`,
  );
  if (usedFallback) {
    lines.unshift('Note: there were not enough fresh photos, so some older photos were reused.\n');
  }
  const file = process.env.SUMMARY_PATH || path.join(ROOT, 'batch-summary.txt');
  fs.writeFileSync(file, lines.join('\n\n') + '\n');
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  // Fail early with the secret's name, rather than a vague API error.
  for (const name of ['GEMINI_API_KEY', 'UNSPLASH_ACCESS_KEY']) {
    if (!process.env[name]?.trim()) {
      throw new Error(`${name} is missing or empty. Check that the repository secret has exactly this name.`);
    }
  }

  const today = publishDate();
  const queue = readJson(QUEUE_PATH, { generatedAt: null, posts: [] });
  const history = readJson(HISTORY_PATH, { photos: [], texts: [] });
  const archive = readJson(ARCHIVE_PATH, { posts: [] });

  // Posts that went live more than a week ago leave the queue, but they stay in the
  // archive, so their pages keep existing. The archive is only ever added to.
  const cutoff = addDays(today, -7);
  const expired = queue.posts.filter((p) => p.date < cutoff);
  queue.posts = queue.posts.filter((p) => p.date >= cutoff);
  const upcoming = queue.posts.filter((p) => p.date >= today);

  if (upcoming.length >= REFILL_BELOW) {
    console.log(`${upcoming.length} upcoming posts queued; no new batch needed.`);
    return setChanged(false);
  }

  const last = queue.posts.map((p) => p.date).sort().at(-1);
  let start = last ? addDays(last, 1) : today;
  if (start < today) start = today;

  const avoid = [...history.texts, ...queue.posts.map((p) => p.text)];
  const texts = await generateAffirmations(BATCH_SIZE, avoid);

  const candidates = await fetchCandidates();
  const queuedIds = new Set(queue.posts.map((p) => p.photo.id));
  const { picks, usedFallback } = choosePhotos(BATCH_SIZE, candidates, history, queuedIds, today);

  const newPosts = texts.map((text, i) => ({
    date: addDays(start, i),
    text,
    photo: photoRecord(picks[i]),
  }));

  for (const photo of picks) await trackDownload(photo);

  history.photos = [
    ...history.photos.filter((h) => h.usedOn >= addDays(today, -COOLDOWN_DAYS)),
    ...newPosts.map((p) => ({ id: p.photo.id, usedOn: p.date })),
  ];
  history.texts = [...texts, ...history.texts].slice(0, TEXT_MEMORY);

  queue.posts = [...queue.posts, ...newPosts];
  queue.generatedAt = new Date().toISOString();

  archive.posts = mergePosts({ posts: expired }, archive);

  writeJson(QUEUE_PATH, queue);
  writeJson(ARCHIVE_PATH, archive);
  writeJson(HISTORY_PATH, history);
  writeSummary(newPosts, usedFallback);

  console.log(`Added ${newPosts.length} posts starting ${start}.`);
  setChanged(true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
