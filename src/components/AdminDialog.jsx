// Demo sign-in. Like the original, it accepts any password (including none).
export default function AdminDialog({ onClose, onLogin }) {
  return (
    <div className="dialog-backdrop pa-backdrop-top">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pa-login-title">
        <div className="dialog-title" id="pa-login-title">Admin sign in</div>
        <div className="dialog-body">Enter any password to continue — this is a demo login.</div>

        <div className="field">
          <label htmlFor="pa-pass">Password</label>
          <input
            className="input"
            id="pa-pass"
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onLogin();
            }}
            autoFocus
          />
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onLogin}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
