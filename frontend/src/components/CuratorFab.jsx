import { useLocation } from 'react-router-dom';
import { useCurator } from '../lib/useCurator.jsx';
import './CuratorFab.css';

export default function CuratorFab() {
  const { open, openCurator } = useCurator();
  const { pathname } = useLocation();
  // Browse/Search carry a contextual inline "Ask the Curator" entry that seeds
  // the typed query — the global FAB there is a redundant second amber entry
  // point, so suppress it (the inline button is the opener on those routes).
  if (pathname.startsWith('/browse')) return null;
  // Stay mounted while the panel is up (visually hidden via CSS) so the overlay
  // can restore focus to this exact button on close — a returned-null FAB would
  // re-mount as a new node and break that focus handoff.
  return (
    <button
      className="curator-fab"
      data-tour="curator"
      onClick={openCurator}
      aria-label="Ask the Curator"
      aria-haspopup="dialog"
      aria-expanded={open}
      hidden={open}
    >
      <span className="curator-fab-spark" aria-hidden="true">✦</span>
      <span className="curator-fab-label">Curator</span>
    </button>
  );
}
