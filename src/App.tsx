import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import ConfigPanel from './components/ConfigPanel';
import SimulationPanel from './components/SimulationPanel';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-900 font-inter">
      <Sidebar />
      <main className="flex-1 relative bg-gray-50 flex flex-col h-full">
        <Toolbar />
        <WorkflowCanvas />
        <SimulationPanel />
      </main>
      <ConfigPanel />
    </div>
  );
}

export default App;
