import { useState } from 'react';
import WorkflowCanvas from './components/WorkflowCanvas';
import EditModal from './components/EditModal';
import './index.css';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialWorkflow = {
  id: 'start',
  type: 'start',
  label: 'Start',
  children: []
};

function App() {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [editingNode, setEditingNode] = useState(null);
  const [history, setHistory] = useState([initialWorkflow]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = (newWorkflow) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newWorkflow)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setWorkflow(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setWorkflow(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const findAndUpdateNode = (node, targetId, updateFn) => {
    if (node.id === targetId) {
      return updateFn(node);
    }
    
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => findAndUpdateNode(child, targetId, updateFn))
      };
    }
    
    if (node.branches) {
      return {
        ...node,
        branches: {
          true: node.branches.true ? findAndUpdateNode(node.branches.true, targetId, updateFn) : null,
          false: node.branches.false ? findAndUpdateNode(node.branches.false, targetId, updateFn) : null
        }
      };
    }
    
    return node;
  };

  const addNode = (parentId, nodeType, branchType = null) => {
    const newNode = {
      id: generateId(),
      type: nodeType,
      label: nodeType === 'action' ? 'New Action' : nodeType === 'branch' ? 'New Condition' : 'End',
      ...(nodeType === 'action' ? { children: [] } : {}),
      ...(nodeType === 'branch' ? { branches: { true: null, false: null } } : {})
    };

    const newWorkflow = findAndUpdateNode(workflow, parentId, (node) => {
      if (node.type === 'branch' && branchType !== null) {
        return {
          ...node,
          branches: {
            ...node.branches,
            [branchType]: newNode
          }
        };
      }
      
      if (node.children !== undefined) {
        const existingChild = node.children[0];
        if (existingChild && nodeType !== 'end') {
          newNode.children = [existingChild];
        }
        return {
          ...node,
          children: [newNode]
        };
      }
      
      return node;
    });

    setWorkflow(newWorkflow);
    saveToHistory(newWorkflow);
  };

  const deleteNode = (nodeId) => {
    const deleteAndReconnect = (node) => {
      if (node.children) {
        const childIndex = node.children.findIndex(c => c.id === nodeId);
        if (childIndex !== -1) {
          const deletedNode = node.children[childIndex];
          let replacement = [];
          
          if (deletedNode.children && deletedNode.children.length > 0) {
            replacement = deletedNode.children;
          }
          
          return {
            ...node,
            children: [...node.children.slice(0, childIndex), ...replacement, ...node.children.slice(childIndex + 1)]
          };
        }
        
        return {
          ...node,
          children: node.children.map(child => deleteAndReconnect(child))
        };
      }
      
      if (node.branches) {
        let newBranches = { ...node.branches };
        
        if (node.branches.true && node.branches.true.id === nodeId) {
          const deletedNode = node.branches.true;
          newBranches.true = deletedNode.children ? deletedNode.children[0] : null;
        } else if (node.branches.true) {
          newBranches.true = deleteAndReconnect(node.branches.true);
        }
        
        if (node.branches.false && node.branches.false.id === nodeId) {
          const deletedNode = node.branches.false;
          newBranches.false = deletedNode.children ? deletedNode.children[0] : null;
        } else if (node.branches.false) {
          newBranches.false = deleteAndReconnect(node.branches.false);
        }
        
        return { ...node, branches: newBranches };
      }
      
      return node;
    };

    const newWorkflow = deleteAndReconnect(workflow);
    setWorkflow(newWorkflow);
    saveToHistory(newWorkflow);
  };

  const updateNodeLabel = (nodeId, newLabel) => {
    const newWorkflow = findAndUpdateNode(workflow, nodeId, (node) => ({
      ...node,
      label: newLabel
    }));
    setWorkflow(newWorkflow);
    saveToHistory(newWorkflow);
    setEditingNode(null);
  };

  const saveWorkflow = () => {
    console.log('Workflow Data Structure:');
    console.log(JSON.stringify(workflow, null, 2));
    alert('Workflow saved to console! Open browser DevTools to view.');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Workflow Builder</h1>
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={undo}
            disabled={historyIndex === 0}
          >
            ↩ Undo
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={redo}
            disabled={historyIndex === history.length - 1}
          >
            Redo ↪
          </button>
          <button className="btn btn-primary" onClick={saveWorkflow}>
            💾 Save
          </button>
        </div>
      </header>

      <div className="canvas-container">
        <WorkflowCanvas
          workflow={workflow}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onEditNode={setEditingNode}
        />
      </div>

      {editingNode && (
        <EditModal
          node={editingNode}
          onSave={updateNodeLabel}
          onClose={() => setEditingNode(null)}
        />
      )}
    </div>
  );
}

export default App;
