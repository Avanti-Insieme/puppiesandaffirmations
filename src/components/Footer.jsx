import { useState } from 'react';

export default function Footer({ subscribed, onSubscribe }) {
  const [email, setEmail] = useState('');

  function submit() {
    if (!email.trim()) return;
    onSubscribe();
  }

  return (
    <footer className="pa-footer">
      <div className="pa-wrap">
        <section className="pa-footer-signup">
          <h3 className="pa-footer-title">Get today's affirmation in your inbox</h3>

          {subscribed ? (
            <p className="pa-subscribed">
              <i className="ph-duotone ph-check-circle" />
              You're on the list — one gentle note each morning.
            </p>
          ) : (
            <>
              <p className="pa-footer-lede">
                One short, kind sentence and a good dog photo — delivered daily, no spam.
              </p>
              <div className="pa-form-row">
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                  }}
                />
                <button type="button" className="btn btn-primary" onClick={submit}>
                  Join
                </button>
              </div>
            </>
          )}
        </section>

        <div className="pa-footer-meta">
          <span>Puppies &amp; Affirmations — a small, calm corner of the internet.</span>
          <span className="tag tag-outline">Sponsored placements support this site</span>
        </div>
      </div>
    </footer>
  );
}
