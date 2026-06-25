import { Fragment, useEffect, useRef, useState } from "react";
import type { WorkflowItem } from "../data/types";
import { getStatusLabel, getTechClass } from "../utils/workflow";

interface WorkflowModalProps {
  workflow: WorkflowItem | null;
  onClose: () => void;
}

export function WorkflowModal({ workflow, onClose }: WorkflowModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = workflow?.images ?? [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (workflow && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (!workflow && dialog.open) {
      dialog.close();
    }
  }, [workflow]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!workflow) return;
      if (event.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      }
      if (lightboxIndex !== null && images.length > 1) {
        if (event.key === "ArrowLeft") {
          setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
        }
        if (event.key === "ArrowRight") {
          setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, lightboxIndex, onClose, workflow]);

  const close = () => {
    setLightboxIndex(null);
    onClose();
  };

  return (
    <dialog
      className="workflow-modal"
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="modal-title"
      onClose={close}
    >
      <div className="modal-backdrop" onClick={close} />
      <div className="modal-panel">
        <button
          ref={closeButtonRef}
          className="modal-close"
          onClick={close}
          aria-label="Close modal"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {workflow && (
          <div>
            <div
              className={`section-eyebrow ${
                workflow.categoryStyle === "n8n" ? "n8n-eyebrow" : "ai-eyebrow"
              } modal-eyebrow`}
            >
              {workflow.category}
            </div>
            <h2 className="modal-title" id="modal-title">
              {workflow.title}
            </h2>

            <div className="modal-flow" aria-label="Pipeline steps">
              {workflow.nodes.map((node, i) => (
                <Fragment key={`${node.label}-${i}`}>
                  <span className={`flow-node flow-node--${node.type}`}>{node.label}</span>
                  {i < workflow.nodes.length - 1 && (
                    <span className="flow-arrow" aria-hidden="true">
                      -&gt;
                    </span>
                  )}
                </Fragment>
              ))}
            </div>

            {images.length > 0 && (
              <>
                <p className="modal-section-title">Screenshots</p>
                <div className="modal-gallery">
                  {images.map((src, i) => (
                    <button
                      className="modal-thumb-button"
                      type="button"
                      key={src}
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Open screenshot ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${workflow.title} screenshot ${i + 1}`}
                        className="modal-thumb"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="modal-desc">{workflow.longDesc}</p>

            <div className="case-study-fields case-study-fields--modal">
              <div>
                <span>Problem</span>
                <p>{workflow.problem}</p>
              </div>
              <div>
                <span>System built</span>
                <p>{workflow.systemBuilt}</p>
              </div>
              <div>
                <span>Outcome</span>
                <p>{workflow.outcome}</p>
              </div>
            </div>

            <div className="modal-stats-row">
              <div className="modal-stat">
                <span className="modal-stat-val">{workflow.stepsCount}</span>
                <span className="modal-stat-lbl">Steps</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-val">{workflow.complexity}%</span>
                <span className="modal-stat-lbl">Complexity</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-val">{workflow.triggerType}</span>
                <span className="modal-stat-lbl">Trigger</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-val">{getStatusLabel(workflow.status)}</span>
                <span className="modal-stat-lbl">Status</span>
              </div>
            </div>

            <p className="modal-section-title">Tools used</p>
            <div className="modal-tech">
              {workflow.toolsUsed.map((tech) => (
                <span key={tech} className={`tech-badge ${getTechClass(tech)}`}>
                  {tech}
                </span>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={close} type="button">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {workflow && lightboxIndex !== null && images.length > 0 && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image lightbox">
          <div className="lightbox__backdrop" onClick={() => setLightboxIndex(null)} />
          <button
            className="lightbox__close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {images.length > 1 && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
              aria-label="Previous image"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <img
            className="lightbox__img"
            src={images[lightboxIndex]}
            alt={`${workflow.title} screenshot ${lightboxIndex + 1}`}
          />
          {images.length > 1 && (
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={() => setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length))}
              aria-label="Next image"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
