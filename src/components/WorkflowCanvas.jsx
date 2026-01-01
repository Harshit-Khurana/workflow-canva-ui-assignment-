import WorkflowNode from './WorkflowNode';

function WorkflowCanvas({ workflow, onAddNode, onDeleteNode, onEditNode }) {
  return (
    <div className="workflow-canvas">
      <WorkflowNode
        node={workflow}
        onAddNode={onAddNode}
        onDeleteNode={onDeleteNode}
        onEditNode={onEditNode}
        isRoot={true}
      />
    </div>
  );
}

export default WorkflowCanvas;
