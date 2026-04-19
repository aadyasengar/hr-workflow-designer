import React, { useState, useEffect } from 'react';
import { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomationNodeData, 
  EndNodeData, 
import { fetchAutomations } from '../api/mockApi';
import { Plus, Trash2 } from 'lucide-react';
import { AutomationNodeForm } from './AutomationNodeForm';

interface FormProps<T> {
  data: T;
  onChange: (data: Partial<T>) => void;
}

export const StartNodeForm = ({ data, onChange }: FormProps<StartNodeData>) => {
  const [metadata, setMetadata] = useState(Object.entries(data.metadata || {}));

  const updateMetadata = (newMeta: [string, string][]) => {
    setMetadata(newMeta);
    onChange({ metadata: Object.fromEntries(newMeta) } as any);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Title</label>
        <input
          type="text"
          value={data.startTitle}
          onChange={(e) => onChange({ startTitle: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Metadata (Key-Value)</label>
        {metadata.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              placeholder="Key"
              value={key}
              onChange={(e) => {
                const updated = [...metadata];
                updated[idx][0] = e.target.value;
                updateMetadata(updated);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
            />
            <input
              placeholder="Value"
              value={value}
              onChange={(e) => {
                const updated = [...metadata];
                updated[idx][1] = e.target.value;
                updateMetadata(updated);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
            />
            <button onClick={() => updateMetadata(metadata.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 size={16}/></button>
          </div>
        ))}
        <button 
          onClick={() => updateMetadata([...metadata, ['', '']])}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          <Plus size={14} className="mr-1"/> Add Metadata
        </button>
      </div>
    </div>
  );
};

export const TaskNodeForm = ({ data, onChange }: FormProps<TaskNodeData>) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Assignee</label>
        <input
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        />
      </div>
    </div>
  );
};

export const ApprovalNodeForm = ({ data, onChange }: FormProps<ApprovalNodeData>) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Approval Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Approver Role</label>
        <select
          value={data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Department Head">Department Head</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Auto-Approve Threshold ($)</label>
        <input
          type="number"
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        />
      </div>
    </div>
  );
};

export { AutomationNodeForm };

export const EndNodeForm = ({ data, onChange }: FormProps<EndNodeData>) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">End Message</label>
        <textarea
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value } as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
          rows={2}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={data.summaryFlag}
          onChange={(e) => onChange({ summaryFlag: e.target.checked } as any)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">Generate Summary</label>
      </div>
    </div>
  );
};
