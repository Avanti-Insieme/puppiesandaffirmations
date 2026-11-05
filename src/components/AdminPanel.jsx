import { useState } from 'react';
import { PRESETS } from '../data.js';

export default function AdminPanel({ affirmation, onSaveAffirmation, onApplyImage, onClose, onLogout }) {
  const [imageUrl, setImageUrl] = useState('');
  const [draft, setDraft] = useState(affirmation);

  function applyUrl() {
    const url = imageUrl.trim();
    if (url) onApplyImage(url);
  }

  function useMessage() {
    onSaveAffirmation(draft);
  }

  function pickPreset(text) {
    setDraft(text);
    onSaveAffirmation(text);
  }

  return (
    <div className="dialog-backdrop pa-backdrop-top">
      <div className="dialog pa-admin-dialog" role="dialog" aria-modal="true" aria-labelledby="pa-admin-title">
        <div className="pa-admin-head">
          <div className="dialog-title" id="pa-admin-title">Site controls</div>
          <button type="button" className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <i className="ph-duotone ph-x" />
          </button>
        </div>

        <div>
          <span className="pa-section-kicker">Hero photo</span>
          <div className="field">
            <label htmlFor="pa-img-url">Image URL</label>
            <div className="pa-row">
              <input
                className="input"
                id="pa-img-url"
                type="text"
                placeholder="https://…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button type="button" className="btn btn-secondary" onClick={applyUrl}>
                Apply
              </button>
            </div>
          </div>
          <p className="pa-hint">Or drag a photo directly onto the hero image on the page.</p>
        </div>

        <div>
          <span className="pa-section-kicker pa-section-kicker--spaced">Affirmation message</span>
          <div className="field">
            <label htmlFor="pa-affirm">Custom message</label>
            <textarea
              className="input"
              id="pa-affirm"
              placeholder="Write today's affirmation…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={useMessage}>
            Use this message
          </button>

          <p className="pa-hint pa-hint--spaced">Or pick a preset:</p>
          <div className="pa-presets">
            {PRESETS.map((text) => (
              <button
                key={text}
                type="button"
                className={`btn btn-secondary pa-preset${text === draft ? ' is-active' : ''}`}
                onClick={() => pickPreset(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog-actions pa-admin-actions">
          <button type="button" className="btn btn-ghost" onClick={onLogout}>
            <i className="ph-duotone ph-sign-out" />
            Log out
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
