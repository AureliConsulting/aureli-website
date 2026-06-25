import { processSteps } from "../data/services";

export function ProcessTimeline() {
  return (
    <div className="timeline timeline--vertical">
      {processSteps.map(({ id, label, detail }) => (
        <div className="timeline__step" data-reveal key={id}>
          <span className="timeline__id">{id}</span>
          <div className="timeline__content">
            <h3>{label}</h3>
            <p>{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
