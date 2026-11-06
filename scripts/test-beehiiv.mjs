// Checks that the beehiiv API key works and that this plan can create a post.
// Creates ONE test post as a draft, which is not sent to subscribers.
// Run locally:  BEEHIIV_API_KEY=... BEEHIIV_PUBLICATION_ID=... node scripts/test-beehiiv.mjs
const API = 'https://api.beehiiv.com/v2';
const key = process.env.BEEHIIV_API_KEY?.trim();
const pub = process.env.BEEHIIV_PUBLICATION_ID?.trim();

if (!key || !pub) {
  console.error('Set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID first.');
  process.exit(1);
}

const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

async function call(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

// Step 1: read the publication. This only reads, so it's safe.
const pubRes = await call('GET', `/publications/${pub}`);
if (!pubRes.ok) {
  console.error(`Reading the publication failed: ${pubRes.status}`, pubRes.data);
  process.exit(1);
}
console.log('Publication OK:', pubRes.data?.data?.name ?? '(name not returned)');

// Step 2: create one draft post. It is not sent unless someone sets status to "confirmed".
const stamp = new Date().toISOString();
const postRes = await call('POST', `/publications/${pub}/posts`, {
  title: `API test (delete me) ${stamp}`,
  body_content: '<p>This is a test post created by the API check. Delete it.</p>',
});

if (!postRes.ok) {
  console.error(`Creating a post failed: ${postRes.status}`, JSON.stringify(postRes.data, null, 2));
  console.error('If the error mentions the plan, the free plan may not allow API post creation.');
  process.exit(1);
}

const post = postRes.data?.data ?? {};
console.log('Post created.');
console.log('  id:    ', post.id);
console.log('  status:', post.status);
console.log('  web:   ', post.web_url ?? '(no URL returned)');
console.log('\nCheck the post in beehiiv. It should be a draft, and nothing should have been sent.');
console.log('Delete the test post when you are done.');
