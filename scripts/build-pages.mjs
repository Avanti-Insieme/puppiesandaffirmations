// Runs after the Vite build. Writes static HTML into dist/ for:
//   - the homepage (with site-wide tags and WebSite structured data)
//   - one page per post, at /affirmations/<date>/<slug>
//   - /advertise (plain HTML, no app bundle)
// plus sitemap.xml and _redirects (old /affirmations/<date> links go to the new slug URL).
// Each page carries its own title, description, social tags, and readable text, so search
// engines and link previews see the content without running JavaScript. React then takes
// over the same page in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { mergePosts, postPath, recentPosts } from '../src/posts.js';
import { TIME_ZONE, publishDate } from '../src/todaysPost.js';
import {
  SITE_URL, SITE_NAME, HOME_TITLE, HOME_DESCRIPTION, KEYWORDS, OG_IMAGE,
  OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, ADVERTISE_EMAIL, absoluteUrl, postUrl,
  postTitle, postDescription, jsonLd, websiteJsonLd, articleJsonLd,
} from '../src/seo.js';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const UNSPLASH_LINK = 'https://unsplash.com/?utm_source=puppies_affirmations&utm_medium=referral';

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

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// ── Head tags ────────────────────────────────────────────────────

function socialTags({ title, description, url, type }) {
  return [
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="keywords" content="${esc(KEYWORDS.join(', '))}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(OG_IMAGE)}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(OG_IMAGE)}" />`,
  ];
}

const jsonLdScript = (data) => `<script type="application/ld+json">${jsonLd(data)}</script>`;

// ── Page assembly ────────────────────────────────────────────────

// Fills the built index.html template: new head tags, the static body inside #root.
// Pages without the app (like /advertise) also drop the app's script tag.
function buildHtml(template, { title, head, body, app = true }) {
  let page = template.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>\n    ${head.join('\n    ')}`);
  if (!app) page = page.replace(/<script type="module"[^>]*><\/script>/g, '');
  page = page.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);

  // Fail the build rather than publish pages without their content.
  if (!page.includes('pa-static') || !page.includes('rel="canonical"')) {
    throw new Error(`Could not fill the page template for "${title}". Check dist/index.html.`);
  }
  return page;
}

// ── Static bodies ────────────────────────────────────────────────

const header = () =>
  `<header class="pa-static-head"><a class="pa-static-brand" href="/">${esc(SITE_NAME)}</a></header>`;

function recentList(posts) {
  if (posts.length === 0) return '';
  const items = posts
    .map((p) => `<li><a href="${esc(postPath(p))}">${esc(p.text)}</a> <span>${esc(prettyDate(p.date))}</span></li>`)
    .join('\n          ');
  return `<nav class="pa-recent" aria-label="Recent affirmations">
        <h2 class="pa-section-kicker">Recent affirmations</h2>
        <ol>
          ${items}
        </ol>
      </nav>`;
}

function creditHtml(photo) {
  return `<p class="pa-credit">Photo by <a href="${esc(photo.photographerUrl)}" rel="noopener noreferrer">${esc(photo.photographer)}</a> on <a href="${UNSPLASH_LINK}" rel="noopener noreferrer">Unsplash</a></p>`;
}

function homeBody(todays, recent) {
  const headline = todays ? todays.text : HOME_DESCRIPTION;
  return `<div class="pa-page"><main class="pa-wrap pa-main pa-static">
      ${header()}
      <section class="pa-hero-text">
        <span class="pa-kicker">A little good news, every day</span>
        <h1 class="pa-headline">${esc(headline)}</h1>
        <p class="pa-intro-text">${esc(HOME_DESCRIPTION)}</p>
      </section>
      ${recentList(recent)}
    </main></div>`;
}

function postBody(post, recent) {
  return `<div class="pa-page"><main class="pa-wrap pa-main pa-static">
      ${header()}
      <article>
        <p class="pa-kicker">${esc(prettyDate(post.date))}</p>
        <h1 class="pa-headline">${esc(post.text)}</h1>
        <img class="pa-hero-img" src="${esc(post.photo.src)}" alt="${esc(post.photo.alt)}" />
        ${creditHtml(post.photo)}
        <p><a href="/">See today's affirmation</a></p>
      </article>
      ${recentList(recent)}
    </main></div>`;
}

function advertiseBody() {
  return `<div class="pa-page"><main class="pa-wrap pa-main pa-static pa-advertise">
      ${header()}
      <article>
        <p class="pa-kicker">Advertise</p>
        <h1 class="pa-headline">Advertise on ${esc(SITE_NAME)}</h1>
        <p class="pa-intro-text">${esc(SITE_NAME)} is a small, calm site. Each day it shares a short affirmation and a dog photo, and readers can sign up to receive them by email.</p>
        <h2 class="pa-section-kicker pa-section-kicker--spaced">Placements</h2>
        <ul>
          <li><strong>Leaderboard</strong>, 728 × 90 pixels, shown under the daily affirmation.</li>
          <li><strong>Rectangle</strong>, 300 × 250 pixels, shown beside the story.</li>
        </ul>
        <p>Both spaces have fixed sizes, so they never push the page around as they load.</p>
        <p>To ask about a placement, email <a href="mailto:${esc(ADVERTISE_EMAIL)}">${esc(ADVERTISE_EMAIL)}</a>.</p>
        <p><a href="/">Back to the site</a></p>
      </article>
    </main></div>`;
}

// ── Sitemap and redirects ────────────────────────────────────────

function sitemap(posts) {
  const entries = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    `  <url><loc>${absoluteUrl('/advertise')}</loc></url>`,
    ...posts.map((p) => `  <url><loc>${postUrl(p)}</loc><lastmod>${p.date}</lastmod></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

// Old links were /affirmations/<date>. Each one now moves permanently to its slug URL.
function redirects(posts) {
  const lines = [
    '# Written by scripts/build-pages.mjs. Old date-only post links move to the slug URL.',
  ];
  for (const p of posts) {
    lines.push(`/affirmations/${p.date} ${postPath(p)} 301!`);
    lines.push(`/affirmations/${p.date}/ ${postPath(p)} 301!`);
  }
  return lines.join('\n') + '\n';
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  const indexFile = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexFile)) {
    throw new Error('dist/index.html is missing. Run the Vite build before building pages.');
  }
  const template = fs.readFileSync(indexFile, 'utf8');

  const queue = readJson(path.join(ROOT, 'src/content/queue.json'), { posts: [] });
  const archive = readJson(path.join(ROOT, 'src/content/archive.json'), { posts: [] });
  const posts = mergePosts(queue, archive);

  // Only posts that are already live appear in the "recent" lists.
  const today = publishDate();
  const recent = recentPosts(posts, today, 7);

  // Homepage (overwrites dist/index.html, which the template was read from).
  write(indexFile, buildHtml(template, {
    title: HOME_TITLE,
    head: [
      ...socialTags({ title: HOME_TITLE, description: HOME_DESCRIPTION, url: `${SITE_URL}/`, type: 'website' }),
      jsonLdScript(websiteJsonLd()),
    ],
    body: homeBody(posts.find((p) => p.date === today) ?? null, recent),
  }));

  // One page per post.
  for (const post of posts) {
    const title = postTitle(post);
    const url = postUrl(post);
    write(path.join(DIST, postPath(post), 'index.html'), buildHtml(template, {
      title,
      head: [
        ...socialTags({ title, description: postDescription(post), url, type: 'article' }),
        `<meta property="article:published_time" content="${post.date}" />`,
        jsonLdScript(articleJsonLd(post)),
      ],
      body: postBody(post, recent),
    }));
  }

  // The advertise page has no app, so it is plain HTML.
  const adTitle = `Advertise | ${SITE_NAME}`;
  write(path.join(DIST, 'advertise', 'index.html'), buildHtml(template, {
    title: adTitle,
    head: socialTags({
      title: adTitle,
      description: `Advertise on ${SITE_NAME}, a small daily affirmation and dog photo site.`,
      url: absoluteUrl('/advertise'),
      type: 'website',
    }),
    body: advertiseBody(),
    app: false,
  }));

  write(path.join(DIST, 'sitemap.xml'), sitemap(posts));
  write(path.join(DIST, '_redirects'), redirects(posts));
  console.log(`Built ${posts.length} post page(s), the homepage, /advertise, sitemap.xml, and _redirects.`);
}

main();
