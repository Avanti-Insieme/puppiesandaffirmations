import Calendar from './Calendar.jsx';
import ThemePicker from './ThemePicker.jsx';

// The Admin button is hidden for now. See README: the admin panel has no real
// sign-in, so it stays off until a real login is added.
export default function Nav({ themeKey, onSelectTheme, onOpenNewsletter }) {
  return (
    <nav className="nav pa-nav">
      <span className="nav-brand pa-brand">
        <i className="ph-duotone ph-paw-print" />
        Puppies &amp; Affirmations
      </span>

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
