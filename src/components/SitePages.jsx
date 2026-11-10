// The About, Advertise, and Archive pages inside the app. They use the same words as the
// static pages (src/pageCopy.js), so the app works even before the static pages are built,
// for example under `npm run dev`.
import { ABOUT, ADVERTISE, ARCHIVE } from '../pageCopy.js';
import { SITE_NAME, ADVERTISE_EMAIL } from '../seo.js';
import { postPath } from '../posts.js';
import { TIME_ZONE } from '../todaysPost.js';

const longDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const prettyDate = (date) => longDate.format(new Date(`${date}T12:00:00Z`));

function PageBody({ kicker, title, children }) {
  return (
    <section className="pa-page-body">
      <span className="pa-kicker">{kicker}</span>
      <h1 className="pa-headline">{title}</h1>
      {children}
    </section>
  );
}

export function AboutPage() {
  return (
    <PageBody kicker={ABOUT.kicker} title={ABOUT.title}>
      {ABOUT.paragraphs.map((text) => (
        <p key={text} className="pa-intro-text">{text}</p>
      ))}
      <h2 className="pa-section-kicker pa-section-kicker--spaced">{ABOUT.howTitle}</h2>
      <p className="pa-intro-text">{ABOUT.how}</p>
      <h2 className="pa-section-kicker pa-section-kicker--spaced">{ABOUT.contactTitle}</h2>
      <p className="pa-intro-text">
        Questions or feedback: <a href={`mailto:${ADVERTISE_EMAIL}`}>{ADVERTISE_EMAIL}</a>.
      </p>
      <p><a href="/">Back to today's affirmation</a></p>
    </PageBody>
  );
}

export function AdvertisePage() {
  return (
    <PageBody kicker={ADVERTISE.kicker} title={`Advertise on ${SITE_NAME}`}>
      <p className="pa-intro-text">{ADVERTISE.intro(SITE_NAME)}</p>
      <h2 className="pa-section-kicker pa-section-kicker--spaced">{ADVERTISE.placementsTitle}</h2>
      <ul>
        {ADVERTISE.placements.map((p) => (
          <li key={p.name}><strong>{p.name}</strong>, {p.detail}</li>
        ))}
      </ul>
      <p>{ADVERTISE.note}</p>
      <p>
        {ADVERTISE.contact} <a href={`mailto:${ADVERTISE_EMAIL}`}>{ADVERTISE_EMAIL}</a>.
      </p>
      <p><a href="/">Back to the site</a></p>
    </PageBody>
  );
}

export function ArchivePage({ posts }) {
  const newestFirst = [...posts].reverse();
  return (
    <PageBody kicker={ARCHIVE.kicker} title={ARCHIVE.title}>
      <p className="pa-intro-text">{ARCHIVE.count(posts.length)}</p>
      <ol className="pa-archive-list">
        {newestFirst.map((post) => (
          <li key={post.date}>
            <a href={postPath(post)}>{post.text}</a>
            <span>{prettyDate(post.date)}</span>
          </li>
        ))}
      </ol>
    </PageBody>
  );
}
