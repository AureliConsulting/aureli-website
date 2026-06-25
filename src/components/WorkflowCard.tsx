import type { KeyboardEvent } from "react";
import type { WorkflowItem } from "../data/types";
import { getStatusDotClass, getStatusLabel, getTechClass } from "../utils/workflow";

interface WorkflowCardProps {
  workflow: WorkflowItem;
  onOpen: (workflow: WorkflowItem) => void;
}

export function WorkflowCard({ workflow, onOpen }: WorkflowCardProps) {
  const open = () => onOpen(workflow);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  return (
    <article
      className={`wf-card ${workflow.categoryStyle}-card card-visible`}
      role="listitem"
      tabIndex={0}
      aria-label={`${workflow.title}. Open case study details.`}
      onClick={open}
      onKeyDown={onKeyDown}
      data-aos="fade-up"
    >
      <div className="card-header">
        <div className="card-status">
          <span className={`status-dot ${getStatusDotClass(workflow.status)}`} aria-hidden="true" />
          <span className="status-label">{getStatusLabel(workflow.status)}</span>
        </div>
        <span
          className={`card-type-badge ${
            workflow.categoryStyle === "n8n"
              ? "n8n-type"
              : workflow.categoryStyle === "agent"
                ? "ai-type"
                : "hybrid-type"
          }`}
        >
          {workflow.category}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{workflow.title}</h3>
        <p className="card-desc">{workflow.shortDesc}</p>

        <div className="case-study-fields">
          <div>
            <span>Problem</span>
            <p>{workflow.problem}</p>
          </div>
          <div>
            <span>System built</span>
            <p>{workflow.systemBuilt}</p>
          </div>
        </div>

        <div className="card-tech">
          {workflow.tech.map((tech) => (
            <span key={tech} className={`tech-badge ${getTechClass(tech)}`}>
              {tech}
            </span>
          ))}
        </div>

        <div className="complexity-bar">
          <div className="complexity-label-row">
            <span className="complexity-label-text">Build complexity</span>
            <span className="complexity-label-pct">{workflow.complexity}%</span>
          </div>
          <div className="complexity-track">
            <div
              className="complexity-fill"
              data-width={workflow.complexity}
              style={{ width: 0 }}
            />
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="card-cta" type="button" onClick={open}>
          View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <span className="card-steps">#{workflow.id.split("-")[1]}</span>
      </div>
    </article>
  );
}
