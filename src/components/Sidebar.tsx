import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Flag } from 'lucide-react';
import { NodeType } from '../types/workflow';

const NODE_TYPES: { type: NodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'start', label: 'Start', icon: <Play size={18} />, color: 'bg-green-100 text-green-700 border-green-200' },
  { type: 'task', label: 'Task', icon: <CheckSquare size={18} />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { type: 'approval', label: 'Approval', icon: <UserCheck size={18} />, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { type: 'automated', label: 'Automation', icon: <Zap size={18} />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { type: 'end', label: 'End', icon: <Flag size={18} />, color: 'bg-red-100 text-red-700 border-red-200' },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r bg-gray-50 p-4 h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Nodes</h2>
      <p className="text-xs text-gray-500 mb-4 uppercase font-semibold">Drag & Drop to Canvas</p>
      <div className="space-y-3">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            className={`flex items-center p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${node.color}`}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <div className="mr-3">{node.icon}</div>
            <span className="font-medium">{node.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Workflow Guide</h3>
        <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
          <li>Only one <strong>Start</strong> node allowed.</li>
          <li>Every workflow must end with an <strong>End</strong> node.</li>
          <li>Configuration updates automatically.</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
