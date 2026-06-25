import { NavLink } from "react-router-dom";
import { brandName, navLinks } from "../data/nav";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-text footer-logo">{brandName}</span>
            <p className="footer-tagline">
              GTM infrastructure for outbound teams.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {navLinks.map(({ label, href }) => (
              <NavLink key={label} to={href}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            Built with <span className="tech-pill">n8n</span>{" "}
            <span className="tech-pill">HubSpot</span>{" "}
            <span className="tech-pill">Apollo</span>{" "}
            <span className="tech-pill">Clay</span>
          </p>
          <p className="footer-copy">
            &copy; {currentYear} {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
