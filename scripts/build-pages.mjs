// Writes one static page per post, plus sitemap.xml, into dist/ after the Vite build.
// Each page has its own title, description, and social tags, and the post text is in the
// HTML itself, so search engines and link previews can read it without running JavaScript.
// React replaces that content when the page loads, so visitors see the same post.
import fs from 'node:fs';
import path from 'node:path';
import { mergePosts } from '../src/posts.js';
import { TIME_ZONE } from '../src/todaysPost.js';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://puppiesandaffirmations.com';

const longDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

// Noon UTC keeps the calendar day the same in every time zone.
const prettyDate = (date) => longDate.format(new Date(`${date}T12:00:00Z`));

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function postPage(template, post) {
  const url = `${SITE_URL}/affirmations/${post.date}/`;
  const title = `${post.text} | Puppies and Affirmations`;
  const desc = esc(post.text);
  const photo = post.photo;

  const head = [
    `<meta name="description" content="${desc}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${esc(photo.src)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');

  const body = `<main class="pa-static">
      <article>
        <p class="pa-kicker">${esc(prettyDate(post.date))}</p>
        <h1 class="pa-headline">${esc(post.text)}</h1>
        <img class="pa-hero-img" src="${esc(photo.src)}" alt="${esc(photo.alt)}" />
        <p class="pa-credit">Photo by <a href="${esc(photo.photographerUrl)}" rel="noopener noreferrer">${esc(photo.photographer)}</a> on <a href="https://unsplash.com/?utm_source=puppies_affirmations&amp;utm_medium=referral" rel="noopener noreferrer">Unsplash</a></p>
        <p><a href="/">See today's affirmation</a></p>
      </article>
    </main>`;

  const page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>\n    ${head}`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  // Fail the build rather than publish pages without their content.
  if (!page.includes('pa-static') || !page.includes(`canonical`)) {
    throw new Error(`Could not fill the page template for ${post.date}. Check dist/index.html.`);
  }
  return page;
}

function sitemap(posts) {
  const entries = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    ...posts.map(
      (p) => `  <url><loc>${SITE_URL}/affirmations/${p.date}/</loc><lastmod>${p.date}</lastmod></url>`,
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

function main() {
  const indexFile = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexFile)) {
    throw new Error('dist/index.html is missing. Run the Vite build before building pages.');
  }
  const template = fs.readFileSync(indexFile, 'utf8');

  const queue = readJson(path.join(ROOT, 'src/content/queue.json'), { posts: [] });
  const archive = readJson(path.join(ROOT, 'src/content/archive.json'), { posts: [] });
  const posts = mergePosts(queue, archive);

  for (const post of posts) {
    const dir = path.join(DIST, 'affirmations', post.date);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), postPage(template, post));
  }

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap(posts));
  console.log(`Built ${posts.length} post page(s) and sitemap.xml.`);
}

main();
