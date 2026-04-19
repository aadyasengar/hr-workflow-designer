import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';

/**
 * Node Type Identifiers
 */
export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

/**
 * Base data shared across all HR nodes
 */
export interface BaseNodeData {
  label: string;
  type: NodeType;
}

/**
 * Specific data structures for each node type
 */
export interface StartNodeData extends BaseNodeData {
  type: 'start';
  startTitle: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomationNodeData extends BaseNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

/**
 * Discriminated Union for Node data
 */
export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomationNodeData 
  | EndNodeData;

/**
 * Strongly typed React Flow nodes based on their identifier 'type'
 */
export type StartWorkflowNode = Node<StartNodeData, 'start'>;
export type TaskWorkflowNode = Node<TaskNodeData, 'task'>;
export type ApprovalWorkflowNode = Node<ApprovalNodeData, 'approval'>;
export type AutomationWorkflowNode = Node<AutomationNodeData, 'automated'>;
export type EndWorkflowNode = Node<EndNodeData, 'end'>;

/**
 * The unified WorkflowNode type (Discriminated Union)
 * Checking 'node.type' will now correctly narrow 'node.data'
 */
export type WorkflowNode = 
  | StartWorkflowNode 
  | TaskWorkflowNode 
  | ApprovalWorkflowNode 
  | AutomationWorkflowNode 
  | EndWorkflowNode;

/**
 * Automation & API types
 */
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationLog {
  step: number;
  nodeId: string;
  nodeType: string;
  message: string;
  status: 'success' | 'warning' | 'error';
}

/**
 * Global Workflow State Interface
 */
export interface WorkflowState {
  // State
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  invalidNodeIds: string[];

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  addNode: (type: NodeType, position: { x: number, y: number }) => void;
  deleteNode: (id: string) => void;
  setInvalidNodeIds: (ids: string[]) => void;
}
