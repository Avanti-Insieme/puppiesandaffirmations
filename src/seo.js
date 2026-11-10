// Search and social settings shared by the page builder and the site.
// Change the site-wide values here, and every page picks them up on the next build.
import { postPath } from './posts.js';

export const SITE_URL = 'https://puppiesandaffirmations.com';
export const SITE_NAME = 'Puppies and Affirmations';
export const SITE_LANGUAGE = 'en-CA';

// Contact address shown on the advertise page. Confirm this mailbox exists before launch.
export const ADVERTISE_EMAIL = 'hello@puppiesandaffirmations.com';

export const HOME_TITLE = 'Puppies and Affirmations | A daily affirmation and a dog photo';
export const HOME_DESCRIPTION =
  'A new affirmation and a happy dog photo every day. A small dose of comfort for your browser tab.';

// Meta keywords are ignored by Google, but harmless, and some other tools still read them.
export const KEYWORDS = [
  'daily affirmations',
  'positive affirmations',
  'dog affirmations',
  'puppy photos',
  'dog photos',
  'uplifting quotes',
  'daily inspiration',
  'Puppies and Affirmations',
];

// Shared image for link previews. JPEG is used because some preview scrapers ignore WebP.
export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function absoluteUrl(path) {
  return `${SITE_URL}${path}`;
}

export function postUrl(post) {
  return absoluteUrl(postPath(post));
}

export function postTitle(post) {
  return `${post.text} | ${SITE_NAME}`;
}

export function postDescription(post) {
  return `${post.text} A daily affirmation with a dog photo, from ${SITE_NAME}.`;
}

// Structured data helps search engines show the post as an article.
// "<" is escaped so the JSON can never close its <script> tag early.
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
  };
}

export function articleJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.text.slice(0, 110),
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl(post),
    mainEntityOfPage: postUrl(post),
    image: post.photo?.src,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}
