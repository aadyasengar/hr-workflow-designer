import React from 'react';
import { AutomationNodeData } from '../types/workflow';
import { useAutomations } from '../hooks/useAutomations';
import DynamicParamField from './DynamicParamField';
import { Loader2 } from 'lucide-react';

interface AutomationNodeFormProps {
  data: AutomationNodeData;
  onChange: (data: Partial<AutomationNodeData>) => void;
}

export const AutomationNodeForm = ({ data, onChange }: AutomationNodeFormProps) => {
  const { actions, isLoading, error } = useAutomations();

  const handleActionChange = (actionId: string) => {
    const selectedAction = actions.find((a) => a.id === actionId);
    // Initialize new params as empty strings based on action definition
    const newParams = selectedAction 
      ? Object.fromEntries(selectedAction.params.map(p => [p, ''])) 
      : {};
    
    onChange({ actionId, params: newParams });
  };

  const handleParamChange = (key: string, value: string) => {
    onChange({
      params: {
        ...data.params,
        [key]: value,
      },
    });
  };

  if (error) return <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">{error}</div>;

  const currentAction = actions.find((a) => a.id === data.actionId);

  return (
    <div className="space-y-6">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      {/* Action Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Action</label>
        <div className="relative">
          <select
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
            disabled={isLoading}
            className={`w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
          >
            <option value="">-- Select an Integration --</option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
          {isLoading && (
            <div className="absolute right-3 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Parameters */}
      {currentAction && (
        <div className="space-y-4 border-t border-gray-100 pt-4 animate-in fade-in duration-300">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-tight">Configuration Parameters</h4>
          {currentAction.params.map((paramKey) => (
            <DynamicParamField
              key={paramKey}
              label={paramKey}
              value={data.params[paramKey] || ''}
              onChange={(value) => handleParamChange(paramKey, value)}
            />
          ))}
        </div>
      )}

      {!data.actionId && !isLoading && (
        <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-600 border border-blue-100">
          Select an action above to configure its dynamic parameters.
        </div>
      )}
    </div>
  );
};
