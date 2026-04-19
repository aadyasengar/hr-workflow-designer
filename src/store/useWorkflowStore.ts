/**
 * @store useWorkflowStore
 *
 * Centralized state manager for the HR Workflow Designer, built with Zustand.
 *
 * Zustand was chosen over React Context or Redux because it integrates cleanly
 * with React Flow's event-driven model, allowing state updates to be triggered
 * from both React components and non-React callbacks without boilerplate.
 *
 * Manages:
 *  - `nodes`          — The complete set of workflow nodes on the canvas.
 *  - `edges`          — All directional connections between nodes.
 *  - `selectedNodeId` — The currently focused node for the config panel.
 *  - `invalidNodeIds` — Nodes flagged by the validation engine, used for
 *                       visual error highlighting on the canvas.
 *
 * Scalability:
 *  Adding a new node type requires only a new case in `getDefaultData()`.
 *  All actions (add, update, delete) operate generically on `WorkflowNode`,
 *  so no store changes are needed when the node ecosystem grows.
 */
import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  NodeChange, 
  EdgeChange 
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowState, WorkflowNode, NodeType, WorkflowNodeData } from '../types/workflow';

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // --- STATE ---
  nodes: [],
  edges: [],
  selectedNodeId: null,
  invalidNodeIds: [],

  // --- ACTIONS ---
  setInvalidNodeIds: (ids) => set({ invalidNodeIds: ids }),
  
  // Set explicit nodes (e.g., from initial state or API)
  setNodes: (nodes) => set({ nodes }),
  
  // Set explicit edges
  setEdges: (edges) => set({ edges }),

  // Selection management
  selectNode: (id) => set({ selectedNodeId: id }),

  // React Flow internal handlers
  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }));
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }));
  },

  /**
   * Updates data for a specific node while maintaining immutability.
   * Merges partial data into the existing node data object.
   */
  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          // Deep merge or specific field merge
          return { 
            ...node, 
            data: { ...node.data, ...data } 
          };
        }
        return node;
      }),
    }));
  },

  /**
   * Adds a new node to the canvas.
   * Validates singleton nodes (Start) and initializes with default data.
   */
  addNode: (type, position) => {
    const { nodes } = get();
    
    // Singleton Validation (Example: Only one Start node)
    if (type === 'start' && nodes.some(n => n.type === 'start')) {
      return; // Could throw error or show notification here
    }

    const id = uuidv4();
    const newNode: WorkflowNode = {
      id,
      type, // This uses the registered React Flow node type
      position,
      data: getDefaultData(type),
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  /**
   * Deletes a node and all associated edges.
   */
  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },
}));

/**
 * Helper to initialize data for new nodes based on type.
 * Centralized here to make it easy to extend for new node types.
 */
function getDefaultData(type: NodeType): WorkflowNodeData {
  const base = { label: type.charAt(0).toUpperCase() + type.slice(1), type };
  
  switch (type) {
    case 'start':
      return { ...base, startTitle: 'Workflow Started', metadata: {} } as any;
    case 'task':
      return { ...base, title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} } as any;
    case 'approval':
      return { ...base, title: 'Approval Required', approverRole: 'Manager', autoApproveThreshold: 0 } as any;
    case 'automated':
      return { ...base, title: 'Automated Step', actionId: '', params: {} } as any;
    case 'end':
      return { ...base, endMessage: 'Workflow Completed', summaryFlag: false } as any;
    default:
      return base as any;
  }
}
