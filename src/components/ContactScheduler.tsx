import Cal from "@calcom/embed-react";
import type { Theme } from "../hooks/useTheme";
import { bookingPath, bookingUrl } from "../data/nav";

interface ContactSchedulerProps {
  theme: Theme;
}

export function ContactScheduler({ theme }: ContactSchedulerProps) {
  return (
    <div className="contact__form" data-reveal>
      <div className="contact__scheduler-intro">
        <span className="contact__label">Book a GTM audit</span>
        <p className="contact__subtitle">
          Grab time for a 30-minute audit. We will review your outbound process,
          tooling, and pipeline goals live.
        </p>
        <p className="form__hint">
          Prefer a new tab?{" "}
          <a href={bookingUrl} target="_blank" rel="noreferrer">
            Open the scheduler
          </a>
          .
        </p>
      </div>
      <div className="contact__scheduler-embed" aria-live="polite">
        <Cal
          namespace="30min"
          calLink={bookingPath}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: "month_view", theme }}
        />
      </div>
    </div>
  );
}
