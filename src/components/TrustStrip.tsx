const stackBadges = [
  { name: "Apollo", className: "trust-logo--apollo", icon: "apollo" },
  { name: "HubSpot", className: "trust-logo--hubspot", icon: "hubspot" },
  { name: "n8n", className: "trust-logo--n8n", icon: "n8n" },
  { name: "Clay", className: "trust-logo--clay", icon: "clay" },
  { name: "Instantly", className: "trust-logo--instantly", icon: "instantly" },
  { name: "Airtable", className: "trust-logo--airtable", icon: "airtable" },
];

function StackLogo({ icon }: { icon: string }) {
  if (icon === "hubspot") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="17" r="6" />
        <circle cx="24" cy="8" r="3" />
        <circle cx="8" cy="9" r="2.6" />
        <path d="M19.8 12.7 22.5 10M12 13 9.8 10.8M16 11V6" />
      </svg>
    );
  }

  if (icon === "n8n") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="6" cy="16" r="3.4" />
        <circle cx="16" cy="16" r="3.4" />
        <circle cx="26" cy="16" r="3.4" />
        <path d="M9.4 16h3.2M19.4 16h3.2" />
      </svg>
    );
  }

  if (icon === "clay") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 27 12v8l-11 8L5 20v-8L16 4Z" />
        <path d="M16 4v24M5 12l11 8 11-8" />
      </svg>
    );
  }

  if (icon === "instantly") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M18 3 7 18h8l-1 11 11-16h-8l1-10Z" />
      </svg>
    );
  }

  if (icon === "airtable") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5 28 10.3 16 15.7 4 10.3 16 5Z" />
        <path d="M4 13.8 14.4 18.5v8.5L4 22.2v-8.4Z" />
        <path d="M28 13.8 17.6 18.5v8.5L28 22.2v-8.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="M10 21 16 8l6 13M12.5 17.2h7" />
    </svg>
  );
}

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Outbound stack">
      <div className="trust-strip-inner">
        <div className="trust-logo-marquee" aria-label="Apollo, HubSpot, n8n, Clay, Instantly, Airtable">
          <div className="trust-logo-track">
            {[...stackBadges, ...stackBadges, ...stackBadges, ...stackBadges].map((tool, index) => (
              <span className="trust-badge" key={`${tool.name}-${index}`} aria-hidden={index >= stackBadges.length}>
                <span className={`trust-logo-mark ${tool.className}`}>
                  <StackLogo icon={tool.icon} />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
