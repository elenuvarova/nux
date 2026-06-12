import { useToasts, dismiss, pause, resume } from '../lib/toast.js';
import './ToastHost.css';

export default function ToastHost() {
  const toasts = useToasts();
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          className="toast"
          key={t.id}
          // pause the dismiss timer while the toast is hovered or focused,
          // so its action stays reachable (Timing Adjustable)
          onMouseEnter={() => pause(t.id)}
          onMouseLeave={() => resume(t.id, t.duration)}
          onFocus={() => pause(t.id)}
          onBlur={() => resume(t.id, t.duration)}
        >
          <svg className="toast-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
          <span>{t.message}</span>
          {t.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                t.action.onClick();
                dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
