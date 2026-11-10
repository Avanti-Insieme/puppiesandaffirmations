// Shown in an ad box when no ad is running. It invites visitors to subscribe,
// using the same signup dialog as the rest of the site.
export default function NewsletterCard({ variant = 'box', onOpen }) {
  return (
    <div className={`pa-news-card pa-news-card--${variant}`}>
      <div className="pa-news-copy">
        <p className="pa-news-title">
          <i className="ph-duotone ph-envelope-simple-open" aria-hidden="true" />
          A daily affirmation, by email
        </p>
        <p className="pa-news-text">One short note and one dog photo, every morning.</p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onOpen}>
        Subscribe
      </button>
    </div>
  );
}
