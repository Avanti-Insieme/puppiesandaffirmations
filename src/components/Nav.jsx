import Calendar from './Calendar.jsx';
import ThemePicker from './ThemePicker.jsx';

// The header links to the archive and the About page. The brand links home.
export default function Nav({ themeKey, onSelectTheme, onOpenNewsletter }) {
  return (
    <nav className="nav pa-nav">
      <a className="nav-brand pa-brand" href="/">
        <i className="ph-duotone ph-paw-print" />
        Puppies &amp; Affirmations
      </a>

      <div className="pa-nav-links">
        <a href="/affirmations/">Archive</a>
        <a href="/about">About</a>
      </div>

      <div className="pa-nav-actions">
        <Calendar />
        <ThemePicker themeKey={themeKey} onSelect={onSelectTheme} />

        <button type="button" className="btn btn-secondary" onClick={onOpenNewsletter}>
          <i className="ph-duotone ph-envelope-simple-open" />
          Newsletter
        </button>
      </div>
    </nav>
  );
}
