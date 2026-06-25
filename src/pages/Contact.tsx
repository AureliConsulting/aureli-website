import { ContactScheduler } from "../components/ContactScheduler";
import { FAQItem } from "../components/FAQItem";
import { FinalCTA } from "../components/FinalCTA";
import { SectionHeader } from "../components/SectionHeader";
import { auditScope, contactChannels } from "../data/contact";
import { faqs } from "../data/faqs";
import type { Theme } from "../hooks/useTheme";

interface ContactProps {
  theme: Theme;
}

export function Contact({ theme }: ContactProps) {
  return (
    <>
      <section className="page-hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Book a GTM audit</span>
          </div>
          <h1 className="hero-title">Map the outbound system your pipeline needs.</h1>
          <p className="hero-subtitle">
            The audit reviews your current GTM motion, tooling, handoffs, and
            operational gaps before any build is scoped.
          </p>
        </div>
      </section>

      <main>
        <section className="section section--contact" id="contact">
          <div className="contact__content" data-reveal>
            <span className="contact__tag">Audit scope</span>
            <h2 className="section__title">What the audit covers</h2>
            <p className="section__subtitle">
              This is a working session for identifying infrastructure gaps,
              not a fake diagnostic with promised performance numbers.
            </p>
            <ul className="contact__channels">
              {auditScope.map((item) => (
                <li key={item}>
                  <div>
                    <span className="contact__channel-label">Review area</span>
                    <strong className="contact__channel-detail">{item}</strong>
                  </div>
                </li>
              ))}
            </ul>
            <div className="qualification-form" aria-label="Qualification form placeholder">
              <span className="contact__channel-label">Qualification form</span>
              <p>
                Placeholder: replace with your real form provider when ready.
                Until then, the Cal.com booking collects scheduling details.
              </p>
            </div>
            <ul className="contact__channels">
              {contactChannels.map(({ label, detail }) => (
                <li key={label}>
                  <div>
                    <span className="contact__channel-label">{label}</span>
                    <strong className="contact__channel-detail">{detail}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ContactScheduler theme={theme} />
        </section>

        <section className="section section--cases">
          <SectionHeader eyebrow="What to expect" title="A practical audit, then a scoped build plan." />
          <div className="case-grid">
            {["Current-state review", "Infrastructure gap map", "Build sequence recommendation"].map((item) => (
              <article className="case-card" key={item} data-reveal>
                <span className="case-card__badge">Audit step</span>
                <h3>{item}</h3>
                <p>
                  The session focuses on system design, handoff clarity, and
                  the next practical deployment step.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--faq" id="faq">
          <SectionHeader eyebrow="FAQ" title="Questions before you book" />
          <div className="faq">
            {faqs.slice(0, 4).map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </section>
      </main>

      <FinalCTA />
    </>
  );
}
