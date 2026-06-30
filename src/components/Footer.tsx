import { NavLink } from "react-router-dom";
import { brandName, navLinks } from "../data/nav";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const socials = ["YT", "DC", "IN", "X"];

  return (
    <footer className="footer">
      <div className="footer-gradient" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-text footer-logo">{brandName}</span>
            <p className="footer-tagline">
              GTM infrastructure for outbound teams.
            </p>
            <div className="footer-socials" aria-label="Social links placeholder">
              {socials.map((social) => (
                <span key={social}>{social}</span>
              ))}
            </div>
            <div className="footer-bottom">
              <p className="footer-copy">
                &copy; {currentYear} {brandName}. All rights reserved.
              </p>
              <p>
                Built with <span className="tech-pill">n8n</span>{" "}
                <span className="tech-pill">HubSpot</span>{" "}
                <span className="tech-pill">Apollo</span>{" "}
                <span className="tech-pill">Clay</span>
              </p>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {navLinks.map(({ label, href }) => (
              <NavLink key={label} to={href}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
