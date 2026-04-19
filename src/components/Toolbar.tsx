import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const Toolbar = () => {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export Functionality
  const handleExport = () => {
    const workflow = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hr-workflow-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Import Functionality
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Basic Validation
        if (!json.nodes || !Array.isArray(json.nodes) || !json.edges || !Array.isArray(json.edges)) {
          throw new Error('Invalid workflow format');
        }

        // Restore State
        setNodes(json.nodes);
        setEdges(json.edges);
        
        alert('Workflow imported successfully!');
      } catch (err) {
        alert('Error importing workflow: ' + (err instanceof Error ? err.message : 'Invalid JSON'));
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire canvas?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-2xl">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors border border-transparent hover:border-gray-100"
        title="Download Workflow as JSON"
      >
        <Download size={16} className="text-gray-500" />
        <span>Export</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors border border-transparent hover:border-gray-100"
        title="Upload Workflow JSON"
      >
        <Upload size={16} className="text-gray-500" />
        <span>Import</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <button
        onClick={handleClear}
        className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm font-semibold transition-colors border border-transparent hover:border-red-100"
        title="Clear Canvas"
      >
        <Trash2 size={16} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default Toolbar;
