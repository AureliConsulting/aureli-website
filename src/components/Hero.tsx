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
          We build{" "}
          <span className="hero-word-blur gradient-text" data-text="outbound">
            outbound
          </span>
          <br />
          and{" "}
          <span className="hero-word-blur gradient-text" data-text="GTM">
            GTM
          </span>{" "}
          capabilities that provide consistent pipeline flow.
        </h1>
        <p className="hero-subtitle">
          Cold email, LinkedIn outreach, lead intelligence, appointment
          conversion, and CRM automation designed as one connected operating
          system.
        </p>
        <p className="hero-subline">
          Outbound is not a campaign. It is infrastructure.
        </p>
        <div className="hero-cta">
          <Link to="/contact" className="btn btn-primary">
            Book GTM audit
          </Link>
          <Link to="/case-studies" className="btn btn-ghost btn-ghost--light">
            View systems
          </Link>
        </div>
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
