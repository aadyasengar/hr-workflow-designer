import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { UserCheck } from 'lucide-react';
import { ApprovalNodeData } from '../types/workflow';
import NodeWrapper from './NodeWrapper';

const ApprovalNode = ({ id, data, selected }: NodeProps<ApprovalNodeData>) => {
  return (
    <NodeWrapper
      id={id}
      type="approval"
      selected={selected}
      title={data.title || 'Approval'}
      icon={<UserCheck size={16} className="text-orange-500" />}
    >
      <div className="text-[10px] text-orange-600 font-medium">{data.approverRole || 'Manager'}</div>
    </NodeWrapper>
  );
};

export default memo(ApprovalNode);
