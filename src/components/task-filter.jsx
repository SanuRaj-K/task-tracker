export default function TaskFilter({ filter, setFilter, counts }) {
  return (
    <div className="filter-tabs" aria-label="Filter tasks">
      {[
        ['all', 'All tasks'],
        ['incomplete', 'In progress'],
        ['completed', 'Completed'],
      ].map(([value, label]) => (
        <button
          key={value}
          className={filter === value ? 'active' : ''}
          aria-pressed={filter === value}
          onClick={() => setFilter(value)}
        >
          {label}
          <span>{counts[value]}</span>
        </button>
      ))}
    </div>
  );
}
