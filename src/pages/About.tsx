import { Link } from "react-router-dom";
import { FinalCTA } from "../components/FinalCTA";
import { SectionHeader } from "../components/SectionHeader";
import { StackStrip } from "../components/StackStrip";

const principles = [
  "Do not treat outbound as a one-off campaign.",
  "Make lead movement visible inside the CRM.",
  "Separate verified proof from sample outcomes.",
  "Build handoffs that sales teams can actually operate.",
];

export function About() {
  return (
    <>
      <section className="page-hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>About Aureli</span>
          </div>
          <h1 className="hero-title">A GTM infrastructure agency for outbound teams.</h1>
          <p className="hero-subtitle">
            Aureli builds the operating layer behind outbound: sourcing,
            enrichment, messaging, CRM, booking, and reporting.
          </p>
        </div>
      </section>

      <main>
        <section className="section section--split">
          <SectionHeader
            eyebrow="Philosophy"
            title="Outbound systems should be engineered before they are scaled."
            subtitle="Campaign activity without infrastructure creates hidden manual work, unclear ownership, and unreliable follow-up."
          />
          <div className="proof-card" data-reveal>
            <span className="proof-card__label">What we do</span>
            <h3>We turn outbound motion into an operating system.</h3>
            <p>
              That means lead intelligence, outreach workflows, appointment
              conversion, CRM updates, and reporting are designed together
              instead of patched together later.
            </p>
          </div>
        </section>

        <section className="section section--cases">
          <SectionHeader
            eyebrow="How we work"
            title="Aureli builds with clear scope, visible logic, and documented handoff."
          />
          <div className="case-grid">
            {principles.map((principle) => (
              <article className="case-card" key={principle} data-reveal>
                <span className="case-card__badge">Operating principle</span>
                <h3>{principle}</h3>
                <p>
                  The goal is a system your team can understand, measure, and
                  improve without relying on black-box activity.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <StackStrip />

      <section className="final-cta" data-reveal>
        <div className="final-cta__inner">
          <h2 className="final-cta__title">Start with a GTM systems audit.</h2>
          <p className="final-cta__subtitle">
            Bring your current outbound process, tools, and pipeline goals.
            Aureli will map the infrastructure gaps.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Book GTM audit
          </Link>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
