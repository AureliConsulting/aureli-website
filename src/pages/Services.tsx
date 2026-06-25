import { FinalCTA } from "../components/FinalCTA";
import { FAQItem } from "../components/FAQItem";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { SectionHeader } from "../components/SectionHeader";
import { ServiceCard } from "../components/ServiceCard";
import { StackStrip } from "../components/StackStrip";
import { TrustStrip } from "../components/TrustStrip";
import { faqs } from "../data/faqs";
import { services } from "../data/services";

export function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>GTM Systems / Services</span>
          </div>
          <h1 className="hero-title">Most outbound problems are infrastructure problems.</h1>
          <p className="hero-subtitle">
            Aureli builds the systems behind outbound email, LinkedIn,
            calling, enrichment, appointment conversion, and revenue operations.
          </p>
        </div>
      </section>
      <TrustStrip />

      <main>
        <section className="section pinned-section">
          <div className="pinned-section__title" aria-hidden="true">
            Systems
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="Core systems"
              title="What Aureli builds"
              subtitle="The services are infrastructure modules that can be deployed alone or connected into one outbound operating system."
            />
            <div className="grid grid--systems">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt pinned-section">
          <div className="pinned-section__title" aria-hidden="true">
            Deploy
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="Deployment"
              title="How deployment works"
              subtitle="The build moves from audit to architecture, implementation, QA, launch, and iteration."
            />
            <ProcessTimeline />
          </div>
        </section>

        <StackStrip />

        <section className="section section--faq" id="faq">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions before you deploy"
            subtitle="Clear answers without performance guarantees or invented client claims."
          />
          <div className="faq">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </section>
      </main>

      <FinalCTA />
    </>
  );
}
