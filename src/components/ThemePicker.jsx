import { useState } from 'react';
import { THEMES } from '../data.js';

export default function ThemePicker({ themeKey, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pa-popover-wrap">
      <button
        type="button"
        className="btn btn-icon btn-ghost"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose a color theme"
      >
        <i className="ph-duotone ph-palette" />
      </button>

      {open && (
        <div className="card elev-lg pa-popover pa-theme-menu">
          <span className="card-title pa-menu-title">Color theme</span>
          {THEMES.map((theme) => {
            const active = theme.key === themeKey;
            return (
              <button
                key={theme.key}
                type="button"
                className={`pa-theme-opt${active ? ' is-active' : ''}`}
                onClick={() => {
                  onSelect(theme.key);
                  setOpen(false);
                }}
              >
                <span className="pa-swatch" style={{ background: theme.ramp[4] }} />
                {theme.label}
                {active && <i className="ph-duotone ph-check pa-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
