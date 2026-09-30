import Icon from './icon';

export default function Sidebar({
  tasks,
  counts,
  filter,
  category,
  onNavigate,
  onCategory,
  onHelp,
  onFocus,
}) {
  const categories = ['Work', 'Personal', 'Learning'];
  const pending = counts.incomplete;
  const completed = counts.completed;
  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <a
        className="brand"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onNavigate('all');
        }}
      >
        <span className="brand-mark">
          <Icon name="brand" size={24} />
        </span>
        taskly<span className="brand-dot">.</span>
      </a>
      <div className="workspace-switch">
        <span className="workspace-avatar">M</span>
        <div>
          <strong>My workspace</strong>
          <span>Personal workspace</span>
        </div>
        <Icon name="chevrons" size={15} />
      </div>
      <span className="nav-label">WORKSPACE</span>
      <nav className="primary-nav">
        {[
          ['all', 'grid', 'All tasks', tasks.length],
          ['incomplete', 'clock', 'In progress', pending],
          ['completed', 'circle-check', 'Completed', completed],
        ].map(([value, icon, label, count]) => (
          <button
            key={value}
            className={`nav-item ${filter === value && category === 'all' ? 'active' : ''}`}
            onClick={() => onNavigate(value)}
            aria-label={label}
            aria-current={filter === value && category === 'all' ? 'page' : undefined}
          >
            <Icon name={icon} />
            <span>{label}</span>
            <span className="nav-count">{count}</span>
          </button>
        ))}
      </nav>
      <span className="nav-label category-label">MY CATEGORIES</span>
      <nav className="category-nav" aria-label="Task categories">
        {categories.map((name) => (
          <button
            key={name}
            className={`category-link ${category === name ? 'selected' : ''}`}
            onClick={() => {
              onCategory(name);
            }}
          >
            <span className={`category-dot ${name.toLowerCase()}`} />
            {name}
            <span>{tasks.filter((task) => task.category === name).length}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="focus-note">
          <span className="focus-icon">
            <Icon name="sparkles" size={19} />
          </span>
          <h3>Small steps. Big things.</h3>
          <p>A little focus every day goes a long way. You’ve got this.</p>
          <button
            onClick={() => {
              onFocus();
            }}
          >
            Find your next task <Icon name="arrow-right" size={15} />
          </button>
        </div>
        <button className="help-button" onClick={onHelp}>
          <Icon name="help" size={18} />A little help
        </button>
        <div className="sidebar-profile">
          <span className="avatar">ME</span>
          <div>
            <strong>Your personal space</strong>
            <span>Make room for what matters</span>
          </div>
          <span className="online-dot" />
        </div>
      </div>
    </aside>
  );
}
