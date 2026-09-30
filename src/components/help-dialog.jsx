import { useEffect, useRef } from 'react';
import Icon from './icon';

export default function HelpDialog({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="task-dialog help-dialog"
      aria-labelledby="help-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <span className="dialog-icon">
          <Icon name="sparkles" size={24} />
        </span>
        <button className="icon-button" aria-label="Close help" onClick={onClose}>
          <Icon name="x" />
        </button>
      </div>
      <h2 id="help-title">A little help finding your flow.</h2>
      <p className="dialog-description">
        Add a task, choose a category and priority, then check it off when you’re done. Use the
        pencil to edit a task and the bin to delete it. You can undo a deletion from the
        notification.
      </p>
      <div className="help-tip">
        <Icon name="search" size={20} />
        <p>
          Press <kbd>Ctrl / ⌘ + K</kbd> to jump to search.
        </p>
      </div>
      <div className="help-tip">
        <Icon name="info" size={20} />
        <p>
          Tasks start from JSONPlaceholder and are saved in this browser. They aren’t synced across
          devices.
        </p>
      </div>
      <button className="primary-button" onClick={onClose}>
        Got it <Icon name="check" size={17} />
      </button>
    </dialog>
  );
}
