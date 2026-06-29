import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="final-cta" id="final-cta" data-reveal>
      <div className="final-cta__glow" aria-hidden="true" />
      <div className="final-cta__inner">
        <h2 className="final-cta__title">
          Build a predictable outbound system for your business
        </h2>
        <p className="final-cta__subtitle">
          Stop relying on inconsistent outreach and fragmented tools. We design
          GTM infrastructure that turns outbound into a repeatable revenue
          engine.
        </p>
        <div className="hero-cta">
          <Link to="/contact" className="btn btn-primary btn-lg">
            Book GTM Audit
          </Link>
          <Link to="/services" className="btn btn-ghost">
            View Systems
          </Link>
        </div>
      </div>
    </section>
  );
}
