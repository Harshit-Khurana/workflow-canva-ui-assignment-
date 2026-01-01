import { useState } from 'react';

function EditModal({ node, onSave, onClose }) {
  const [label, setLabel] = useState(node.label);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (label.trim()) {
      onSave(node.id, label.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Node</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nodeLabel">Node Label</label>
            <input
              id="nodeLabel"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
