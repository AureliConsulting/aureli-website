export type WorkflowStatus = "active" | "in-progress" | "archived";
export type NodeType = "trigger" | "ai" | "action" | "output";
export type WorkflowCategoryStyle = "n8n" | "agent" | "hybrid";

export interface WorkflowNode {
  label: string;
  type: NodeType;
}

export interface WorkflowItem {
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
  problem: string;
  systemBuilt: string;
  toolsUsed: string[];
  nodes: WorkflowNode[];
  images?: string[];
}
