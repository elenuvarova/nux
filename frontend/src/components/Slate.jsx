// Slate — the running section-label system (N°{n} — Label), ported 1:1 from the
// landing so the app's editorial heads read the same: an amber N°, a short rule,
// and a tracked-caps label. Lead heads only — not on every rail.
export default function Slate({ n, label, center }) {
  return (
    <p className={center ? 'slate center' : 'slate'}>
      <span className="slate-n">N°{n}</span>
      <span className="slate-rule" />
      <span className="slate-label">{label}</span>
    </p>
  );
}
