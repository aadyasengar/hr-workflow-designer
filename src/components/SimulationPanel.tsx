import React, { useState, useMemo } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { simulateWorkflow } from '../api/mockApi';
import { SimulationLog } from '../types/workflow';
import { Play, Loader2, CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert, Info } from 'lucide-react';
import { validateWorkflow } from '../utils/validation';

const SimulationPanel = () => {
  const { nodes, edges } = useWorkflowStore();
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const setInvalidNodeIds = useWorkflowStore((state) => state.setInvalidNodeIds);

  // Reactive Validation
  const validation = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);

  const handleRun = async () => {
    setIsOpen(true);
    setLogs([]);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setInvalidNodeIds(validation.invalidNodeIds);
      setIsLoading(false);
      return;
    }

    setValidationErrors([]);
    setInvalidNodeIds([]);
    setIsLoading(true);
    try {
      const results = await simulateWorkflow(nodes, edges);
      setLogs(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
      {!isOpen && (
        <div className="flex flex-col items-center gap-2 group">
          {!validation.isValid && nodes.length > 0 && (
            <div className="bg-amber-50 text-amber-700 text-[10px] px-3 py-1 rounded-full border border-amber-200 shadow-sm animate-in fade-in slide-in-from-bottom-1 flex items-center gap-1.5 font-medium">
              <Info size={12} />
              Workflow Issue Detected
            </div>
          )}
          <button
            onClick={handleRun}
            disabled={isLoading || (!validation.isValid && nodes.length > 0)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 font-bold text-white
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 
                (!validation.isValid && nodes.length > 0) ? 'bg-gray-400 cursor-not-allowed opacity-80' : 
                'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span>Run Workflow</span>
              </>
            )}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="bg-white w-[500px] max-h-[400px] border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Workflow Simulation Logs</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            > Close </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
                <p className="text-sm text-gray-500">Preparing execution...</p>
              </div>
            ) : validationErrors.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                  <ShieldAlert size={18} />
                  <span>Validation Failed</span>
                </div>
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="flex gap-3 text-sm p-2 bg-red-50 rounded border border-red-100/50 animate-in fade-in duration-300">
                    <div className="mt-0.5"><AlertCircle size={16} className="text-red-500" /></div>
                    <span className="text-red-700">{error}</span>
                  </div>
                ))}
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 text-sm animate-in fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="mt-0.5">{getIcon(log.status)}</div>
                  <div>
                    <span className="font-mono text-xs text-gray-400 mr-2">Step {log.step}:</span>
                    <span className="text-gray-700">{log.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50 text-right">
             <button 
                onClick={handleRun}
                disabled={isLoading}
                className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1 ml-auto"
             >
               <Play size={14} fill="currentColor" /> Rerun
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
