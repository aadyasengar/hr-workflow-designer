import React from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { 
  StartNodeForm, 
  TaskNodeForm, 
  ApprovalNodeForm, 
  AutomationNodeForm, 
  EndNodeForm 
} from '../forms/NodeForms';
import { X, Settings } from 'lucide-react';

const ConfigPanel = () => {
  const { nodes, selectedNodeId, selectNode, updateNodeData } = useWorkflowStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l bg-gray-50 p-6 h-full flex flex-col items-center justify-center text-center">
        <Settings size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400">No node selected</h3>
        <p className="text-sm text-gray-400">Select a node to configure its properties</p>
      </aside>
    );
  }

  const renderForm = () => {
    const data = selectedNode.data;
    const onChange = (newData: any) => updateNodeData(selectedNode.id, newData);

    switch (data.type) {
      case 'start':
        return <StartNodeForm data={data as any} onChange={onChange} />;
      case 'task':
        return <TaskNodeForm data={data as any} onChange={onChange} />;
      case 'approval':
        return <ApprovalNodeForm data={data as any} onChange={onChange} />;
      case 'automated':
        return <AutomationNodeForm data={data as any} onChange={onChange} />;
      case 'end':
        return <EndNodeForm data={data as any} onChange={onChange} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <aside className="w-80 border-l bg-white p-6 h-full overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 capitalize">{selectedNode.data.type} Node</h2>
          <p className="text-xs text-gray-500">Node ID: {selectedNode.id.slice(0, 8)}...</p>
        </div>
        <button 
          onClick={() => selectNode(null)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {renderForm()}
      </div>
    </aside>
  );
};

export default ConfigPanel;
