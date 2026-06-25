import { stack } from "../data/stack";

export function StackStrip() {
  return (
    <section className="tech-strip" id="stack" aria-label="GTM stack">
      <p className="tech-strip-label">Stack we deploy</p>
      <div className="tech-scroll-wrapper">
        <div className="tech-scroll">
          {[...stack, ...stack].map((tool, i) => (
            <div className="tech-logo-item" key={`${tool.name}-${i}`}>
              <span className={`tech-logo-dot ${tool.className}`} />
              {tool.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
