import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import { TaskNodeData } from '../types/workflow';
import NodeWrapper from './NodeWrapper';

const TaskNode = ({ id, data, selected }: NodeProps<TaskNodeData>) => {
  return (
    <NodeWrapper
      id={id}
      type="task"
      selected={selected}
      title={data.title || 'Task'}
      icon={<CheckSquare size={16} className="text-blue-500" />}
    >
      {data.assignee && (
        <div className="text-[10px] text-blue-600 font-medium">Assignee: {data.assignee}</div>
      )}
    </NodeWrapper>
  );
};

export default memo(TaskNode);
