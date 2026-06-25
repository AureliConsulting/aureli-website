import { Fragment } from "react";
import { proofItems } from "../data/services";

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Proof points">
      <div className="trust-strip-inner">
        {proofItems.map(({ value, label }, i) => (
          <Fragment key={label}>
            {i > 0 && <div className="stat-divider" aria-hidden="true" />}
            <div className="stat-item">
              <span className="stat-num">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
