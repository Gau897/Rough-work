import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'For teams', href: '#for-teams' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-b border-border'
          : 'bg-white border-b border-border/60'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            aria-label="ProxiSpeak Home"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-text-muted hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1.5 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Links (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/app"
              className="text-sm font-semibold text-primary hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-navy hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-text-muted hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-base font-medium text-text-muted hover:text-navy hover:bg-surface-bg rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-border flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-navy hover:text-primary text-center"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-2.5 bg-primary text-white text-center font-bold text-sm rounded-lg shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};
