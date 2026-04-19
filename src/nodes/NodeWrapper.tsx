import React from 'react';
import { Handle, Position } from 'reactflow';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { NodeType } from '../types/workflow';

interface NodeWrapperProps {
  id: string;
  type: NodeType;
  selected?: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  isStart?: boolean;
  isEnd?: boolean;
}

const NodeWrapper = ({ 
  id, 
  type, 
  selected, 
  children, 
  icon, 
  title,
  isStart = false,
  isEnd = false 
}: NodeWrapperProps) => {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const invalidNodeIds = useWorkflowStore((state) => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative min-w-[180px] shadow-lg rounded-lg border transition-all overflow-hidden 
      ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
      ${isInvalid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100'}
      ${getBackgroundColor(type)}
    `}>
      {/* Visual Sidebar Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getAccentColor(type)}`}></div>
      
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2.5 h-2.5 bg-gray-300 !border-2 !border-white"
        />
      )}
      
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${getIconContainerColor(type)} shadow-sm border border-black/5`}>
              {icon}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{type}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(id);
            }}
            className="p-1 hover:bg-black/5 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-800 leading-tight">{title}</h4>
          <div className="mt-2 empty:hidden">
            {children}
          </div>
        </div>
      </div>

      {!isEnd && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2.5 h-2.5 bg-gray-400 !border-2 !border-white"
        />
      )}
    </div>
  );
};

const getBackgroundColor = (type: NodeType) => {
  switch (type) {
    case 'start': return 'bg-green-50';
    case 'task': return 'bg-blue-50';
    case 'approval': return 'bg-orange-50'; // Using orange as yellow surrogate for better contrast
    case 'automated': return 'bg-purple-50';
    case 'end': return 'bg-red-50';
    default: return 'bg-white';
  }
};

const getAccentColor = (type: NodeType) => {
  switch (type) {
    case 'start': return 'bg-green-500';
    case 'task': return 'bg-blue-500';
    case 'approval': return 'bg-orange-500';
    case 'automated': return 'bg-purple-500';
    case 'end': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getIconContainerColor = (type: NodeType) => {
  switch (type) {
    case 'start': return 'bg-white text-green-600';
    case 'task': return 'bg-white text-blue-600';
    case 'approval': return 'bg-white text-orange-600';
    case 'automated': return 'bg-white text-purple-600';
    case 'end': return 'bg-white text-red-600';
    default: return 'bg-white text-gray-600';
  }
};

export default NodeWrapper;
