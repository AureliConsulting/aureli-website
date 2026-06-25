import { Link } from "react-router-dom";
import { FinalCTA } from "../components/FinalCTA";
import { Hero } from "../components/Hero";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { SectionHeader } from "../components/SectionHeader";
import { ServiceCard } from "../components/ServiceCard";
import { StackStrip } from "../components/StackStrip";
import { TrustStrip } from "../components/TrustStrip";
import { WorkflowCard } from "../components/WorkflowCard";
import { services } from "../data/services";
import { proofBlocks, sampleOutcomes } from "../data/testimonials";
import { workflows } from "../data/workflows";
import type { WorkflowItem } from "../data/types";

interface HomeProps {
  onOpenWorkflow: (workflow: WorkflowItem) => void;
}

export function Home({ onOpenWorkflow }: HomeProps) {
  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="philosophy" id="philosophy" data-reveal>
        <p className="philosophy__text">
          Outbound isn&apos;t a campaign.
          <br />
          It&apos;s <span className="philosophy__accent gradient-text">infrastructure</span>.
        </p>
      </section>

      <section className="about-video" id="about" data-reveal>
        <div className="about-video__media">
          <img
            src="/images/workflows/workflow.png"
            alt="Outbound infrastructure workflow preview"
            className="about-video__poster"
            loading="lazy"
          />
          <div className="about-video__overlay" aria-hidden="true" />
        </div>
        <div className="about-video__copy">
          <span className="section__eyebrow">Who we are</span>
          <h2 className="about-video__title">
            Aureli designs outbound infrastructure, not isolated automation.
          </h2>
          <p className="about-video__desc">
            We connect targeting, messaging, enrichment, CRM operations, and
            appointment conversion into systems that are easier to manage,
            measure, and improve.
          </p>
          <Link className="btn btn-ghost" to="/about">
            Learn about Aureli
          </Link>
        </div>
      </section>

      <StackStrip />

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
              {services.slice(0, 6).map((service) => (
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
              title="Example systems built around business outcomes"
              subtitle="These cards describe example builds and sample outcomes. They are not client testimonials or verified performance claims."
              centered
            />
            <div className="workflow-grid" role="list">
              {workflows.slice(0, 3).map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} onOpen={onOpenWorkflow} />
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
