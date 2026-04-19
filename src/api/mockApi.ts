import { AutomationAction, SimulationLog, WorkflowNode, Edge } from '../types/workflow';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_notify', label: 'Slack Notification', params: ['channel', 'message'] },
];

export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_AUTOMATIONS;
};

export const simulateWorkflow = async (nodes: WorkflowNode[], edges: Edge[]): Promise<SimulationLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const logs: SimulationLog[] = [];
  const startNode = nodes.find(n => n.data.type === 'start');

  if (!startNode) {
    logs.push({
      step: 1, nodeId: 'none', nodeType: 'system',
      message: 'Critical Error: Start node not found.',
      status: 'error'
    });
    return logs;
  }

  let currentStep = 1;
  let currentNode: WorkflowNode | undefined = startNode;
  const visited = new Set<string>();

  while (currentNode) {
    if (visited.has(currentNode.id)) {
      logs.push({
        step: currentStep++, nodeId: currentNode.id, nodeType: currentNode.data.type,
        message: `Infinite loop detected at node: ${getNodeTitle(currentNode)}`,
        status: 'error'
      });
      break;
    }
    visited.add(currentNode.id);

    // Generate descriptive message based on type
    const message = generateExecutionMessage(currentNode);
    logs.push({
      step: currentStep++,
      nodeId: currentNode.id,
      nodeType: currentNode.data.type,
      message,
      status: 'success'
    });

    if (currentNode.data.type === 'end') break;

    // Find outgoing edges
    const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
    
    if (outgoingEdges.length === 0) {
      logs.push({
        step: currentStep++, nodeId: currentNode.id, nodeType: currentNode.data.type,
        message: 'Workflow stalled: No outgoing connection found.',
        status: 'warning'
      });
      break;
    }

    // Branching logic: for simplicity, we follow the first edge
    // but we could log that we're moving to the next step
    const nextEdge = outgoingEdges[0];
    const nextNode = nodes.find(n => n.id === nextEdge.target);

    if (!nextNode) {
      logs.push({
        step: currentStep++, nodeId: 'none', nodeType: 'system',
        message: 'Workflow failed: Target node not found in graph.',
        status: 'error'
      });
      break;
    }

    currentNode = nextNode;
  }

  logs.push({
    step: currentStep, nodeId: 'system', nodeType: 'system',
    message: '🏁 Workflow simulation finished successfully.',
    status: 'success'
  });

  return logs;
};

// Helper to get a human-readable title for any node
function getNodeTitle(node: WorkflowNode): string {
  const data = node.data as any;
  return data.title || data.startTitle || data.label || 'Untitled Node';
}

// Helper to generate descriptive logs per node type
function generateExecutionMessage(node: WorkflowNode): string {
  const data = node.data as any;
  const type = node.data.type;

  switch (type) {
    case 'start':
      return `🚀 [Start] Initiating HR process: "${data.startTitle || 'New Workflow'}"`;
    case 'task':
      return `📝 [Task] Executing: "${data.title}". assigned to: ${data.assignee || 'Unassigned'}`;
    case 'approval':
      return `⚖️ [Approval] Pending review by: ${data.approverRole || 'Manager'} (Threshold: ${data.autoApproveThreshold || 0})`;
    case 'automated':
      return `🤖 [Automated] Running action: "${data.actionId || 'Unknown'}" with ${Object.keys(data.params || {}).length} params`;
    case 'end':
      return `🏁 [End] Process completed. Message: "${data.endMessage || 'Successful'}"`;
    default:
      return `⚙️ Running ${type}`;
  }
}
