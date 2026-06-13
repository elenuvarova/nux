import { useCurator } from '../lib/useCurator.jsx';
import './CuratorFab.css';

export default function CuratorFab() {
  const { open, openCurator } = useCurator();
  // Stay mounted while the panel is up (visually hidden via CSS) so the overlay
  // can restore focus to this exact button on close — a returned-null FAB would
  // re-mount as a new node and break that focus handoff.
  return (
    <button
      className="curator-fab"
      onClick={openCurator}
      aria-label="Ask the Curator"
      hidden={open}
    >
      <span aria-hidden="true">✦</span>
      <span className="curator-fab-label">Curator</span>
    </button>
  );
}
