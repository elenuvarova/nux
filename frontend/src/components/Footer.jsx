import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-wordmark">NUX</span>
        <nav className="footer-links" aria-label="Footer">
          <a href="#about">About</a>
          <a href="#help">Help</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <span className="footer-copy">© 2026 NUX</span>
        </nav>
      </div>
    </footer>
  );
}
