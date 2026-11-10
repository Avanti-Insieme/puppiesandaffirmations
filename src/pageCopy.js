// Words shared by the site's pages and the static pages built by scripts/build-pages.mjs.
// Edit them here, and both versions change together.

export const ABOUT = {
  kicker: 'About',
  title: 'A small gift, made every day',
  paragraphs: [
    'Some time ago, I gave a dear friend a simple calendar with handwritten notes for each month. It was meant to brighten a day. Months later, I heard it had brightened another one.',
    "So this year I wanted to take that idea further. I built this site to share a daily affirmation and a dog photo. Some days that's all the comfort a browser tab needs to offer.",
  ],
  howTitle: "How it's made",
  how: 'Each affirmation is drafted with the help of an AI model, then reviewed by a person before it goes live. Photos come from Unsplash, and every photo credits its photographer.',
  contactTitle: 'Contact',
};

export const ADVERTISE = {
  kicker: 'Advertise',
  intro: (siteName) =>
    `${siteName} is a small, calm site. Each day it shares a short affirmation and a dog photo, and readers can sign up to receive them by email.`,
  placementsTitle: 'Placements',
  placements: [
    { name: 'Leaderboard', detail: '728 × 90 pixels, shown under the daily affirmation.' },
    { name: 'Rectangle', detail: '300 × 250 pixels, shown beside the story.' },
  ],
  note: 'Both spaces have fixed sizes, so they never push the page around as they load.',
  contact: 'To ask about a placement, email',
};

export const ARCHIVE = {
  kicker: 'Archive',
  title: 'Every affirmation so far',
  count: (n) => `${n} posts, newest first.`,
};
