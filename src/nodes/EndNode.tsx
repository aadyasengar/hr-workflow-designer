import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Flag } from 'lucide-react';
import { EndNodeData } from '../types/workflow';
import NodeWrapper from './NodeWrapper';

const EndNode = ({ id, data, selected }: NodeProps<EndNodeData>) => {
  return (
    <NodeWrapper
      id={id}
      type="end"
      selected={selected}
      title={data.endMessage || 'End'}
      icon={<Flag size={16} className="text-red-500" />}
      isEnd
    >
      <div className="text-[10px] text-gray-400 italic">Workflow Conclusion</div>
    </NodeWrapper>
  );
};

export default memo(EndNode);
