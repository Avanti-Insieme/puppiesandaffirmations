// Merges the live queue and the permanent archive into one list, with one post per date.
// If a date appears in both, the queue wins, since it holds the newest version.
// Shared by the site, the calendar, and the page builder, so they always agree.
export function mergePosts(queue, archive) {
  const byDate = new Map();
  for (const post of archive?.posts ?? []) byDate.set(post.date, post);
  for (const post of queue?.posts ?? []) byDate.set(post.date, post);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function findPost(posts, date) {
  return posts.find((p) => p.date === date) ?? null;
}
