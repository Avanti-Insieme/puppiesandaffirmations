import Calendar from './Calendar.jsx';
import ThemePicker from './ThemePicker.jsx';

export default function Nav({ affirmation, themeKey, onSelectTheme, onOpenNewsletter, onOpenAdmin }) {
  return (
    <nav className="nav pa-nav">
      <span className="nav-brand pa-brand">
        <i className="ph-duotone ph-paw-print" />
        Puppies &amp; Affirmations
      </span>

      <div className="pa-nav-actions">
        <Calendar affirmation={affirmation} />
        <ThemePicker themeKey={themeKey} onSelect={onSelectTheme} />

        <button type="button" className="btn btn-secondary" onClick={onOpenNewsletter}>
          <i className="ph-duotone ph-envelope-simple-open" />
          Newsletter
        </button>

        <button type="button" className="btn btn-ghost" onClick={onOpenAdmin}>
          <i className="ph-duotone ph-lock-key" />
          Admin
        </button>
      </div>
    </nav>
  );
}
