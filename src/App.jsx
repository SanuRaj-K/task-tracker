import { useEffect, useRef, useState } from 'react';
import './App.css';
import './dark-theme.css';
import Icon from './components/icon';
import TaskCard from './components/task-card';
import AddTask from './components/add-task';
import TaskFilter from './components/task-filter';
import TaskSort from './components/task-sort';
import Sidebar from './components/sidebar';
import DashboardIntro from './components/dashboard-intro';
import TaskOverview from './components/task-overview';
import HelpDialog from './components/help-dialog';
import useTasks from './hooks/use-tasks';
import useTheme from './hooks/use-theme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    isLoading,
    error,
    storageError,
    retry,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
  } = useTasks();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [category, setCategory] = useState('all');
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const searchRef = useRef(null);
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const counts = { all: tasks.length, incomplete: pending, completed };
  const categoryTasks =
    category === 'all' ? tasks : tasks.filter((task) => task.category === category);
  const categoryCompleted = categoryTasks.filter((task) => task.completed).length;
  const filterCounts = {
    all: categoryTasks.length,
    incomplete: categoryTasks.length - categoryCompleted,
    completed: categoryCompleted,
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visibleTasks = categoryTasks
    .filter(
      (task) =>
        (filter === 'all' || (filter === 'completed' ? task.completed : !task.completed)) &&
        `${task.title} ${task.description || ''}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === 'alphabetical') return a.title.localeCompare(b.title);
      if (sort === 'completion') return Number(a.completed) - Number(b.completed);
      if (sort === 'priority') {
        const rank = { high: 0, medium: 1, low: 2 };
        return rank[a.priority] - rank[b.priority];
      }
      return 0;
    });

  function navigate(nextFilter) {
    setFilter(nextFilter);
    setCategory('all');
    setSearch('');
  }
  function handleSave(values) {
    if (dialog.task) {
      updateTask(dialog.task.id, values);
      setToast({ message: 'Task updated. Looking good!' });
    } else {
      addTask(values);
      navigate('all');
      setToast({ message: 'Task added. One step closer.' });
    }
    setDialog(null);
  }
  function handleDelete(task) {
    const index = tasks.findIndex((item) => item.id === task.id);
    deleteTask(task.id);
    setToast({ message: 'Task deleted.', deleted: task, index });
  }

  return (
    <div className="app-shell">
      <Sidebar
        tasks={tasks}
        counts={counts}
        filter={filter}
        category={category}
        onNavigate={navigate}
        onCategory={(name) => {
          setCategory(name);
          setFilter('all');
          setSearch('');
        }}
        onHelp={() => setHelpOpen(true)}
        onFocus={() => {
          navigate('incomplete');
          searchRef.current?.focus();
        }}
      />
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <Icon name="home" size={17} />
            <span>Workspace</span>
            <Icon name="chevron-right" size={14} />
            <strong>My tasks</strong>
          </div>
          <div className="topbar-right">
            <button
              type="button"
              className="theme-toggle"
              role="switch"
              aria-label="Dark mode"
              aria-checked={theme === 'dark'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
            >
              <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={17} />
              <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
            </button>
            <button
              className="icon-button"
              aria-label="Open help"
              onClick={() => setHelpOpen(true)}
            >
              <Icon name="help" size={18} />
            </button>
            <span className="local-label">
              <span />
              Personal workspace
            </span>
            <span className="avatar small">ME</span>
          </div>
        </header>
        <main className="main-content">
          <DashboardIntro isLoading={isLoading} onCreate={() => setDialog({ task: null })} />
          <TaskOverview counts={counts} progress={progress} isLoading={isLoading} />
          <section className="tasks-section" aria-labelledby="tasks-heading">
            <div className="section-heading">
              <div>
                <h2 id="tasks-heading">
                  {category !== 'all' ? `${category} tasks` : 'Your tasks'}
                  <span className="heading-count">{categoryTasks.length}</span>
                </h2>
                <p>A place for everything you want to get done.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setDialog({ task: null })}
                disabled={isLoading}
              >
                <Icon name="plus" size={18} />
                New task
              </button>
            </div>
            <div className="task-toolbar">
              <TaskFilter filter={filter} setFilter={setFilter} counts={filterCounts} />
              <select
                className="mobile-category-filter"
                aria-label="Filter by category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Learning</option>
              </select>
              <div className="toolbar-controls">
                <div className="search-field">
                  <Icon name="search" size={17} />
                  <input
                    ref={searchRef}
                    aria-label="Search tasks"
                    placeholder="Search tasks…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  {search ? (
                    <button aria-label="Clear search" onClick={() => setSearch('')}>
                      <Icon name="x" size={14} />
                    </button>
                  ) : (
                    <kbd>⌘ K</kbd>
                  )}
                </div>
                <TaskSort sort={sort} setSort={setSort} />
                <div className="view-switch" aria-label="Task layout">
                  <button
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    className={view === 'grid' ? 'selected' : ''}
                    onClick={() => setView('grid')}
                  >
                    <Icon name="grid" size={17} />
                  </button>
                  <button
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    className={view === 'list' ? 'selected' : ''}
                    onClick={() => setView('list')}
                  >
                    <Icon name="list" size={18} />
                  </button>
                </div>
              </div>
            </div>
            {storageError && (
              <div className="inline-warning" role="status">
                <Icon name="info" size={17} />
                Your browser couldn’t save changes. Tasks will stay available during this session.
              </div>
            )}
            {error ? (
              <div className="empty-state" role="alert">
                <span className="empty-icon">
                  <Icon name="cloud-off" size={28} />
                </span>
                <h3>We couldn’t load your tasks</h3>
                <p>Check your connection and try again, or start with a task of your own.</p>
                <div className="empty-actions">
                  <button className="secondary-button" onClick={retry}>
                    Try again
                  </button>
                  <button className="primary-button" onClick={() => setDialog({ task: null })}>
                    Create a task
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="task-grid skeleton-grid" aria-label="Loading tasks" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <div className="skeleton-card" key={index}>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <Icon name={filter === 'completed' ? 'circle-check' : 'search'} size={28} />
                </span>
                <h3>
                  {search
                    ? 'No matches just yet'
                    : filter === 'incomplete' && tasks.length
                      ? 'All caught up. Nicely done!'
                      : 'A little room for your next idea'}
                </h3>
                <p>
                  {search
                    ? 'Try another keyword or clear your filters.'
                    : 'Add a task, or explore another view of your list.'}
                </p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    if (search || filter !== 'all' || category !== 'all') navigate('all');
                    else setDialog({ task: null });
                  }}
                >
                  {search || filter !== 'all' || category !== 'all'
                    ? 'Show all tasks'
                    : 'Add your first task'}
                  <Icon name="arrow-right" size={16} />
                </button>
              </div>
            ) : (
              <div className={`task-grid ${view === 'list' ? 'list-view' : ''}`}>
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    data={task}
                    onToggle={() => updateTask(task.id, { completed: !task.completed })}
                    onEdit={() => setDialog({ task })}
                    onDelete={() => handleDelete(task)}
                  />
                ))}
              </div>
            )}
            {!isLoading && !error && (
              <div className="task-footer">
                <span>
                  Showing <strong>{visibleTasks.length}</strong> of{' '}
                  <strong>{categoryTasks.length}</strong> tasks
                </span>
                <span>
                  <Icon name="check" size={14} />
                  {storageError ? 'Changes kept for this session' : 'Saved on this device'}
                </span>
              </div>
            )}
          </section>
          <footer className="page-footer">
            <span>Made for a little more focus.</span>
            <span>
              One task at a time <Icon name="sparkles" size={14} />
            </span>
          </footer>
        </main>
      </div>
      {dialog && (
        <AddTask
          task={dialog.task}
          defaultCategory={category === 'all' ? 'Work' : category}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
      {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon">
            <Icon name="check" size={17} />
          </span>
          <span>{toast.message}</span>
          {toast.deleted && (
            <button
              onClick={() => {
                restoreTask(toast.deleted, toast.index);
                setToast({ message: 'Task restored.' });
              }}
            >
              Undo
            </button>
          )}
          <button
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
