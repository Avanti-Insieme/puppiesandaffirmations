// Merges the live queue and the permanent archive into one list, with one post per date.
// If a date appears in both, the queue wins, since it holds the newest version.
// Every post also gets a URL slug, so the site, the calendar, and the page builder agree.
export function mergePosts(queue, archive) {
  const byDate = new Map();
  for (const post of archive?.posts ?? []) byDate.set(post.date, post);
  for (const post of queue?.posts ?? []) byDate.set(post.date, post);
  const posts = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  return withSlugs(posts);
}

export function findPost(posts, date) {
  return posts.find((p) => p.date === date) ?? null;
}

// ── Slugs ────────────────────────────────────────────────────────

const MAX_SLUG_LENGTH = 60;

// "Rest is productive, too." -> "rest-is-productive-too"
export function slugify(text) {
  const words = String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')          // "yesterday's" -> "yesterdays", not "yesterday-s"
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  // Cut at a whole word, so slugs never end mid-word.
  let slug = '';
  for (const word of words) {
    const next = slug ? `${slug}-${word}` : word;
    if (next.length > MAX_SLUG_LENGTH) break;
    slug = next;
  }
  return slug || 'affirmation';
}

// A slug that no other post uses. Adds -2, -3, … when two texts give the same slug.
export function uniqueSlug(text, taken) {
  const base = slugify(text);
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

// Gives every post a slug. Slugs already stored in the data are kept as they are,
// so a URL never changes once it has been shared. Posts without one get a new slug.
export function withSlugs(posts) {
  const taken = new Set(posts.filter((p) => p.slug).map((p) => p.slug));
  return posts.map((post) => {
    if (post.slug) return post;
    const slug = uniqueSlug(post.text, taken);
    taken.add(slug);
    return { ...post, slug };
  });
}

export function postPath(post) {
  return `/affirmations/${post.date}/${post.slug}`;
}

// Only posts whose day has arrived. Queued posts for later days are hidden until then.
export function livePosts(posts, today) {
  return posts.filter((p) => p.date <= today);
}

// The most recent posts that are already live, newest first.
export function recentPosts(posts, today, count = 7) {
  return posts
    .filter((p) => p.date <= today)
    .slice(-count)
    .reverse();
}
