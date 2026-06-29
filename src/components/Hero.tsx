import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-content" data-reveal>
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>GTM infrastructure for outbound teams</span>
        </div>
        <h1 className="hero-title">
          We build outbound and GTM capabilities that provide consistent
          pipeline flow.
        </h1>
        <p className="hero-subtitle">
          Cold email, LinkedIn outreach, lead generation, and CRM automation;
          designed for scaling revenues, not activity.
        </p>
        <div className="hero-cta">
          <Link to="/contact" className="btn btn-primary">
            Book Audit Now
          </Link>
          <Link to="/services" className="btn btn-ghost btn-ghost--light">
            View Systems
          </Link>
        </div>
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
