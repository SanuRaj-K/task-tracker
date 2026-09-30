import Icon from './icon';

export default function DashboardIntro({ isLoading, onCreate }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE CLARITY FOR YOUR DAY</div>
          <h1>
            Make space for progress<span>.</span>
          </h1>
          <p>Your plans, priorities, and little wins. All in one place.</p>
        </div>
        <div className="date-chip">
          <Icon name="calendar" size={17} />
          {new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date())}
        </div>
      </div>
      <section className="welcome-banner" aria-labelledby="banner-title">
        <div className="banner-copy">
          <span className="banner-eyebrow">
            <span />
            YOUR DAY, A LITTLE MORE ORGANIZED
          </span>
          <h2 id="banner-title">
            Big ideas start with
            <br />
            one small task.
          </h2>
          <p>Clear your mind. Set your priorities. Find your flow.</p>
          <button className="banner-button" onClick={onCreate} disabled={isLoading}>
            Let’s make a plan <Icon name="arrow-right" size={17} />
          </button>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-spark spark-one">✦</span>
          <span className="art-spark spark-two">✦</span>
          <div className="art-card">
            <span className="art-card-top">
              <span className="art-mini-icon">
                <Icon name="check" size={15} />
              </span>
              <span>One thing at a time</span>
              <span className="art-menu">···</span>
            </span>
            <div className="art-line long" />
            <div className="art-line short" />
            <div className="art-card-bottom">
              <span className="art-tag">Making progress</span>
              <span className="art-avatars">
                <i>A</i>
                <i>You</i>
              </span>
            </div>
          </div>
          <span className="floating-check">
            <Icon name="check" size={30} />
          </span>
          <div className="floating-pill">
            <Icon name="sparkles" size={15} /> A little more done.
          </div>
        </div>
      </section>
    </>
  );
}
