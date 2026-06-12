import { useCurator } from '../lib/useCurator.jsx';
import './CuratorFab.css';

export default function CuratorFab() {
  const { open, openCurator } = useCurator();
  if (open) return null; // hide while the panel is up
  return (
    <button className="curator-fab" onClick={openCurator} aria-label="Ask the Curator">
      <span aria-hidden="true">✦</span>
      <span className="curator-fab-label">Curator</span>
    </button>
  );
}
