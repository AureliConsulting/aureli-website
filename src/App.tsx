import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import "./styles/App.css";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demos", href: "#demos" },
  { label: "FAQ", href: "#faq" },
];

const highlights = [
  {
    title: "AI Receptionists",
    description:
      "Capture every call with custom voice agents that book appointments, answer FAQs, and hand off warm leads.",
  },
  {
    title: "Outbound Outreach",
    description:
      "Launch compliant cold-calling and emailing bots that introduce your brand and qualify interest automatically.",
  },
  {
    title: "Follow-up Automations",
    description:
      "Keep prospects engaged with smart reminders, AI-drafted replies, and seamless CRM updates.",
  },
];

const metrics = [
  { value: "24/7", label: "Availability for voice and chat concierge" },
  { value: "3 min", label: "Average lead follow-up time after go-live" },
  { value: "40%", label: "Typical boost in booked appointments" },
];

const partners = [
  "Front Range Dental Care",
  "Summit Fitness Club",
  "Peak HVAC Pros",
  "Aspen Legal Partners",
  "Urban Bloom Med Spa",
  "Mile High Home Services",
];

const steps = [
  {
    id: "01",
    label: "Script and Scope",
    detail:
      "We capture your tone, document handoffs, and identify the calls, chats, or emails that AI should handle first.",
  },
  {
    id: "02",
    label: "Build and Train",
    detail:
      "Your agent learns from real conversations, plugs into your calendar or CRM, and passes compliance checks.",
  },
  {
    id: "03",
    label: "Launch and Optimize",
    detail:
      "Go live with monitoring, analytics, and rapid updates that keep your automations sharp as your business evolves.",
  },
];

const useCases = [
  {
    title: "24/7 AI front desk",
    summary:
      "Voice agents answer every call, collect details, and book time right on your calendar.",
    outcome: "Captures 95% of first-time callers even after hours.",
    category: "Service businesses",
    highlights: [
      "Appointment booking",
      "Instant FAQ responses",
      "Warm transfer to staff",
    ],
  },
  {
    title: "Outbound follow-up sequences",
    summary:
      "Automate cold calls, texts, and emails that introduce your offer and re-activate old leads.",
    outcome: "Adds 18% more consults from stale inquiries.",
    category: "Home services",
    highlights: [
      "Local caller ID dialing",
      "Script variations by lead source",
      "CRM and pipeline updates",
    ],
  },
  {
    title: "Prospect qualification inbox",
    summary:
      "AI triages inbound emails and chats, drafts replies, and alerts your team when a human touch is needed.",
    outcome: "Saves 12 hours of manual inbox work each week.",
    category: "Professional services",
    highlights: [
      "Lead scoring prompts",
      "Calendar scheduling links",
      "Compliance-ready conversation logs",
    ],
  },
];

const demos = [
  {
    title: "AI Receptionist Call Flow",
    description:
      "Hear how our concierge greets callers, captures lead info, and routes urgent conversations to your team.",
    length: "02:08",
    category: "Voice",
  },
  {
    title: "Outbound Email Bot Walkthrough",
    description:
      "See the multi-touch campaigns that warm up cold prospects with personalized copy that sounds like you.",
    length: "03:05",
    category: "Email",
  },
  {
    title: "Lead Follow-up Dashboard",
    description:
      "Track every outreach step, review transcripts, and trigger human follow-ups in one place.",
    length: "01:47",
    category: "Operations",
  },
];

const pricingOptions = [
  {
    name: "Build and Launch",
    price: "$1,000 - $1,500",
    period: "one-time",
    description:
      "Custom AI receptionist or outreach bot that reflects your brand, scripts, and preferred tools.",
    inclusions: [
      "Voice or chat setup with branded persona",
      "Calendar, CRM, or phone system integrations",
      "Training data prep plus live testing",
    ],
    featured: false,
  },
  {
    name: "Monthly Retainer",
    price: "$300",
    period: "per month",
    description:
      "Ongoing coaching for your automations so they keep improving as your business grows.",
    inclusions: [
      "Performance reviews and reporting",
      "Script refreshes and retraining",
      "Priority support with human-in-the-loop QA",
    ],
    featured: true,
  },
];

const testimonials = [
  {
    quote:
      "Our AI receptionist books jobs while we are on-site. Weekend calls no longer slip through the cracks.",
    author: "Lena Martinez",
    role: "Owner, Mile High Home Services",
  },
  {
    quote:
      "The outbound email bot keeps our pipeline warm without sounding robotic. It paid for itself in the first month.",
    author: "Chris O'Neal",
    role: "Managing Partner, Summit Fitness Club",
  },
];

const contactChannels = [
  { label: "Email", detail: "ali@aureliconsulting.com" },
  { label: "Phone and SMS", detail: "720-555-0199" },
  { label: "Office Hours", detail: "8am - 6pm MT, Mon-Sat" },
];

const faqs = [
  {
    question: "How fast can we launch?",
    answer:
      "Most teams go live within 2 to 4 weeks. We map your scripts, train the AI with real conversations, and run a live pilot before rolling out to every lead source.",
  },
  {
    question: "Will the AI match our tone?",
    answer:
      "Yes. We build a brand style guide for every agent and fine-tune responses until they sound like a natural extension of your team, including pronunciations and local knowledge.",
  },
  {
    question: "What does the monthly retainer include?",
    answer:
      "You get proactive tuning, analytics reviews, new script updates, and priority support. We monitor performance weekly and adjust sequences before issues surface.",
  },
  {
    question: "Can you connect to our systems?",
    answer:
      "We integrate with popular CRMs, booking tools, and phone providers. If you have a custom stack, we use APIs or secure no-code connectors to make sure data flows cleanly.",
  },
];

type ContactFormFields = {
  name: string;
  email: string;
  company: string;
  scope: string;
};

const initialFormState: ContactFormFields = {
  name: "",
  email: "",
  company: "",
  scope: "",
};

function App() {
  const [formData, setFormData] = useState<ContactFormFields>(initialFormState);
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handleChange =
    (field: keyof ContactFormFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setStatus("idle");
    };

  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setStatus("submitted");
  //   setFormData(initialFormState);
  // };

  return (
    <div className="page">
      <span aria-hidden="true" className="page__aurora" />
      <span aria-hidden="true" className="page__aurora page__aurora--alt" />

      <header className={`nav-wrapper`}>
        <nav className="nav" data-reveal aria-label="Primary">
          <a
            className="nav__brand"
            href="#"
            aria-label="Aureli Automation Labs Home"
          >
            <span className="nav__logo">Aureli</span>
            <span className="nav__descriptor">Automation Labs</span>
          </a>
          <div className="nav__links">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
          <a className="nav__cta" href="#contact">
            Book a consult
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero__grid">
          <div className="hero__content" data-reveal>
            <span className="hero__tag">AI for Local Businesses</span>
            <h1 className="hero__title">
              Launch AI receptionists.
              <br />
              Book more customers.
            </h1>
            <p className="hero__subtitle">
              Aureli builds branded voice and chat automations that answer every
              inquiry, qualify leads, and keep your team focused on the work
              that matters.
            </p>
            <div className="hero__actions">
              <a className="hero__primary" href="#contact">
                Start your AI concierge plan
              </a>
              <a className="hero__secondary" href="#pricing">
                See pricing
              </a>
            </div>
            <div className="hero__meta">
              <span>✓ AI receptionists</span>
              <span>✓ Cold outreach bots</span>
              <span>✓ Monthly support</span>
            </div>
          </div>
          <div className="hero__visual" data-reveal>
            <div className="hero__glow" />
            <div className="hero__orbit">
              <div className="hero__node hero__node--primary" />
              <div className="hero__node hero__node--secondary hero__node--one" />
              <div className="hero__node hero__node--secondary hero__node--two" />
              <div className="hero__node hero__node--secondary hero__node--three" />
            </div>
            <div className="hero__pulse hero__pulse--one" />
            <div className="hero__pulse hero__pulse--two" />
          </div>
        </div>
      </section>

      <main>
        <section className="section section--metrics">
          <div className="metrics">
            {metrics.map(({ value, label }) => (
              <div className="metric" data-reveal key={label}>
                <span className="metric__value">{value}</span>
                <span className="metric__label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--partners" id="partners">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Trusted by local leaders</span>
          </div>
          <div className="partner-grid">
            {partners.map((name) => (
              <span className="partner" data-reveal key={name}>
                {name}
              </span>
            ))}
          </div>
        </section>

        <section className="section" id="services">
          <div className="section__header" data-reveal>
            <h2 className="section__title">
              Services that keep every lead moving forward
            </h2>
            <p className="section__subtitle">
              Comprehensive AI automation solutions designed specifically for
              local businesses
            </p>
          </div>
          <div className="grid">
            {highlights.map(({ title, description }) => (
              <article className="card" data-reveal key={title}>
                {/* <span className="card__icon" aria-hidden="true">
                  {icon}
                </span> */}
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--alt" id="process">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Our Process</span>
            <h2 className="section__title">How we launch your AI concierge</h2>
            <p className="section__subtitle">
              We blend automation expertise with local business know-how so your
              agent sounds authentic and delivers measurable impact from the
              very first week.
            </p>
          </div>
          <div className="timeline">
            {steps.map(({ id, label, detail }) => (
              <div className="timeline__step" data-reveal key={id}>
                <span className="timeline__id">{id}</span>
                <div className="timeline__content">
                  <h3>{label}</h3>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--cases" id="use-cases">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Use Cases</span>
            <h2 className="section__title">
              Popular automations for local teams
            </h2>
            <p className="section__subtitle">
              From inbound calls to outbound campaigns, we tailor every workflow
              to the systems you already rely on and the customers you serve.
            </p>
          </div>
          <div className="case-grid">
            {useCases.map(
              ({
                title,
                summary,
                outcome,
                category,
                highlights: caseHighlights,
              }) => (
                <article className="case-card" data-reveal key={title}>
                  <span className="case-card__badge">{category}</span>
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <ul className="case-card__highlights">
                    {caseHighlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="case-card__outcome">{outcome}</div>
                </article>
              )
            )}
          </div>
        </section>

        <section className="section section--pricing" id="pricing">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Pricing</span>
            <h2 className="section__title">Straightforward pricing</h2>
            <p className="section__subtitle">
              Invest once to build your AI agent, then keep us on retainer to
              refine scripts, targeting, and results.
            </p>
          </div>
          <div className="pricing-grid">
            {pricingOptions.map(
              ({ name, price, period, description, inclusions, featured }) => (
                <article
                  className={`pricing-card ${
                    featured ? "pricing-card--featured" : ""
                  }`}
                  data-reveal
                  key={name}
                >
                  {featured && (
                    <span className="pricing-card__badge">Most Popular</span>
                  )}
                  <h3>{name}</h3>
                  <div className="pricing-card__price">
                    <span className="pricing-card__amount">{price}</span>
                    <span className="pricing-card__period">{period}</span>
                  </div>
                  <p className="pricing-card__description">{description}</p>
                  <ul className="pricing-card__list">
                    {inclusions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a className="pricing-card__cta" href="#contact">
                    Get started
                  </a>
                </article>
              )
            )}
          </div>
        </section>

        <section className="section section--demos" id="demos">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Demos</span>
            <h2 className="section__title">Sample conversations</h2>
            <p className="section__subtitle">
              Preview how our agents greet callers, nurture leads, and keep your
              team in the loop with transcripts and alerts.
            </p>
          </div>
          <div className="demo-grid">
            {demos.map(({ title, description, length, category }) => (
              <article className="demo-card" data-reveal key={title}>
                <div className="demo-card__media">
                  <span className="demo-card__badge">{category}</span>
                  <button
                    className="demo-card__trigger"
                    type="button"
                    aria-label={`Preview ${title}`}
                  >
                    <span className="demo-card__play">▶</span>
                    Preview
                  </button>
                  <span className="demo-card__length">{length}</span>
                </div>
                <div className="demo-card__body">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a className="demo-card__link" href="#contact">
                    Request full walkthrough →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--testimonials" id="testimonials">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Testimonials</span>
            <h2 className="section__title">Results from local teams</h2>
            <p className="section__subtitle">
              Hear from owners who put Aureli on the front lines of customer
              conversations and grew without hiring more staff.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map(({ quote, author, role }) => (
              <figure className="testimonial" data-reveal key={author}>
                <blockquote>"{quote}"</blockquote>
                <figcaption>
                  <span className="testimonial__author">{author}</span>
                  <span className="testimonial__role">{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section section--contact" id="contact">
          <div className="contact__content" data-reveal>
            <span className="contact__tag">Let's build together</span>
            <h2 className="section__title">
              Tell us about the calls or campaigns you need covered
            </h2>
            <p className="section__subtitle">
              Share the conversations you want automated and we will send back a
              tailored roadmap with next steps within two business days.
            </p>
            <ul className="contact__channels">
              {contactChannels.map(({ label, detail }) => (
                <li key={label}>
                  {/* <span className="contact__channel-icon" aria-hidden="true">
                    {icon}
                  </span> */}
                  <div>
                    <span className="contact__channel-label">{label}</span>
                    <strong className="contact__channel-detail">
                      {detail}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <form
            className="contact__form"
            data-reveal
            action="https://formspree.io/f/xovpvpbj"
            method="POST"
          >
            <div className="contact__fields">
              <label>
                <span className="contact__label">Name</span>
                <input
                  name="name"
                  onChange={handleChange("name")}
                  placeholder="Ada Lovelace"
                  required
                  value={formData.name}
                  // disabled={status === "submitting"}
                />
              </label>
              <label>
                <span className="contact__label">Email</span>
                <input
                  name="email"
                  onChange={handleChange("email")}
                  placeholder="you@company.com"
                  required
                  type="email"
                  value={formData.email}
                  // disabled={status === "submitting"}
                />
              </label>
              <label>
                <span className="contact__label">Company</span>
                <input
                  name="company"
                  onChange={handleChange("company")}
                  placeholder="Acme Robotics"
                  required
                  value={formData.company}
                  // disabled={status === "submitting"}
                />
              </label>
            </div>
            <label className="contact__textarea">
              <span className="contact__label">
                Priority conversation or goal
              </span>
              <textarea
                name="scope"
                onChange={handleChange("scope")}
                placeholder="e.g., Cover after-hours calls with an AI receptionist that books and confirms appointments."
                required
                rows={4}
                value={formData.scope}
                // disabled={status === "submitting"}
              />
            </label>

            {status === "submitted" ? (
              <p className="form__success">
                ✓ Thanks! We'll reach out shortly with next steps.
              </p>
            ) : (
              <p className="form__hint">
                We'll schedule a discovery session and share tailored automation
                demos.
              </p>
            )}

            <button
              className="contact__submit"
              type="submit"
              // disabled={status === "submitting"}
            >
              "Send message"
            </button>
          </form>
        </section>

        <section className="section section--faq" id="faq">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">FAQ</span>
            <h2 className="section__title">Questions before you launch</h2>
            <p className="section__subtitle">
              Get clear on how Aureli's AI concierge works before you invest.
            </p>
          </div>
          <div className="faq">
            {faqs.map(({ question, answer }) => (
              <details className="faq__item" data-reveal key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__content">
          <div className="footer__brand">
            <span className="footer__logo">Aureli</span>
            <p className="footer__tagline">
              AI automation for local businesses
            </p>
          </div>
          <nav className="footer__links" aria-label="Footer navigation">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="footer__bottom">
          <p>
            &copy; {currentYear} Aureli Automation Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
