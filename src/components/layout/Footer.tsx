import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-white border-t border-border pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 inline-flex">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
                  <rect x="8" y="6" width="3" height="12" rx="1.5" fill="currentColor" />
                  <rect x="13" y="4" width="3" height="16" rx="1.5" fill="currentColor" />
                  <rect x="18" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-navy">
                ProxiSpeak
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              The spatial audio virtual office that feels human. Move closer to talk and bring the natural hallway conversation to your remote team.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="hover:text-primary transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" onClick={(e) => handleNavClick(e, '#demo')} className="hover:text-primary transition-colors">
                  Interactive demo
                </a>
              </li>
              <li>
                <a href="#for-teams" onClick={(e) => handleNavClick(e, '#for-teams')} className="hover:text-primary transition-colors">
                  Use cases
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">
                  Create room / Sign up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Note */}
          <div>
            <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">
              Transparency
            </h4>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              ProxiSpeak Phase 1 is in active development. Official terms of service and privacy policies will be published before public general availability.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-text-muted/80">
              <span className="italic">Privacy Policy (In preparation)</span>
              <span className="italic">Terms of Service (In preparation)</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} ProxiSpeak. All rights reserved.</p>
          <p>Designed for spontaneous, human-first remote collaboration.</p>
        </div>
      </Container>
    </footer>
  );
};
