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
import { useScrollEffects } from "./hooks/useScrollEffects";
import { useTheme } from "./hooks/useTheme";

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
  hubspot: "tb-hubspot",
  apollo: "tb-apollo",
  clay: "tb-clay",
  instantly: "tb-instantly",
  "make.com": "tb-make",
  twilio: "tb-twilio",
  sendgrid: "tb-sendgrid",
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
  { label: "Systems", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Case studies", href: "#workflows" },
  { label: "Stack", href: "#stack" },
  { label: "FAQ", href: "#faq" },
];

const heroStats = [
  { target: 40, suffix: "%", label: "More booked calls" },
  { target: 5, suffix: "x", label: "Outbound efficiency" },
  { target: 3, suffix: "min", label: "Avg. follow-up time" },
  { target: 12, suffix: "hrs", label: "Saved per week" },
];

const techLogos = [
  { name: "Apollo", color: "#6366f1" },
  { name: "HubSpot", color: "#f97316" },
  { name: "n8n", color: "#ea580c" },
  { name: "Clay", color: "#22c55e" },
  { name: "Instantly", color: "#3b82f6" },
  { name: "Python", color: "#3b82f6" },
  { name: "Claude API", color: "#7c3aed" },
  { name: "Airtable", color: "#fbbf24" },
  { name: "Twilio", color: "#ef4444" },
  { name: "SendGrid", color: "#34d399" },
  { name: "Slack", color: "#e879f9" },
  { name: "Make.com", color: "#a855f7" },
];

const highlights = [
  {
    num: "01",
    title: "Outbound Email Infrastructure",
    description:
      "Cold email systems built to generate consistent conversations with qualified prospects through scalable multi-step outreach.",
  },
  {
    num: "02",
    title: "LinkedIn Pipeline System",
    description:
      "LinkedIn workflows designed to start conversations with decision-makers and turn engagement into booked meetings.",
  },
  {
    num: "03",
    title: "Lead Intelligence & Enrichment",
    description:
      "Automated sourcing and enrichment that continuously identifies, verifies, and qualifies high-intent prospects.",
  },
  {
    num: "04",
    title: "Appointment Conversion System",
    description:
      "Booking and follow-up workflows that turn interested prospects into confirmed sales calls.",
  },
  {
    num: "05",
    title: "CRM & Revenue Operations",
    description:
      "Centralized CRM systems that automate lead tracking, follow-ups, pipeline visibility, and reporting.",
  },
  {
    num: "06",
    title: "Cold Calling Infrastructure",
    description:
      "Structured calling systems with scripts, qualification flows, tracking, and appointment-setting built in.",
  },
];

const steps = [
  {
    id: "01",
    label: "GTM Audit & Mapping",
    detail:
      "We review your current outbound process, offer positioning, lead sources, and conversion gaps.",
  },
  {
    id: "02",
    label: "Infrastructure Buildout",
    detail:
      "We configure workflows, tooling, outreach systems, integrations, and tracking architecture.",
  },
  {
    id: "03",
    label: "Launch & Optimization",
    detail:
      "After deployment, we monitor deliverability, outreach performance, conversion quality, and efficiency.",
  },
  {
    id: "04",
    label: "Scale & Iterate",
    detail:
      "We refine sequences, expand channels, and tighten reporting so pipeline stays predictable as you grow.",
  },
];

const useCases = [
  {
    title: "Outbound email engine",
    summary:
      "Multi-step cold email infrastructure with deliverability monitoring, personalization, and reply routing.",
    outcome: "Adds 40% more booked calls from outbound alone.",
    category: "B2B services",
    highlights: [
      "Domain warmup & inbox rotation",
      "ICP-based personalization",
      "CRM sync on every reply",
    ],
  },
  {
    title: "LinkedIn pipeline system",
    summary:
      "Automated connection requests, follow-ups, and meeting prompts aligned to your sales motion.",
    outcome: "Turns engagement into 3–5x more qualified conversations.",
    category: "Agencies",
    highlights: [
      "Decision-maker targeting",
      "Multi-touch sequences",
      "Meeting booking handoff",
    ],
  },
  {
    title: "Revenue operations layer",
    summary:
      "HubSpot or CRM automation that enriches leads, scores fit, and triggers the right nurture or sales sequence.",
    outcome: "Saves 12 hours of manual pipeline work each week.",
    category: "SaaS & professional services",
    highlights: [
      "Lead scoring & enrichment",
      "Pipeline visibility",
      "Automated follow-up rules",
    ],
  },
];

const workflows: WorkflowItem[] = [
  {
    id: "wf-001",
    title: "WhatsApp Deterministic AI Agent - Task Assigner",
    shortDesc:
      "Automate turning informal CEO instructions into structured CRM tasks to eliminate manual data entry.",
    longDesc:
      "Built an n8n workflow triggered via WhatsApp (WAHA). It processes text or voice notes (using OpenAI Whisper) and an LLM to extract the employee, project, task, and date. After validating the intent and date, it links Airtable relational IDs, creates the task, and sends a WhatsApp confirmation.",
    category: "n8n Workflow",
    categoryStyle: "hybrid",
    status: "active",
    tech: ["n8n", "ChatGPT API", "Airtable", "WhatsApp"],
    triggerType: "Form Webhook",
    stepsCount: 15,
    complexity: 82,
    outcome:
      "Removed administrative bottlenecks, prevented data loss from field directives, and maintained perfect database hygiene.",
    images: ["/images/workflows/waha1.png"],
    nodes: [
      { label: "WhatsApp Trigger", type: "trigger" },
      { label: "Analyze", type: "ai" },
      { label: "Draft Reply", type: "ai" },
      { label: "CRM Log", type: "output" },
      { label: "WhatsApp Reply", type: "output" },
    ],
  },
  {
    id: "wf-002",
    title: "Digital AI Receptionist",
    shortDesc:
      "Provide a fully automated, human-like phone receptionist for Eliminator Boats to handle sales, service, general inquiries, and emergencies without missed calls.",
    longDesc:
      "An AI voice receptionist with structured conversation flows for sales, service, hiring, and emergency routing. Can also check calendar availability and book appointments, while logging caller details to Sheets for staff visibility.",
    category: "n8n Workflow",
    categoryStyle: "n8n",
    status: "active",
    tech: ["n8n", "Retell AI", "Make.com", "Cal.com"],
    triggerType: "Lead List",
    stepsCount: 12,
    complexity: 68,
    outcome:
      "Eliminated missed calls, improved caller experience, and streamlined scheduling and intake. This allowed staff to focus on important conversations while the AI other calls.",
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
    title: "Cold Email Infrastructure Walkthrough",
    description:
      "See how multi-step outbound sequences, deliverability checks, and reply routing work as one system.",
    length: "03:05",
    category: "Email",
  },
  {
    title: "LinkedIn Pipeline Demo",
    description:
      "Watch decision-maker outreach, follow-up timing, and meeting handoffs run without manual busywork.",
    length: "02:08",
    category: "LinkedIn",
  },
  {
    title: "GTM Ops Dashboard",
    description:
      "Track pipeline health, sequence performance, and conversion quality in one revenue operations view.",
    length: "01:47",
    category: "RevOps",
  },
];

const testimonials = [
  {
    quote:
      "Our outbound finally became consistent. We're booking meetings every week without relying on manual follow-ups.",
    author: "Founder",
    role: "B2B Services Company",
  },
  {
    quote:
      "The system replaced three tools and half our outreach workload. Pipeline visibility improved immediately.",
    author: "Head of Growth",
    role: "SaaS Startup",
  },
  {
    quote:
      "We went from random lead generation to a structured outbound engine. It completely changed our sales process.",
    author: "Agency Owner",
    role: "Outbound Agency",
  },
];

const contactChannels = [
  { label: "Email", detail: "ali@aureliconsulting.com" },
  { label: "Phone and SMS", detail: "720-555-0199" },
  { label: "Office Hours", detail: "8am - 6pm MT, Mon-Sat" },
];

const faqs = [
  {
    question: "How customized are the systems?",
    answer:
      "Everything is built around your current workflow, offer, sales process, and tooling. We don't ship generic playbooks.",
  },
  {
    question: "Can these systems integrate with our existing CRM?",
    answer:
      "Yes. Most systems are designed to work alongside HubSpot, Salesforce, Pipedrive, and custom CRM workflows.",
  },
  {
    question: "Do you only work with agencies?",
    answer:
      "No. We work with agencies, service businesses, and B2B teams that rely on outbound pipeline generation.",
  },
  {
    question: "Is this done-for-you or collaborative?",
    answer:
      "Typically a mix of both. We handle the infrastructure build while staying aligned with your team on messaging, ICP, and handoffs.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Most outbound systems go live within 2 to 4 weeks after audit and architecture sign-off.",
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

  const { theme, toggleTheme } = useTheme();
  useScrollEffects(theme);

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
      nav.classList.toggle("nav--scrolled", window.scrollY > 40);
    };
    handler();
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
        theme,
        cssVarsPerTheme: {
          light: { "cal-brand": "#7c3aed" },
          dark: { "cal-brand": "#7c3aed" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [theme]);

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
      {/* Navigation */}
      <nav className="nav" ref={navRef} id="nav">
        <div className="nav-inner">
          <a
            href="#"
            className="nav-logo"
            aria-label="Aureli Consulting Home"
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
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={theme === "light" ? "Dark mode" : "Light mode"}
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
            <a href="#contact" className="btn btn-primary btn-sm">
              Book GTM audit
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="hero-content" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>GTM infrastructure for outbound teams</span>
          </div>

          <h1 className="hero-title">
            We build{" "}
            <span className="hero-word-blur gradient-text" data-text="outbound">
              outbound
            </span>
            <br />
            and{" "}
            <span className="hero-word-blur gradient-text" data-text="GTM">
              GTM
            </span>{" "}
            systems.
          </h1>

          <p className="hero-subtitle">
            Cold email, LinkedIn outreach, lead generation, and CRM automation —
            designed for scaling revenue, not activity.
          </p>
          <p className="hero-subline">
            Aureli designs and deploys the infrastructure behind modern outbound
            so your pipeline flows predictably.
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
              Book GTM audit
            </a>
            <a href="#workflows" className="btn btn-ghost btn-ghost--light">
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
              View systems
            </a>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Trust strip — closes the hero gradient section */}
      <section className="trust-strip" aria-label="Results and proof">
        <div className="trust-strip-inner" ref={statsRef}>
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
      </section>

      {/* Video + About */}
      <section className="about-video" id="about" data-reveal>
        <div className="about-video__media">
          <img
            src="/images/workflows/workflow.png"
            alt="Outbound infrastructure workflow preview"
            className="about-video__poster"
            loading="lazy"
          />
          <div className="about-video__overlay" aria-hidden="true" />
          <button type="button" className="about-video__play" aria-label="Play overview">
            <span>▶</span>
          </button>
        </div>
        <div className="about-video__copy">
          <span className="section__eyebrow">Who we are</span>
          <h2 className="about-video__title">
            We design outbound infrastructure — not one-off campaigns.
          </h2>
          <p className="about-video__desc">
            From cold email and LinkedIn workflows to lead enrichment, CRM
            automation, and appointment-setting systems — we build GTM
            infrastructure that keeps prospecting, outreach, follow-ups, and
            booking working as one connected operation.
          </p>
        </div>
      </section>

      {/* Tech Strip */}
      <section className="tech-strip" id="stack" aria-label="GTM stack">
        <p className="tech-strip-label">Stack we deploy</p>
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

      {/* Philosophy — brief impact statement */}
      <section className="philosophy" id="philosophy" data-reveal>
        <p className="philosophy__text">
          Outbound isn&apos;t a campaign.
          <br />
          It&apos;s{" "}
          <span className="philosophy__accent gradient-text">
            infrastructure
          </span>
          .
        </p>
      </section>

      <main>
        {/* Services */}
        <section className="section pinned-section" id="services">
          <div className="pinned-section__title" aria-hidden="true">
            Systems
          </div>
          <div className="pinned-section__content">
            <div className="section__header" data-reveal>
              <span className="section__eyebrow">What we build</span>
              <h2 className="section__title">
                Core systems that power predictable pipeline
              </h2>
              <p className="section__subtitle">
                Each system is designed to remove operational bottlenecks and
                create a more predictable outbound process.
              </p>
            </div>
            <div className="grid grid--systems">
              {highlights.map(({ num, title, description }) => (
                <article
                  className="card card--rise"
                  key={title}
                  data-aos="fade-up"
                >
                  <span className="card__num" aria-hidden="true">
                    {num}
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section section--alt pinned-section" id="process">
          <div className="pinned-section__title" aria-hidden="true">
            Process
          </div>
          <div className="pinned-section__content">
            <div className="section__header" data-reveal>
              <span className="section__eyebrow">How it works</span>
              <h2 className="section__title">How deployment works</h2>
              <p className="section__subtitle">
                Every outbound system is built around your offer, sales process,
                and operational workflow.
              </p>
            </div>
            <div className="timeline timeline--vertical">
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
          </div>
        </section>

        {/* Use Cases */}
        <section className="section section--cases" id="use-cases">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Use cases</span>
            <h2 className="section__title">
              Outbound systems in production
            </h2>
            <p className="section__subtitle">
              From cold email to LinkedIn and RevOps — we tailor every workflow
              to the pipeline motion you need to scale.
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
        <section
          className="section section--workflows pinned-section"
          id="workflows"
        >
          <div className="pinned-section__title" aria-hidden="true">
            Case studies
          </div>
          <div className="pinned-section__content">
          <div className="section-header" data-reveal>
            <div className="section-eyebrow ai-eyebrow">
              <span className="eyebrow-dot" />
              Case studies
            </div>
            <h2 className="section-title">
              Built infrastructure, not just{" "}
              <span className="gradient-text">promises</span>
            </h2>
            <p className="section-desc">
              Real outbound pipelines — n8n workflows and Python agents powering
              prospecting, enrichment, and revenue operations.
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
          </div>
        </section>

        {/* Demos */}
        <section className="section section--demos" id="demos">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">Walkthroughs</span>
            <h2 className="section__title">See the systems in action</h2>
            <p className="section__subtitle">
              Preview how outbound infrastructure handles prospecting, sequences,
              and pipeline updates end to end.
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
        <section
          className="section section--testimonials pinned-section"
          id="testimonials"
        >
          <div className="pinned-section__title" aria-hidden="true">
            Reviews
          </div>
          <div className="pinned-section__content">
            <div className="section__header" data-reveal>
              <span className="section__eyebrow">Testimonials</span>
              <h2 className="section__title">Built for teams that need predictable pipeline</h2>
              <p className="section__subtitle">
                We don&apos;t optimize clicks or impressions — we build systems
                that generate revenue conversations.
              </p>
            </div>
            <div className="testimonial-pin" data-reveal>
              <div className="testimonial-pin__track">
                {testimonials.map(({ quote, author, role }) => (
                  <figure className="testimonial" key={`${author}-${role}`}>
                    <blockquote>&ldquo;{quote}&rdquo;</blockquote>
                    <figcaption>
                      <span className="testimonial__author">{author}</span>
                      <span className="testimonial__role">{role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section section--contact" id="contact">
          <div className="contact__content" data-reveal>
            <span className="contact__tag">Book a GTM audit</span>
            <h2 className="section__title">
              Tell us about the outbound motion you need to scale
            </h2>
            <p className="section__subtitle">
              Share your current pipeline gaps and we&apos;ll send back a
              tailored infrastructure roadmap within two business days.
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
              <span className="contact__label">Book a strategy session</span>
              <p className="contact__subtitle">
                Grab time on our calendar for a 30-minute GTM audit. We&apos;ll
                review your outbound process, tooling, and pipeline goals live.
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
                config={{ layout: "month_view", theme }}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section--faq" id="faq">
          <div className="section__header" data-reveal>
            <span className="section__eyebrow">FAQ</span>
            <h2 className="section__title">Questions before you deploy</h2>
            <p className="section__subtitle">
              Get clear on how Aureli&apos;s GTM infrastructure works before you
              invest.
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

      {/* Final CTA */}
      <section className="final-cta" id="final-cta" data-reveal>
        <div className="final-cta__glow" aria-hidden="true" />
        <div className="final-cta__inner">
          <h2 className="final-cta__title">
            Build a predictable outbound system for your business
          </h2>
          <p className="final-cta__subtitle">
            Stop relying on inconsistent outreach and fragmented tools. We design
            GTM infrastructure that turns outbound into a repeatable revenue
            engine.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary btn-lg">
              Book GTM audit
            </a>
            <a href="#services" className="btn btn-ghost">
              View systems
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-text footer-logo">
                Aureli<span className="logo-accent"> </span>Consulting
              </span>
              <p className="footer-tagline">
                GTM infrastructure for outbound teams.
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
              <span className="tech-pill">HubSpot</span>{" "}
              <span className="tech-pill">Apollo</span>{" "}
              <span className="tech-pill">Clay</span>
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
          {/* <button
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
          </button> */}

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
