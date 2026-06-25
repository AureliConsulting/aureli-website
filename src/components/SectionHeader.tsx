interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, subtitle, centered = false }: SectionHeaderProps) {
  if (centered) {
    return (
      <div className="section-header" data-reveal>
        <div className="section-eyebrow ai-eyebrow">
          <span className="eyebrow-dot" />
          {eyebrow}
        </div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-desc">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div className="section__header" data-reveal>
      <span className="section__eyebrow">{eyebrow}</span>
      <h2 className="section__title">{title}</h2>
      {subtitle && <p className="section__subtitle">{subtitle}</p>}
    </div>
  );
}
