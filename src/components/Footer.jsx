import { useState } from 'react';
import { isValidEmail, openSignup } from '../subscribe.js';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | invalid | sent

  function submit() {
    if (!isValidEmail(email)) {
      setStatus('invalid');
      return;
    }
    openSignup(email);
    setStatus('sent');
  }

  return (
    <footer className="pa-footer">
      <div className="pa-wrap">
        <section className="pa-footer-signup">
          <h3 className="pa-footer-title">Get today's affirmation in your inbox</h3>

          {status === 'sent' ? (
            <p className="pa-subscribed">
              <i className="ph-duotone ph-envelope-simple" />
              Almost there. Check your inbox and click the confirmation link to finish signing up.
            </p>
          ) : (
            <>
              <p className="pa-footer-lede">
                One short, kind sentence and a good dog photo, delivered daily. No spam, and you can
                unsubscribe at any time.
              </p>
              <div className="pa-form-row">
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'invalid') setStatus('idle');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                  }}
                />
                <button type="button" className="btn btn-primary" onClick={submit}>
                  Join
                </button>
              </div>
              {status === 'invalid' && (
                <p className="pa-form-error" role="alert">Please enter a valid email address.</p>
              )}
              <p className="pa-privacy">
                We use your email only to send the daily affirmation.
              </p>
            </>
          )}
        </section>

        <div className="pa-footer-meta">
          <span>Puppies &amp; Affirmations: a small, calm corner of the internet.</span>
          <span className="tag tag-outline">Sponsored placements support this site</span>
        </div>
      </div>
    </footer>
  );
}
