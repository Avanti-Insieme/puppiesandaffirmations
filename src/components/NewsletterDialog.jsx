import { useState } from 'react';

export default function NewsletterDialog({ subscribed, onSubscribe, onClose }) {
  const [email, setEmail] = useState('');

  function submit() {
    if (!email.trim()) return;
    onSubscribe();
  }

  return (
    <div className="dialog-backdrop pa-backdrop-top">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pa-newsletter-title">
        <div className="dialog-title" id="pa-newsletter-title">Join the newsletter</div>

        {subscribed ? (
          <>
            <div className="dialog-body">
              <i className="ph-duotone ph-check-circle pa-inline-check" />
              You're on the list — one gentle note each morning.
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
              One short, kind sentence and a good dog photo — delivered daily, no spam.
            </div>
            <div className="field">
              <label htmlFor="pa-nav-email">Email</label>
              <input
                className="input"
                id="pa-nav-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
                autoFocus
              />
            </div>
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
