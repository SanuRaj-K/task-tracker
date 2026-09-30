import Icon from './icon';

export default function TaskOverview({ counts, progress, isLoading }) {
  const pending = counts.incomplete;
  const completed = counts.completed;
  return (
    <section className="stats-grid" aria-label="Task overview">
      {[
        ['Total tasks', counts.all, 'Everything on your list', 'layers', 'purple'],
        ['In progress', pending, 'A little closer every day', 'clock', 'orange'],
        ['Completed', completed, 'Look at you go!', 'circle-check', 'green'],
      ].map(([label, value, caption, icon, color]) => (
        <div className="stat-card" key={label}>
          <div className="stat-top">
            <span>{label}</span>
            <span className={`stat-icon ${color}`}>
              <Icon name={icon} size={19} />
            </span>
          </div>
          <strong className="stat-value">{isLoading ? '—' : String(value).padStart(2, '0')}</strong>
          <span className="stat-caption">{caption}</span>
        </div>
      ))}
      <div className="stat-card progress-card">
        <div className="stat-top">
          <span>Your progress</span>
          <span className="stat-icon purple">
            <Icon name="chart" size={19} />
          </span>
        </div>
        <div className="progress-value">
          <strong className="stat-value">
            {progress}
            <span>%</span>
          </strong>
          <span className="progress-caption">Keep it going</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Completed tasks"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
