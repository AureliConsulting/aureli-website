import { Link } from "react-router-dom";
import { FinalCTA } from "../components/FinalCTA";
import { Hero } from "../components/Hero";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { SectionHeader } from "../components/SectionHeader";
import { ServiceCard } from "../components/ServiceCard";
import { TrustStrip } from "../components/TrustStrip";
import { services } from "../data/services";
import { proofBlocks, sampleOutcomes } from "../data/testimonials";
import { workflows } from "../data/workflows";
import type { WorkflowItem } from "../data/types";

interface HomeProps {
  onOpenWorkflow: (workflow: WorkflowItem) => void;
}

const homeSystems = [
  "Outbound Email Infrastructure",
  "LinkedIn Pipeline System",
  "Lead Intelligence & Enrichment",
  "Appointment Conversion System",
  "CRM & Revenue Operations",
  "Cold Calling Infrastructure",
]
  .map((title) => services.find((service) => service.title === title))
  .filter((service): service is (typeof services)[number] => Boolean(service));

export function Home({ onOpenWorkflow }: HomeProps) {
  return (
    <>
      <Hero />
      <TrustStrip />

      <div className="home-video-about-flow">
        <section className="home-video-section" aria-label="Who we are video placeholder">
          <div className="home-video-card">
            <div className="home-video-card__poster" role="img" aria-label="Placeholder for Aureli who we are video">
              <div className="home-video-card__mark">
                <span>The</span>
                <strong>System</strong>
              </div>
              <div className="home-video-card__copy">
                <span>[ ] Who we are / what we do</span>
                <p>
                  Outbound systems are not static anymore. Pipeline needs
                  sourcing, enrichment, outreach, CRM tracking, and booking
                  working as one motion.
                </p>
              </div>
              <button className="home-video-card__play" type="button" aria-label="Video placeholder">
                Placeholder video
              </button>
            </div>
          </div>
        </section>

        <section className="home-about" id="about" data-reveal>
          <div className="home-about__panel home-about__heading">
            <span className="section__eyebrow">Brief about</span>
            <h2>Aureli turns outbound motion into operating infrastructure.</h2>
          </div>
          <div className="home-about__panel home-about__copy">
            <div className="home-about__video-dock" aria-hidden="true" />
            <p>
              Aureli designs and deploys the infrastructure behind modern
              outbound - connecting lead sourcing, enrichment, outreach,
              follow-ups, CRM tracking, and appointment booking into one
              repeatable revenue engine.
            </p>
            <Link className="btn btn-ghost" to="/about">
              Learn about Aureli
            </Link>
          </div>
        </section>
      </div>

      <section className="philosophy" id="philosophy" data-reveal>
        <p className="philosophy__text">
          Outbound isn&apos;t a campaign.
          <br />
          It&apos;s <span className="philosophy__accent gradient-text">infrastructure</span>.
        </p>
      </section>

      <main>
        <section className="section pinned-section" id="services">
          <div className="pinned-section__title" aria-hidden="true">
            Systems
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="What we build"
              title="Core systems that power predictable pipeline"
              subtitle="Each system is designed to remove operational bottlenecks and create a more consistent outbound process."
            />
            <div className="grid grid--systems">
              {homeSystems.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--workflows pinned-section" id="workflows">
          <div className="pinned-section__title" aria-hidden="true">
            Showcase
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="Case study preview"
              title="Systems showcase"
              subtitle="Example workflow builds, framed around the operational problem solved and the system created."
              centered
            />
            <div className="home-showcase-grid" role="list">
              {workflows.slice(0, 3).map((workflow) => (
                <article
                  className="home-showcase-card"
                  key={workflow.id}
                  role="listitem"
                  tabIndex={0}
                  onClick={() => onOpenWorkflow(workflow)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpenWorkflow(workflow);
                    }
                  }}
                >
                  <div className="home-showcase-card__preview" aria-hidden="true">
                    {workflow.images?.[0] ? (
                      <img src={workflow.images[0]} alt="" loading="lazy" />
                    ) : (
                      <div className="home-showcase-card__placeholder">
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                  </div>
                  <div className="home-showcase-card__body">
                    <span className="case-card__badge">{workflow.category}</span>
                    <h3>{workflow.title}</h3>
                    <div className="home-showcase-card__tools">
                      {workflow.toolsUsed.slice(0, 4).map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                    <p>
                      <strong>Problem solved:</strong> {workflow.problem}
                    </p>
                    <p>
                      <strong>Outcome:</strong> {workflow.outcome}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt pinned-section" id="process">
          <div className="pinned-section__title" aria-hidden="true">
            Process
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="How it works"
              title="Deployment starts with the GTM motion"
              subtitle="Every outbound system is built around your offer, ICP, sales process, and operational workflow."
            />
            <ProcessTimeline />
          </div>
        </section>

        <section className="section section--proof pinned-section" id="proof">
          <div className="pinned-section__title" aria-hidden="true">
            Proof
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="Proof blocks"
              title="Credibility without fake testimonials"
              subtitle="Neutral proof areas describe what the systems include without inventing client metrics."
            />
            <div className="proof-pin" data-reveal>
              <div className="proof-pin__track">
                {[...proofBlocks, ...sampleOutcomes].map(({ title, detail }, index) => (
                  <article className="proof-card" key={`${title}-${index}`}>
                    <span className="proof-card__label">
                      {index < proofBlocks.length ? "Proof block" : "Sample outcome"}
                    </span>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <FinalCTA />
    </>
  );
}
