import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { AutomationNodeData } from '../types/workflow';
import NodeWrapper from './NodeWrapper';

const AutomatedNode = ({ id, data, selected }: NodeProps<AutomationNodeData>) => {
  return (
    <NodeWrapper
      id={id}
      type="automated"
      selected={selected}
      title={data.title || 'Automation'}
      icon={<Zap size={16} className="text-purple-500" />}
    >
      <div className="text-[10px] text-purple-600 italic">Action ID: {data.actionId || 'None'}</div>
    </NodeWrapper>
  );
};

export default memo(AutomatedNode);
