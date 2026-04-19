import React, { useCallback, useRef, useState } from 'react';
import { NodeType } from '../types/workflow';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  ReactFlowProvider,
  ReactFlowInstance,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../store/useWorkflowStore';
import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode
};

const WorkflowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    selectNode,
    addNode 
  } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        fitView
      >
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-dashed border-gray-300 animate-in fade-in zoom-in duration-500">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">➕</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Canvas is Empty</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">
                Drag nodes from the sidebar to start building your workflow
              </p>
            </div>
          </div>
        )}
        <Background variant={BackgroundVariant.Dots} gap={20} color="#cbd5e1" />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
          className="!bg-white border rounded-lg shadow-lg"
          maskColor="rgba(241, 245, 249, 0.6)"
        />
        <Panel position="top-left" className="bg-white/80 backdrop-blur-md p-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">HR Workflow Designer</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);
