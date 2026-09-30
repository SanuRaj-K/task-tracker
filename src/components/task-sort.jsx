import Icon from './icon';

export default function TaskSort({ sort, setSort }) {
  return (
    <div className="sort-control">
      <Icon name="sort" size={16} />
      <select
        aria-label="Sort tasks"
        value={sort}
        onChange={(event) => setSort(event.target.value)}
      >
        <option value="default">Default order</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="completion">Status</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}
