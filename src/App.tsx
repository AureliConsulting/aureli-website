import Cal, { getCalApi } from "@calcom/embed-react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
  useCallback,
} from "react";
import "./styles/App.css";

// ─── Types ───────────────────────────────────────────────────────────────────
type WorkflowStatus = "active" | "in-progress" | "archived";
type NodeType = "trigger" | "ai" | "action" | "output";
type WorkflowCategoryStyle = "n8n" | "agent" | "hybrid";

interface WorkflowNode {
  label: string;
  type: NodeType;
}

interface WorkflowItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  category: string;
  categoryStyle: WorkflowCategoryStyle;
  status: WorkflowStatus;
  tech: string[];
  triggerType: string;
  stepsCount: number;
  complexity: number;
  outcome: string;
  nodes: WorkflowNode[];
  images?: string[]; // paths relative to /public, e.g. "/images/workflows/wf-001-canvas.png"
}

// ─── Particles Config ────────────────────────────────────────────────────────
const PARTICLES_CONFIG = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" }, resize: true },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
        factor: 4,
        speed: 0.5,
        maxSpeed: 50,
      },
    },
  },
  particles: {
    color: { value: ["#7c3aed", "#06b6d4", "#a855f7", "#22d3ee"] },
    links: {
      color: "#7c3aed",
      distance: 140,
      enable: true,
      opacity: 0.18,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      random: true,
      speed: 0.5,
    },
    number: { density: { enable: true, area: 1000 }, value: 70 },
    opacity: {
      value: { min: 0.15, max: 0.4 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2.5 } },
  },
  detectRetina: true,
};

// ─── Utilities ───────────────────────────────────────────────────────────────
const TECH_CLASS_MAP: Record<string, string> = {
  n8n: "tb-n8n",
  python: "tb-python",
  "claude api": "tb-claude",
  "claude 3.5": "tb-claude",
  "anthropic sdk": "tb-claude",
  openai: "tb-openai",
  http: "tb-http",
  webhook: "tb-webhook",
  slack: "tb-slack",
  gmail: "tb-gmail",
  airtable: "tb-airtable",
  shopify: "tb-shopify",
  notion: "tb-notion",
};

function getTechClass(tech: string): string {
  return TECH_CLASS_MAP[tech.toLowerCase()] ?? "tb-default";
}

function getStatusDotClass(s: WorkflowStatus) {
  return s === "active"
    ? "active"
    : s === "in-progress"
      ? "in-progress"
      : "archived";
}

function getStatusLabel(s: WorkflowStatus) {
  return s === "active"
    ? "Active"
    : s === "in-progress"
      ? "In Progress"
      : "Archived";
}

function animateCounter(el: HTMLElement) {
  const target = parseInt(el.dataset.target ?? "0", 10);
  const suffix = el.dataset.suffix ?? "";
  const duration = 1500;
  const start = performance.now();
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(tick);
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Workflows", href: "#workflows" },
  { label: "Demos", href: "#demos" },
  { label: "FAQ", href: "#faq" },
];

const heroStats = [
  { target: 40, suffix: "%", label: "More booked appointments" },
  { target: 3, suffix: "min", label: "Avg. follow-up time" },
  { target: 95, suffix: "%", label: "First-call capture rate" },
  { target: 12, suffix: "hrs", label: "Saved per week" },
];

const techLogos = [
  { name: "n8n", color: "#ea580c" },
  { name: "Python", color: "#3b82f6" },
  { name: "Claude API", color: "#7c3aed" },
  { name: "Retell AI", color: "#06b6d4" },
  { name: "HubSpot", color: "#f97316" },
  { name: "Cal.com", color: "#a855f7" },
  { name: "Twilio", color: "#ef4444" },
  { name: "Gmail", color: "#ef4444" },
  { name: "SendGrid", color: "#34d399" },
  { name: "Anthropic", color: "#a855f7" },
  { name: "Slack", color: "#e879f9" },
  { name: "Airtable", color: "#fbbf24" },
];

const highlights = [
  {
    icon: "📞",
    title: "AI Receptionists",
    description:
      "Capture every call with custom voice agents that book appointments, answer FAQs, and hand off warm leads.",
  },
  {
    icon: "📤",
    title: "Outbound Outreach",
    description:
      "Launch compliant cold-calling and emailing bots that introduce your brand and qualify interest automatically.",
  },
  {
    icon: "🔄",
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

const workflows: WorkflowItem[] = [
  {
    id: "wf-001",
    title: "Lead Intake Triage Agent",
    shortDesc:
      "Classifies inbound leads by urgency and fit, auto-drafts personalized replies, and logs enriched contacts to CRM.",
    longDesc:
      "When a new lead submits a form, this hybrid pipeline fires immediately. Claude classifies the submission by urgency and ICP fit, drafts a personalized reply using your brand voice, and pushes the enriched contact to HubSpot — all before your team sees the inbox. Average runtime: under 8 seconds per lead. Eliminates 4+ hours of manual triage per day.",
    category: "Hybrid Pipeline",
    categoryStyle: "hybrid",
    status: "active",
    tech: ["n8n", "Claude API", "HubSpot", "Gmail"],
    triggerType: "Form Webhook",
    stepsCount: 14,
    complexity: 82,
    outcome: "Cuts manual triage by 4 hrs/day",
    nodes: [
      { label: "Form Trigger", type: "trigger" },
      { label: "Classify", type: "ai" },
      { label: "Draft Reply", type: "ai" },
      { label: "CRM Log", type: "output" },
    ],
  },
  {
    id: "wf-002",
    title: "Cold Email Personalization Engine",
    shortDesc:
      "Enriches a lead list with scraped company data, generates unique personalized openers using Claude, and sends via SendGrid.",
    longDesc:
      "Ingests a CSV of cold prospects, queries Apify for company-level context, and hands the enriched data to Claude to write a unique opening line per contact — no templates. Messages are dispatched via SendGrid with open and click tracking baked in. All activity syncs back to the lead list with delivery and engagement stats.",
    category: "n8n Workflow",
    categoryStyle: "n8n",
    status: "active",
    tech: ["n8n", "Claude API", "Apify", "SendGrid"],
    triggerType: "Lead List",
    stepsCount: 12,
    complexity: 68,
    outcome: "38% higher reply rate vs templates",
    nodes: [
      { label: "Lead List", type: "trigger" },
      { label: "Enrich", type: "action" },
      { label: "Personalize", type: "ai" },
      { label: "Send & Track", type: "output" },
    ],
  },
  {
    id: "wf-003",
    title: "Voice Booking Pipeline",
    shortDesc:
      "Inbound call triggers a voice AI agent that extracts booking intent, checks calendar availability, and fires an SMS confirmation.",
    longDesc:
      "A Retell AI voice agent handles every inbound call. It extracts booking intent, checks Cal.com for live availability, confirms the slot with the caller, and fires a Twilio SMS confirmation — completely hands-free. The agent uses your scripts, knows your services, and escalates to a human if it detects frustration or urgent language.",
    category: "AI Agent",
    categoryStyle: "agent",
    status: "active",
    tech: ["Python", "Retell AI", "Cal.com", "Twilio"],
    triggerType: "Inbound Call",
    stepsCount: 8,
    complexity: 75,
    outcome: "Books appointments 24/7 without staff",
    images: ["/images/workflows/workflow.png"],
    nodes: [
      { label: "Inbound Call", type: "trigger" },
      { label: "Extract Intent", type: "ai" },
      { label: "Check Cal", type: "action" },
      { label: "SMS Confirm", type: "output" },
    ],
  },
  {
    id: "wf-004",
    title: "Multi-Agent Research Brief",
    shortDesc:
      "Orchestrates parallel sub-agents that research a prospect and produce a tailored outreach brief in under 60 seconds.",
    longDesc:
      "Given a company name or URL, parallel Claude sub-agents research the prospect's web presence, LinkedIn profile, and recent news using tool_use and DuckDuckGo. A synthesis agent merges findings into a structured outreach brief — positioning, pain points, suggested angles — ready to paste into your CRM or use directly in an email. Total runtime: under 60 seconds.",
    category: "AI Agent",
    categoryStyle: "agent",
    status: "active",
    tech: ["Python", "Claude 3.5", "tool_use", "DuckDuckGo"],
    triggerType: "API / CLI",
    stepsCount: 7,
    complexity: 88,
    outcome: "60-second prospect brief, ready to send",
    nodes: [
      { label: "Input", type: "trigger" },
      { label: "Research", type: "ai" },
      { label: "Synthesize", type: "ai" },
      { label: "Brief Output", type: "output" },
    ],
  },
  {
    id: "wf-005",
    title: "Review Monitor & Auto-Response",
    shortDesc:
      "Polls Google and Yelp reviews on a schedule, classifies sentiment, and drafts personalized owner replies with Claude.",
    longDesc:
      "Runs nightly against your Google and Yelp profiles. New reviews are classified by sentiment and routed accordingly — positive reviews get a warm thank-you draft, negative ones get a measured, policy-compliant response. Approved drafts post automatically. Each morning a Slack digest summarizes the previous day's activity and surfaces any reviews that need a personal touch.",
    category: "n8n Workflow",
    categoryStyle: "n8n",
    status: "in-progress",
    tech: ["n8n", "Claude API", "Google Places", "Slack"],
    triggerType: "Schedule",
    stepsCount: 11,
    complexity: 72,
    outcome: "100% review response rate, 15 min/week",
    nodes: [
      { label: "Poll Reviews", type: "trigger" },
      { label: "Classify", type: "ai" },
      { label: "Draft Reply", type: "ai" },
      { label: "Slack Digest", type: "output" },
    ],
  },
  {
    id: "wf-006",
    title: "CRM Auto-Enrichment Bot",
    shortDesc:
      "When a new contact is created, a Python agent enriches the profile and assigns an AI-scored fit score before triggering a welcome sequence.",
    longDesc:
      "Every time a new contact is created in HubSpot, a Python agent fires via webhook, scrapes the contact's company website and LinkedIn, and scores ICP fit using the Anthropic SDK. The enriched record is written back to HubSpot with custom properties and triggers the appropriate n8n welcome sequence — high-fit contacts get personalized outreach, others enter a nurture track.",
    category: "Hybrid Pipeline",
    categoryStyle: "hybrid",
    status: "active",
    tech: ["n8n", "Python", "Anthropic SDK", "HubSpot"],
    triggerType: "New CRM Contact",
    stepsCount: 10,
    complexity: 78,
    outcome: "Enriches 200+ contacts/day automatically",
    nodes: [
      { label: "New Contact", type: "trigger" },
      { label: "Enrich", type: "action" },
      { label: "Score", type: "ai" },
      { label: "Sequence", type: "output" },
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

const testimonials = [
  {
    quote:
      "Our AI receptionist books jobs while we are on-site. Weekend calls no longer slip through the cracks.",
    author: "Ali Sulaiman",
    role: "CEO",
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

const WORKFLOW_FILTERS = [
  { label: "All", value: "all" },
  { label: "n8n", value: "n8n" },
  { label: "AI Agent", value: "agent" },
  { label: "Hybrid Pipeline", value: "hybrid" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalWorkflow, setModalWorkflow] = useState<WorkflowItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lightboxRef = useRef<HTMLDivElement>(null);

  const navRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const lightboxImages = modalWorkflow?.images ?? [];

  const resetZoom = () => {
    setZoomScale(1);
    setZoomOffset({ x: 0, y: 0 });
  };
  const openLightbox = (i: number) => {
    resetZoom();
    setLightboxIndex(i);
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    resetZoom();
  };
  const lightboxPrev = () => {
    resetZoom();
    setLightboxIndex((i) =>
      i !== null
        ? (i - 1 + lightboxImages.length) % lightboxImages.length
        : null,
    );
  };
  const lightboxNext = () => {
    resetZoom();
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % lightboxImages.length : null,
    );
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - zoomOffset.x,
      y: e.clientY - zoomOffset.y,
    };
  };
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setZoomOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleDragEnd = () => setIsDragging(false);
  const handleDblClick = () => {
    if (zoomScale > 1) resetZoom();
    else {
      setZoomScale(2.5);
      setZoomOffset({ x: 0, y: 0 });
    }
  };

  const filteredWorkflows = useMemo(
    () =>
      activeFilter === "all"
        ? workflows
        : workflows.filter((w) => w.categoryStyle === activeFilter),
    [activeFilter],
  );

  const closeModal = useCallback(() => setModalWorkflow(null), []);

  // Particles
  useEffect(() => {
    const init = async () => {
      const tsP = (window as any).tsParticles;
      if (!tsP) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      try {
        await tsP.load("tsparticles", PARTICLES_CONFIG);
      } catch (e) {
        console.warn("tsParticles:", e);
      }
    };
    const t = setTimeout(init, 300);
    return () => clearTimeout(t);
  }, []);

  // AOS
  useEffect(() => {
    const AOS = (window as any).AOS;
    if (AOS)
      AOS.init({
        duration: 600,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
      });
  }, []);

  // Nav scroll effect
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handler = () => {
      nav.style.background =
        window.scrollY > 60 ? "rgba(10,10,15,0.95)" : "rgba(10,10,15,0.85)";
      nav.style.borderBottomColor =
        window.scrollY > 60
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.07)";
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll reveal
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
      { threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hero counter animation
  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;
    const counters = container.querySelectorAll<HTMLElement>(
      ".stat-num[data-target]",
    );
    let ran = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !ran) {
          ran = true;
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Complexity bar animation
  useEffect(() => {
    const fills = document.querySelectorAll<HTMLElement>(
      ".complexity-fill[data-width]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.width = (el.dataset.width ?? "0") + "%";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    fills.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredWorkflows]);

  // VanillaTilt
  useEffect(() => {
    const VT = (window as any).VanillaTilt;
    if (
      !VT ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768
    )
      return;
    const cards = document.querySelectorAll<HTMLElement>(".wf-card[data-tilt]");
    VT.init(cards, {
      max: 6,
      speed: 400,
      glare: true,
      "max-glare": 0.08,
      perspective: 1000,
    });
    return () => {
      cards.forEach((c) => {
        if ((c as any)._vanillaTilt) (c as any)._vanillaTilt.destroy();
      });
    };
  }, [filteredWorkflows]);

  // Cal.com
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#7c3aed" },
          dark: { "cal-brand": "#7c3aed" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  // Lightbox wheel zoom — attach to document so dialog/panel scroll can't intercept
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoomScale((prev) =>
        Math.min(5, Math.max(1, prev * (e.deltaY < 0 ? 1.12 : 0.88))),
      );
    };
    document.addEventListener("wheel", handler, { passive: false });
    return () => document.removeEventListener("wheel", handler);
  }, [lightboxIndex]);

  // Lightbox keyboard (Escape / arrow keys)
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, lightboxImages.length]);

  // Modal open/close
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (modalWorkflow) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
    }
  }, [modalWorkflow]);

  return (
    <>
      {/* Particles */}
      <div id="tsparticles" />

      {/* Navigation */}
      <nav className="nav" ref={navRef} id="nav">
        <div className="nav-inner">
          <a
            href="#"
            className="nav-logo"
            aria-label="Aureli Automation Labs Home"
          >
            <svg
              className="logo-icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
            >
              <polygon
                points="11,1 20,6 20,16 11,21 2,16 2,6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <polygon
                points="11,6 16,9 16,14 11,17 6,14 6,9"
                fill="currentColor"
                opacity="0.4"
              />
            </svg>
            <span className="logo-text">
              Aureli<span className="logo-accent"> </span>Consulting
            </span>
          </a>
          <div className="nav-links">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
            <a href="#contact" className="btn btn-primary btn-sm">
              Book a consult
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>AI automation for local businesses</span>
          </div>

          <h1 className="hero-title">
            Generate more <span className="gradient-text">leads</span>.
            <br />
            Make more <span className="gradient-text">money</span>.
          </h1>

          <p className="hero-subtitle">
            Aureli builds branded voice and chat automations that answer every
            inquiry, qualify leads, and keep your team focused on the work that
            matters.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Start your AI concierge plan
            </a>
            <a href="#workflows" className="btn btn-ghost">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              View workflows
            </a>
          </div>

          <div className="hero-stats" ref={statsRef}>
            {heroStats.map(({ target, suffix, label }, i) => (
              <Fragment key={label}>
                {i > 0 && <div className="stat-divider" aria-hidden="true" />}
                <div className="stat-item">
                  <span
                    className="stat-num"
                    data-target={target}
                    data-suffix={suffix}
                  >
                    0{suffix}
                  </span>
                  <span className="stat-label">{label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Tech Strip */}
      <section className="tech-strip" aria-label="Technologies used">
        <p className="tech-strip-label">Built with</p>
        <div className="tech-scroll-wrapper">
          <div className="tech-scroll">
            {[...techLogos, ...techLogos].map((t, i) => (
              <div className="tech-logo-item" key={i}>
                <span
                  className="tech-logo-dot"
                  style={{
                    background: t.color,
                    boxShadow: `0 0 6px ${t.color}66`,
                  }}
                />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>
        {/* Metrics */}
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

        {/* Services */}
        <section className="section" id="services">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Services</span>
            <h2 className="section__title">
              Services that keep every lead moving forward
            </h2>
            <p className="section__subtitle">
              Comprehensive AI automation solutions designed specifically for
              local businesses
            </p>
          </div>
          <div className="grid">
            {highlights.map(({ icon, title, description }) => (
              <article
                className="card"
                data-reveal
                key={title}
                data-aos="fade-up"
              >
                <span className="card__icon" aria-hidden="true">
                  {icon}
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
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

        {/* Use Cases */}
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
              ({ title, summary, outcome, category, highlights: ch }) => (
                <article
                  className="case-card"
                  data-reveal
                  key={title}
                  data-aos="fade-up"
                >
                  <span className="case-card__badge">{category}</span>
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <ul className="case-card__highlights">
                    {ch.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="case-card__outcome">{outcome}</div>
                </article>
              ),
            )}
          </div>
        </section>

        {/* Workflow Portfolio */}
        <section className="section section--workflows" id="workflows">
          <div className="section-header" data-reveal>
            <div className="section-eyebrow ai-eyebrow">
              <span className="eyebrow-dot" />
              Workflow Portfolio
            </div>
            <h2 className="section-title">
              Built pipelines, not just{" "}
              <span className="gradient-text">promises</span>
            </h2>
            <p className="section-desc">
              Real n8n flows and agentic Python scripts powering lead capture,
              outreach, and operations — the kind of work that runs while you
              sleep.
            </p>
          </div>

          <div className="filter-bar" data-reveal>
            {WORKFLOW_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                className={`filter-btn${activeFilter === value ? " active" : ""}`}
                onClick={() => setActiveFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="workflow-grid" role="list">
            {filteredWorkflows.map((wf) => (
              <article
                key={wf.id}
                className={`wf-card ${wf.categoryStyle}-card card-visible`}
                role="listitem"
                tabIndex={0}
                aria-label={wf.title}
                data-tilt
                data-tilt-max="6"
                data-tilt-speed="400"
                data-tilt-glare="true"
                data-tilt-max-glare="0.08"
                onClick={() => setModalWorkflow(wf)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setModalWorkflow(wf);
                  }
                }}
                data-aos="fade-up"
              >
                {/* Header */}
                <div className="card-header">
                  <div className="card-status">
                    <span
                      className={`status-dot ${getStatusDotClass(wf.status)}`}
                      aria-hidden="true"
                    />
                    <span className="status-label">
                      {getStatusLabel(wf.status)}
                    </span>
                  </div>
                  <span
                    className={`card-type-badge ${wf.categoryStyle === "n8n" ? "n8n-type" : wf.categoryStyle === "agent" ? "ai-type" : "hybrid-type"}`}
                  >
                    {wf.category}
                  </span>
                </div>

                {/* Body */}
                <div className="card-body">
                  <h3 className="card-title">{wf.title}</h3>
                  <p className="card-desc">{wf.shortDesc}</p>

                  <div className="card-meta">
                    <span className="meta-item">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      {wf.triggerType}
                    </span>
                    <span className="meta-item">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      {wf.stepsCount} steps
                    </span>
                  </div>

                  <div className="card-tech">
                    {wf.tech.map((t) => (
                      <span key={t} className={`tech-badge ${getTechClass(t)}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="complexity-bar">
                    <div className="complexity-label-row">
                      <span className="complexity-label-text">Complexity</span>
                      <span className="complexity-label-pct">
                        {wf.complexity}%
                      </span>
                    </div>
                    <div className="complexity-track">
                      <div
                        className="complexity-fill"
                        data-width={wf.complexity}
                        style={{ width: 0 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="card-footer">
                  <button className="card-cta" type="button">
                    View Details
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                  <span className="card-steps">#{wf.id.split("-")[1]}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Demos */}
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
              <article
                className="demo-card"
                data-reveal
                key={title}
                data-aos="fade-up"
              >
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

        {/* Testimonials */}
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
              <figure
                className="testimonial"
                data-reveal
                key={author}
                data-aos="fade-up"
              >
                <blockquote>"{quote}"</blockquote>
                <figcaption>
                  <span className="testimonial__author">{author}</span>
                  <span className="testimonial__role">{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Contact */}
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
          <div className="contact__form" data-reveal>
            <div className="contact__scheduler-intro">
              <span className="contact__label">Book a working session</span>
              <p className="contact__subtitle">
                Grab time on our calendar for a 30-minute discovery call. We'll
                review your scripts, tooling, and automation goals live.
              </p>
              <p className="form__hint">
                Prefer a new tab?{" "}
                <a
                  href="https://cal.com/aureli/discovery-call"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the scheduler
                </a>
                .
              </p>
            </div>
            <div
              className="contact__scheduler-embed"
              aria-live="polite"
              style={{ minHeight: "520px" }}
            >
              <Cal
                namespace="30min"
                calLink="ali-sulaiman-b2yeyp/30min"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view", theme: "dark" }}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-text footer-logo">
                Aureli<span className="logo-accent"> </span>Consulting
              </span>
              <p className="footer-tagline">
                AI automation for local businesses.
              </p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>
              Built with <span className="tech-pill">n8n</span>{" "}
              <span className="tech-pill">Python</span>{" "}
              <span className="tech-pill">Claude API</span>{" "}
              <span className="tech-pill">Retell AI</span>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              &copy; {currentYear} Aureli Automation Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Workflow Detail Modal */}
      <dialog
        className="workflow-modal"
        ref={modalRef}
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={(e) => {
          if (e.key === "Escape") closeModal();
        }}
      >
        <div className="modal-backdrop" onClick={closeModal} />
        <div className="modal-panel">
          <button
            className="modal-close"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {modalWorkflow && (
            <div>
              {/* Eyebrow + Title */}
              <div
                className={`section-eyebrow ${modalWorkflow.categoryStyle === "n8n" ? "n8n-eyebrow" : "ai-eyebrow"} modal-eyebrow`}
              >
                {modalWorkflow.categoryStyle === "n8n"
                  ? "n8n Workflow"
                  : modalWorkflow.categoryStyle === "agent"
                    ? "AI Agent"
                    : "Hybrid Pipeline"}
              </div>
              <h2 className="modal-title" id="modal-title">
                {modalWorkflow.title}
              </h2>

              {/* Node Flow Diagram */}
              <div className="modal-flow" aria-label="Pipeline steps">
                {modalWorkflow.nodes.map((node, i) => (
                  <Fragment key={i}>
                    <span className={`flow-node flow-node--${node.type}`}>
                      {node.label}
                    </span>
                    {i < modalWorkflow.nodes.length - 1 && (
                      <span className="flow-arrow" aria-hidden="true">
                        →
                      </span>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Image Gallery (only when images present) */}
              {lightboxImages.length > 0 && (
                <>
                  <p className="modal-section-title">Screenshots</p>
                  <div className="modal-gallery">
                    {lightboxImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${modalWorkflow.title} screenshot ${i + 1}`}
                        className="modal-thumb"
                        onClick={() => openLightbox(i)}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Description */}
              <p className="modal-desc">{modalWorkflow.longDesc}</p>

              {/* Stats */}
              <div className="modal-stats-row">
                <div className="modal-stat">
                  <span className="modal-stat-val">
                    {modalWorkflow.stepsCount}
                  </span>
                  <span className="modal-stat-lbl">Steps</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-val">
                    {modalWorkflow.complexity}%
                  </span>
                  <span className="modal-stat-lbl">Complexity</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-val">
                    {modalWorkflow.triggerType}
                  </span>
                  <span className="modal-stat-lbl">Trigger</span>
                </div>
                <div className="modal-stat">
                  <span
                    className="modal-stat-val"
                    style={{
                      color:
                        modalWorkflow.status === "active"
                          ? "var(--green)"
                          : modalWorkflow.status === "in-progress"
                            ? "var(--amber)"
                            : "var(--slate)",
                    }}
                  >
                    {getStatusLabel(modalWorkflow.status)}
                  </span>
                  <span className="modal-stat-lbl">Status</span>
                </div>
              </div>

              {/* Tech Stack */}
              <p className="modal-section-title">Tech Stack</p>
              <div className="modal-tech">
                {modalWorkflow.tech.map((t) => (
                  <span key={t} className={`tech-badge ${getTechClass(t)}`}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Outcome */}
              <p className="modal-section-title">Outcome</p>
              <div className="modal-tags">
                <span className="modal-tag">{modalWorkflow.outcome}</span>
              </div>

              <div className="modal-actions">
                <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox — inside <dialog> so it lives in the top layer above the modal panel */}
        {lightboxIndex !== null && lightboxImages.length > 0 && (
          <div
            className="lightbox"
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="lightbox__backdrop" onClick={closeLightbox} />
            <button
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {lightboxImages.length > 1 && (
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={lightboxPrev}
                aria-label="Previous image"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <img
              className="lightbox__img"
              src={lightboxImages[lightboxIndex]}
              alt={`${modalWorkflow?.title ?? ""} screenshot ${lightboxIndex + 1}`}
              onMouseDown={handleDragStart}
              onDoubleClick={handleDblClick}
              draggable={false}
              style={{
                transform: `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(${zoomScale})`,
                cursor:
                  zoomScale > 1
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "zoom-in",
                transition: isDragging ? "none" : "transform 0.15s ease",
              }}
            />
            {lightboxImages.length > 1 && (
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={lightboxNext}
                aria-label="Next image"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
            <div className="lightbox__footer">
              {lightboxImages.length > 1 && (
                <span className="lightbox__counter">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </span>
              )}
              {zoomScale > 1 && (
                <button
                  className="lightbox__zoom-reset"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  {Math.round(zoomScale * 10) / 10}× — double-click or click to
                  reset
                </button>
              )}
              {zoomScale === 1 && (
                <span className="lightbox__hint">
                  Scroll or double-click to zoom
                </span>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

export default App;
