import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { bookingUrl, brandName, navLinks } from "../data/nav";
import type { Theme } from "../hooks/useTheme";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handler = () => {
      nav.classList.toggle("nav--scrolled", window.scrollY > 24);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="nav" ref={navRef} id="nav" aria-label="Primary">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo" aria-label={`${brandName} Home`}>
          <svg
            className="logo-icon"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
          >
            <polygon
              points="11,1 20,6 20,16 11,21 2,16 2,6"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <polygon
              points="11,6 16,9 16,14 11,17 6,14 6,9"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
          <span className="logo-text">{brandName}</span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="primary-menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links${isOpen ? " nav-links--open" : ""}`} id="primary-menu">
          {navLinks.map(({ label, href }) => (
            <NavLink key={label} to={href}>
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
          <a href={bookingUrl} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
            Book GTM audit
          </a>
        </div>
      </div>
    </nav>
  );
}
