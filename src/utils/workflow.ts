import type { WorkflowStatus } from "../data/types";

const TECH_CLASS_MAP: Record<string, string> = {
  n8n: "tb-n8n",
  python: "tb-python",
  "claude api": "tb-claude",
  "claude 3.5": "tb-claude",
  "anthropic sdk": "tb-claude",
  openai: "tb-openai",
  "chatgpt api": "tb-openai",
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
  whatsapp: "tb-whatsapp",
  "retell ai": "tb-retell",
  "cal.com": "tb-cal",
  "google places": "tb-google",
  duckduckgo: "tb-duckduckgo",
  tool_use: "tb-tool-use",
};

export function getTechClass(tech: string): string {
  return TECH_CLASS_MAP[tech.toLowerCase()] ?? "tb-default";
}

export function getStatusDotClass(status: WorkflowStatus) {
  return status === "active"
    ? "active"
    : status === "in-progress"
      ? "in-progress"
      : "archived";
}

export function getStatusLabel(status: WorkflowStatus) {
  return status === "active"
    ? "Active"
    : status === "in-progress"
      ? "In Progress"
      : "Archived";
}
