import { Link } from 'react-router-dom';
import { LeafIcon } from './icons';

type LegalLink = {
  to: string;
  label: string;
};

const LEGAL_LINKS: readonly LegalLink[] = [
  { to: '/confidentialite', label: 'Confidentialite' },
  { to: '/cgu', label: 'CGU' },
  { to: '/contact', label: 'Contact' },
];

function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container lp-footer-inner">
        <div className="lp-brand">
          <span className="lp-brand-mark">
            <LeafIcon className="lp-brand-icon" />
          </span>
          <span className="lp-brand-name">BioWatch</span>
        </div>
        <p className="lp-footer-copy">(c) 2026 BioWatch. Tous droits reserves.</p>
        <nav className="lp-footer-links" aria-label="Liens legaux">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="lp-footer-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default LandingFooter;
