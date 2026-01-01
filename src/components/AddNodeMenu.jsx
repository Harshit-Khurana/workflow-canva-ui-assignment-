import { useEffect, useRef } from 'react';

function AddNodeMenu({ onSelect, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="node-menu" ref={menuRef}>
      <div className="menu-item" onClick={() => onSelect('action')}>
        <span className="menu-item-icon menu-item-icon-action">▶</span>
        <span>Action</span>
      </div>
      <div className="menu-item" onClick={() => onSelect('branch')}>
        <span className="menu-item-icon menu-item-icon-branch">◆</span>
        <span>Branch (If/Else)</span>
      </div>
      <div className="menu-item" onClick={() => onSelect('end')}>
        <span className="menu-item-icon menu-item-icon-end">■</span>
        <span>End</span>
      </div>
    </div>
  );
}

export default AddNodeMenu;
