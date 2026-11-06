import { useState } from 'react';
import { isValidEmail, openSignup } from '../subscribe.js';

export default function NewsletterDialog({ onClose }) {
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
    <div className="dialog-backdrop pa-backdrop-top">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pa-newsletter-title">
        <div className="dialog-title" id="pa-newsletter-title">Join the newsletter</div>

        {status === 'sent' ? (
          <>
            <div className="dialog-body">
              Almost there. Check your inbox and click the confirmation link to finish signing up.
            </div>
            <div className="dialog-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="dialog-body">
              One short, kind sentence and a good dog photo, delivered daily. No spam, and you can
              unsubscribe at any time.
            </div>
            <div className="field">
              <label htmlFor="pa-nav-email">Email</label>
              <input
                className="input"
                id="pa-nav-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'invalid') setStatus('idle');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
                autoFocus
              />
              {status === 'invalid' && (
                <p className="pa-form-error" role="alert">Please enter a valid email address.</p>
              )}
            </div>
            <p className="pa-privacy">We use your email only to send the daily affirmation.</p>
            <div className="dialog-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={submit}>
                Join
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
