import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { StartNodeData } from '../types/workflow';
import NodeWrapper from './NodeWrapper';

const StartNode = ({ id, data, selected }: NodeProps<StartNodeData>) => {
  return (
    <NodeWrapper
      id={id}
      type="start"
      selected={selected}
      title={data.startTitle || 'Start'}
      icon={<Play size={16} className="text-green-500" />}
      isStart
    >
      <div className="text-[10px] text-gray-400 italic">Workflow Entry Point</div>
    </NodeWrapper>
  );
};

export default memo(StartNode);
