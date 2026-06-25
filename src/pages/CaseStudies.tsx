import { useMemo, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { WorkflowCard } from "../components/WorkflowCard";
import { workflowFilters, workflows } from "../data/workflows";
import type { WorkflowItem } from "../data/types";

interface CaseStudiesProps {
  onOpenWorkflow: (workflow: WorkflowItem) => void;
}

export function CaseStudies({ onOpenWorkflow }: CaseStudiesProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredWorkflows = useMemo(
    () =>
      activeFilter === "all"
        ? workflows
        : workflows.filter((workflow) => workflow.categoryStyle === activeFilter),
    [activeFilter],
  );

  return (
    <>
      <section className="page-hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Case Studies</span>
          </div>
          <h1 className="hero-title">Example GTM systems and workflow builds.</h1>
          <p className="hero-subtitle">
            These are presented as example systems and sample outcomes, not
            client testimonials or verified performance metrics.
          </p>
        </div>
      </section>

      <main>
        <section className="section section--workflows pinned-section" id="workflows">
          <div className="pinned-section__title" aria-hidden="true">
            Studies
          </div>
          <div className="pinned-section__content">
            <SectionHeader
              eyebrow="Case study library"
              title="Built infrastructure, not just promises"
              subtitle="Each card shows the problem, system built, tools used, and neutral outcome language."
              centered
            />
            <div className="filter-bar" data-reveal role="tablist" aria-label="Filter case studies">
              {workflowFilters.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-btn${activeFilter === value ? " active" : ""}`}
                  onClick={() => setActiveFilter(value)}
                  aria-pressed={activeFilter === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="workflow-grid" role="list">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} onOpen={onOpenWorkflow} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
