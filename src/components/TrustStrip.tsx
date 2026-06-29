const stackBadges = [
  { name: "Apollo", mark: "A", className: "trust-logo--apollo" },
  { name: "HubSpot", mark: "H", className: "trust-logo--hubspot" },
  { name: "n8n", mark: "n8n", className: "trust-logo--n8n" },
  { name: "Clay", mark: "C", className: "trust-logo--clay" },
  { name: "Instantly", mark: "I", className: "trust-logo--instantly" },
  { name: "Airtable", mark: "A", className: "trust-logo--airtable" },
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Outbound stack">
      <div className="trust-strip-inner">
        <span className="trust-strip__label">Stack used in outbound systems</span>
        <div className="trust-logo-marquee" aria-label="Apollo, HubSpot, n8n, Clay, Instantly, Airtable">
          <div className="trust-logo-track">
            {[...stackBadges, ...stackBadges].map((tool, index) => (
              <span className="trust-badge" key={`${tool.name}-${index}`} aria-hidden={index >= stackBadges.length}>
                <span className={`trust-logo-mark ${tool.className}`}>{tool.mark}</span>
                <span className="trust-logo-name">{tool.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
