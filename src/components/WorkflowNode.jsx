import { useState } from 'react';
import AddNodeMenu from './AddNodeMenu';

function WorkflowNode({ node, onAddNode, onDeleteNode, onEditNode, isRoot = false }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuBranchType, setMenuBranchType] = useState(null);

  const handleAddClick = (branchType = null) => {
    setMenuBranchType(branchType);
    setShowMenu(true);
  };

  const handleSelectNodeType = (type) => {
    onAddNode(node.id, type, menuBranchType);
    setShowMenu(false);
    setMenuBranchType(null);
  };

  const nodeClass = `node node-${node.type}`;

  const renderChildren = () => {
    if (node.type === 'end') return null;

    if (node.type === 'branch') {
      return (
        <div className="branch-container">
          <div className="branch-path">
            <div className="branch-line"></div>
            <span className="branch-label branch-label-true">True</span>
            {node.branches?.true ? (
              <WorkflowNode
                node={node.branches.true}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onEditNode={onEditNode}
              />
            ) : (
              <div className="empty-branch">
                <button className="add-node-btn" onClick={() => handleAddClick('true')}>
                  +
                </button>
                <span>Add step</span>
              </div>
            )}
          </div>
          <div className="branch-path">
            <div className="branch-line"></div>
            <span className="branch-label branch-label-false">False</span>
            {node.branches?.false ? (
              <WorkflowNode
                node={node.branches.false}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onEditNode={onEditNode}
              />
            ) : (
              <div className="empty-branch">
                <button className="add-node-btn" onClick={() => handleAddClick('false')}>
                  +
                </button>
                <span>Add step</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="connection-line"></div>
        {node.children && node.children.length > 0 ? (
          node.children.map((child) => (
            <WorkflowNode
              key={child.id}
              node={child}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
              onEditNode={onEditNode}
            />
          ))
        ) : (
          <div style={{ position: 'relative' }}>
            <button className="add-node-btn" onClick={() => handleAddClick()}>
              +
            </button>
            {showMenu && (
              <div className="menu-container" style={{ position: 'relative' }}>
                <AddNodeMenu
                    onSelect={handleSelectNodeType}
                    onClose={() => setShowMenu(false)}
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="node-wrapper">
      <div className={nodeClass}>
        <div className="node-type">{node.type}</div>
        <div className="node-header">
          <span className="node-label">{node.label}</span>
          <div className="node-actions">
            <button className="node-btn" onClick={() => onEditNode(node)} title="Edit">
              ✎
            </button>
            {!isRoot && (
              <button className="node-btn" onClick={() => onDeleteNode(node.id)} title="Delete">
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      
      {node.type === 'branch' && showMenu && (
        <div style={{ position: 'relative' }}>
          <AddNodeMenu
              onSelect={handleSelectNodeType}
              onClose={() => setShowMenu(false)}
          />
        </div>
      )}
      
      {renderChildren()}
    </div>
  );
}

export default WorkflowNode;
