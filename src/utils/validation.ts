import { WorkflowNode, Edge } from 'reactflow';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  invalidNodeIds: string[];
}

export const validateWorkflow = (nodes: WorkflowNode[], edges: Edge[]): ValidationResult => {
  const errors: string[] = [];
  const invalidNodeIds = new Set<string>();

  // 1. Exactly one Start Node
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start Node.');
  } else if (startNodes.length > 1) {
    errors.push('Workflow cannot have multiple Start Nodes.');
    startNodes.forEach(n => invalidNodeIds.add(n.id));
  }

  // 2. Start Node must not have incoming edges
  if (startNodes.length === 1) {
    const startNodeId = startNodes[0].id;
    const hasIncoming = edges.some((e) => e.target === startNodeId);
    if (hasIncoming) {
      errors.push('Start Node cannot have incoming connections.');
      invalidNodeIds.add(startNodeId);
    }
  }

  // 3. Connectivity check: Every node except Start must have at least one incoming edge
  // And every node except End must have at least one outgoing edge
  nodes.forEach((node) => {
    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);

    if (node.type !== 'start' && !hasIncoming) {
      errors.push(`Node "${getNodeTitle(node)}" is missing an incoming connection.`);
      invalidNodeIds.add(node.id);
    }

    if (node.type !== 'end' && !hasOutgoing) {
      errors.push(`Node "${getNodeTitle(node)}" is missing an outgoing connection.`);
      invalidNodeIds.add(node.id);
    }
  });

  // 4. Cycle Detection
  const cyclicIds = getCyclicNodeIds(nodes, edges);
  if (cyclicIds.length > 0) {
    errors.push('Workflow contains a loop (cycle), which is not sustainable for this HR process.');
    cyclicIds.forEach(id => invalidNodeIds.add(id));
  }

  return {
    isValid: errors.length === 0,
    errors,
    invalidNodeIds: Array.from(invalidNodeIds),
  };
};

function getNodeTitle(node: WorkflowNode): string {
  const data = node.data as any;
  return data.title || data.startTitle || data.label || 'Node';
}

function getCyclicNodeIds(nodes: WorkflowNode[], edges: Edge[]): string[] {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => adj.get(e.source)?.push(e.target));

  const cyclicNodes: string[] = [];
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const dfs = (v: string): boolean => {
    visited.add(v);
    recStack.add(v);

    const neighbors = adj.get(v) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        cyclicNodes.push(v);
        return true;
      }
    }

    recStack.delete(v);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cyclicNodes;
}
