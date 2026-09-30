import Icon from './icon';

export default function TaskCard({ data, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-card ${data.completed ? 'is-completed' : ''}`}>
      <div className="card-top">
        <span className="card-category">
          <span className={`category-dot ${data.category.toLowerCase()}`} />
          {data.category}
        </span>
        <span className={`priority-badge ${data.priority}`}>
          <span />
          {data.priority[0].toUpperCase() + data.priority.slice(1)} priority
        </span>
      </div>
      <div className="card-body">
        <h3 className=' '>{data.title}</h3>
        {data.description && <p>{data.description}</p>}
      </div>
      <div className="card-meta">
        <span className="task-reference">
          TASK-{String(data.id).slice(0, 4).padStart(3, '0').toUpperCase()}
        </span>
        <span className="assignee" title={`User ${data.userId}`}>
          <Icon name="user" size={12} />
          <span>User {data.userId}</span>
        </span>
      </div>
      <div className="card-footer">
        <label className={`task-status ${data.completed ? 'done' : ''}`}>
          <input
            type="checkbox"
            checked={data.completed}
            onChange={onToggle}
            aria-label={`Mark ${data.title} as ${data.completed ? 'incomplete' : 'completed'}`}
          />
          <span className="custom-checkbox">
            <Icon name="check" size={12} />
          </span>
          <span>{data.completed ? 'Completed' : 'In progress'}</span>
        </label>
        <div className="card-actions">
          <button
            className="icon-button"
            onClick={onEdit}
            aria-label={`Edit ${data.title}`}
            title="Edit task"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={onDelete}
            aria-label={`Delete ${data.title}`}
            title="Delete task"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
