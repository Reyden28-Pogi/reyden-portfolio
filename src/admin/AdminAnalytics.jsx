import { getVisitStats } from "../hooks/usePortfolioData";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const stats = getVisitStats();
  const history = [...stats.history].reverse().slice(0, 14);
  const maxCount = Math.max(...history.map((v) => v.count), 1);

  return (
    <div className="analytics">
      <div className="analytics__stats">
        <StatCard label="Total Visits" value={stats.total} icon="👁" />
        <StatCard label="Today" value={stats.today} icon="📅" />
        <StatCard label="This Week" value={stats.week} icon="📆" />
        <StatCard label="Days Tracked" value={stats.history.length} icon="📊" />
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Last 14 Days — Daily Visits</p>
        {history.length === 0 ? (
          <p className="analytics__empty">No visit data yet. Visits are tracked when someone opens your portfolio.</p>
        ) : (
          <div className="analytics__chart">
            {history.map((v) => (
              <div key={v.date} className="analytics__bar-wrap">
                <span className="analytics__bar-count">{v.count}</span>
                <div
                  className="analytics__bar"
                  style={{ height: `${(v.count / maxCount) * 100}%` }}
                />
                <span className="analytics__bar-date">
                  {new Date(v.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Visit Log</p>
        {stats.history.length === 0 ? (
          <p className="analytics__empty">No visits logged yet.</p>
        ) : (
          <table className="analytics__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {[...stats.history].reverse().map((v) => (
                <tr key={v.date}>
                  <td>{new Date(v.date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</td>
                  <td>{v.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="analytics__stat-card">
      <span className="analytics__stat-icon">{icon}</span>
      <span className="analytics__stat-value">{value}</span>
      <span className="analytics__stat-label">{label}</span>
    </div>
  );
}
