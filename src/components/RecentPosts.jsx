import { useEffect, useId, useRef, useState } from 'react';
import { postPath } from '../posts.js';
import { TIME_ZONE } from '../todaysPost.js';

const shortDate = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, month: 'short', day: 'numeric' });

// A floating button that opens a list of the most recent affirmations.
// On a desktop it opens a panel above the button. On a phone the panel becomes a
// bottom sheet. Each item is a real link, so search engines and visitors can follow them.
export default function RecentPosts({ posts }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelId = useId();

  // Escape closes the panel, and so does a click anywhere outside it.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    function onPointer(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (posts.length === 0) return null;

  return (
    <div className="pa-fab-wrap" ref={wrapRef}>
      {open && (
        <div id={panelId} className="card elev-lg pa-fab-panel" role="region" aria-label="Recent affirmations">
          <div className="pa-fab-head">
            <span className="card-title">Recent affirmations</span>
            <button type="button" className="pa-fab-close" aria-label="Close recent affirmations" onClick={() => setOpen(false)}>
              <i className="ph-duotone ph-x" />
            </button>
          </div>
          <ol className="pa-fab-list">
            {posts.map((post) => (
              <li key={post.date}>
                <a href={postPath(post)}>
                  <span className="pa-fab-date">{shortDate.format(new Date(`${post.date}T12:00:00Z`))}</span>
                  <span className="pa-fab-text">{post.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        type="button"
        className="pa-fab"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="ph-duotone ph-list-bullets" aria-hidden="true" />
        <span>Recent</span>
      </button>
    </div>
  );
}
