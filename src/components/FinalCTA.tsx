import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="final-cta" id="final-cta" data-reveal>
      <div className="final-cta__glow" aria-hidden="true" />
      <div className="final-cta__inner">
        <h2 className="final-cta__title">
          Build the outbound infrastructure behind consistent pipeline flow.
        </h2>
        <p className="final-cta__subtitle">
          Aureli designs the systems that connect targeting, outreach,
          enrichment, CRM updates, and appointment conversion.
        </p>
        <div className="hero-cta">
          <Link to="/contact" className="btn btn-primary btn-lg">
            Book GTM audit
          </Link>
          <Link to="/services" className="btn btn-ghost">
            View systems
          </Link>
        </div>
      </div>
    </section>
  );
}
