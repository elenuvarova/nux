import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-wordmark">NUX</span>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/p/about">About</Link>
          <Link to="/p/help">Help</Link>
          <Link to="/p/privacy">Privacy</Link>
          <Link to="/p/terms">Terms</Link>
          <a className="footer-ext" href="https://nux.ontwrpn.com">Marketing site ↗</a>
          <span className="footer-copy">© 2026 NUX</span>
        </nav>
      </div>
    </footer>
  );
}
