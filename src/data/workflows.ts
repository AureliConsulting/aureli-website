import type { WorkflowItem } from "./types";

export const workflowFilters = [
  { label: "All", value: "all" },
  { label: "n8n", value: "n8n" },
  { label: "AI Agent", value: "agent" },
  { label: "Hybrid Pipeline", value: "hybrid" },
];

export const workflows: WorkflowItem[] = [
  {
    id: "wf-001",
    title: "WhatsApp Task Assignment System",
    shortDesc:
      "Turns informal WhatsApp instructions into structured CRM tasks with validation and confirmation.",
    longDesc:
      "A workflow triggered through WhatsApp that can process text or voice notes, extract employee, project, task, and date fields, validate intent, connect Airtable records, create the task, and send confirmation back through WhatsApp.",
    category: "n8n Workflow",
    categoryStyle: "hybrid",
    status: "active",
    tech: ["n8n", "ChatGPT API", "Airtable", "WhatsApp"],
    triggerType: "WhatsApp",
    stepsCount: 15,
    complexity: 82,
    problem: "Field instructions were easy to send but hard to convert into structured operational records.",
    systemBuilt:
      "A deterministic intake workflow that extracts task details, validates dates, links records, and confirms the created task.",
    toolsUsed: ["n8n", "ChatGPT API", "Airtable", "WhatsApp"],
    outcome:
      "Example outcome: field instructions can become structured CRM tasks with validation and confirmation steps.",
    images: ["/images/workflows/waha1.png"],
    nodes: [
      { label: "WhatsApp Trigger", type: "trigger" },
      { label: "Analyze", type: "ai" },
      { label: "Validate", type: "action" },
      { label: "CRM Log", type: "output" },
      { label: "Reply", type: "output" },
    ],
  },
  {
    id: "wf-002",
    title: "Digital AI Receptionist",
    shortDesc:
      "AI phone receptionist concept for inquiry handling, categorization, routing, and scheduling handoff.",
    longDesc:
      "A voice receptionist system with structured conversation flows for sales, service, general questions, and escalation routing. It can collect caller context, check calendar availability, and log caller details for staff review.",
    category: "AI Agent",
    categoryStyle: "n8n",
    status: "active",
    tech: ["n8n", "Retell AI", "Make.com", "Cal.com"],
    triggerType: "Inbound Call",
    stepsCount: 12,
    complexity: 68,
    problem: "Inbound calls needed a consistent way to collect intent, route urgency, and support booking.",
    systemBuilt:
      "A call intake system with scripted flows, calendar handoff, call logging, and escalation rules.",
    toolsUsed: ["n8n", "Retell AI", "Make.com", "Cal.com"],
    outcome:
      "Example outcome: calls can be categorized, routed, logged, and connected to scheduling workflows for staff review.",
    nodes: [
      { label: "Inbound Call", type: "trigger" },
      { label: "Classify", type: "ai" },
      { label: "Route", type: "action" },
      { label: "Book or Log", type: "output" },
    ],
  },
  {
    id: "wf-003",
    title: "Voice Booking Pipeline",
    shortDesc:
      "Inbound call flow that extracts booking intent, checks availability, and sends SMS confirmation.",
    longDesc:
      "A Retell AI voice agent handles inbound booking requests, extracts intent, checks Cal.com availability, confirms the slot, and fires a Twilio SMS confirmation. The system can escalate if urgent or frustrated language is detected.",
    category: "AI Agent",
    categoryStyle: "agent",
    status: "active",
    tech: ["Python", "Retell AI", "Cal.com", "Twilio"],
    triggerType: "Inbound Call",
    stepsCount: 8,
    complexity: 75,
    problem: "Booking requests required manual back-and-forth across phone, calendar, and text confirmation.",
    systemBuilt:
      "A voice booking pipeline with intent extraction, availability lookup, confirmation, and escalation logic.",
    toolsUsed: ["Python", "Retell AI", "Cal.com", "Twilio"],
    outcome:
      "Example outcome: booking requests can be captured and confirmed without manual back-and-forth.",
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
      "Parallel research agents produce a reusable prospect brief for outbound teams.",
    longDesc:
      "Given a company name or URL, parallel research agents inspect public web presence, LinkedIn context, and recent signals. A synthesis step merges findings into a structured outreach brief with positioning notes and suggested angles.",
    category: "AI Agent",
    categoryStyle: "agent",
    status: "active",
    tech: ["Python", "Claude 3.5", "tool_use", "DuckDuckGo"],
    triggerType: "API / CLI",
    stepsCount: 7,
    complexity: 88,
    problem: "Prospect research was slow, inconsistent, and difficult to reuse across outbound sequences.",
    systemBuilt:
      "A multi-agent research workflow that gathers signals and turns them into an outreach-ready brief.",
    toolsUsed: ["Python", "Claude 3.5", "tool_use", "DuckDuckGo"],
    outcome:
      "Example outcome: prospect research is packaged into a reusable outreach brief.",
    nodes: [
      { label: "Input", type: "trigger" },
      { label: "Research", type: "ai" },
      { label: "Synthesize", type: "ai" },
      { label: "Brief Output", type: "output" },
    ],
  },
  {
    id: "wf-005",
    title: "Review Monitor & Draft Response System",
    shortDesc:
      "Scheduled review monitoring, sentiment classification, response drafting, and team digest.",
    longDesc:
      "A scheduled workflow checks review sources, classifies sentiment, drafts owner responses, and creates a team digest. Drafts can be reviewed before publishing so responses remain controlled.",
    category: "n8n Workflow",
    categoryStyle: "n8n",
    status: "in-progress",
    tech: ["n8n", "Claude API", "Google Places", "Slack"],
    triggerType: "Schedule",
    stepsCount: 11,
    complexity: 72,
    problem: "New reviews were easy to miss and response quality varied when handled manually.",
    systemBuilt:
      "A scheduled monitoring workflow with sentiment classification, drafted responses, and Slack summary.",
    toolsUsed: ["n8n", "Claude API", "Google Places", "Slack"],
    outcome:
      "Example outcome: new reviews are surfaced, classified, and drafted for approval.",
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
      "New CRM contacts are enriched, scored, and routed into the right follow-up sequence.",
    longDesc:
      "When a contact is created in HubSpot, a Python enrichment process collects public company context, scores ICP fit, writes enriched properties back to the CRM, and triggers the appropriate sequence or nurture path.",
    category: "Hybrid Pipeline",
    categoryStyle: "hybrid",
    status: "active",
    tech: ["n8n", "Python", "Anthropic SDK", "HubSpot"],
    triggerType: "New CRM Contact",
    stepsCount: 10,
    complexity: 78,
    problem: "New leads required manual research, fit scoring, CRM updates, and routing decisions.",
    systemBuilt:
      "A CRM enrichment bot that scores fit, writes structured fields, and routes leads automatically.",
    toolsUsed: ["n8n", "Python", "Anthropic SDK", "HubSpot"],
    outcome:
      "Example outcome: new contacts can be enriched, scored, and routed automatically.",
    nodes: [
      { label: "New Contact", type: "trigger" },
      { label: "Enrich", type: "action" },
      { label: "Score", type: "ai" },
      { label: "Sequence", type: "output" },
    ],
  },
];
