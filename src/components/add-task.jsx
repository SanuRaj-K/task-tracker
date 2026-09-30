import { useEffect, useRef, useState } from 'react';
import Icon from './icon';

export default function AddTask({ task, defaultCategory, onSave, onClose }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const [values, setValues] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || defaultCategory,
    priority: task?.priority || 'medium',
    completed: task?.completed || false,
  });
  const [error, setError] = useState('');
  useEffect(() => {
    dialogRef.current.showModal();
    titleRef.current.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'title') setError('');
  }
  function submit(event) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('Give your task a title to get started.');
      titleRef.current.focus();
      return;
    }
    onSave({ ...values, title: values.title.trim(), description: values.description.trim() });
  }
  return (
    <dialog
      ref={dialogRef}
      className="task-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <span className="dialog-icon">
          <Icon name={task ? 'edit' : 'plus'} size={24} />
        </span>
        <button className="icon-button" onClick={onClose} aria-label="Close task dialog">
          <Icon name="x" />
        </button>
      </div>
      <h2 id="dialog-title">{task ? 'A little fine-tuning.' : 'What’s on your mind?'}</h2>
      <p className="dialog-description">
        {task ? 'Make your task work for you.' : 'Big things begin with a small, clear next step.'}
      </p>
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="task-title">
            Task title <span>*</span>
          </label>
          <input
            ref={titleRef}
            id="task-title"
            name="title"
            placeholder="e.g. Prepare for my interview"
            value={values.title}
            onChange={handleChange}
            maxLength={160}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'title-error' : undefined}
          />
          {error && (
            <span className="field-error" id="title-error">
              {error}
            </span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="task-description">
            Description <span className="optional">optional</span>
          </label>
          <textarea
            id="task-description"
            name="description"
            placeholder="A few details to help you get started…"
            value={values.description}
            onChange={handleChange}
            maxLength={600}
            rows={3}
          />
        </div>
        <div className="form-columns">
          <div className="form-field">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Learning</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              name="priority"
              value={values.priority}
              onChange={handleChange}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
          </div>
        </div>
        <label className="completed-field">
          <input
            type="checkbox"
            name="completed"
            checked={values.completed}
            onChange={handleChange}
          />
          Already completed? Give yourself a little win.
        </label>
        <div className="dialog-footer">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Icon name={task ? 'check' : 'plus'} size={17} />
            {task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
