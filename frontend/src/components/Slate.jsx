// Slate — the running section-label system (N°{n} — Label), ported 1:1 from the
// landing so the app's editorial heads read the same: an amber N°, a short rule,
// and a tracked-caps label. Lead heads only — not on every rail.
export default function Slate({ n, label, center }) {
  // App sections aren't numbered, so callers pass n="—" — which rendered a
  // broken-looking "N°—". When there's no real ordinal, drop the N° and lead
  // with just the rule + label (a clean editorial eyebrow).
  const hasNum = n != null && n !== '' && n !== '—';
  // The short rule only reads as a connector between a number and its label.
  // Without a number it just floats, so unnumbered heads are the clean label alone.
  return (
    <p className={center ? 'slate center' : 'slate'}>
      {hasNum && <span className="slate-n">N°{n}</span>}
      {hasNum && <span className="slate-rule" />}
      <span className="slate-label">{label}</span>
    </p>
  );
}
