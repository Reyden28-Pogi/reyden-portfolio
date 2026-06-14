import { useEffect, useState } from "react";
import { getVisitStats } from "../hooks/usePortfolioData";
import { supabase } from "../lib/supabaseClient";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, history: [] });
  const [visitors, setVisitors] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(true);

  useEffect(() => {
    getVisitStats().then((s) => { setStats(s); setLoadingStats(false); });

    supabase
      .from("visitors")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setVisitors(data || []);
        setLoadingVisitors(false);
      });
  }, []);

  const history = [...stats.history].slice(-14);
  const maxCount = Math.max(...history.map((v) => v.count), 1);

  return (
    <div className="analytics">
      {/* Stat Cards */}
      <div className="analytics__stats">
        <StatCard label="Total Visits" value={loadingStats ? "..." : stats.total} icon="👁" />
        <StatCard label="Today" value={loadingStats ? "..." : stats.today} icon="📅" />
        <StatCard label="This Week" value={loadingStats ? "..." : stats.week} icon="📆" />
        <StatCard label="Named Visitors" value={loadingVisitors ? "..." : visitors.length} icon="👤" />
      </div>

      {/* Named Visitors */}
      <div className="admin-card">
        <p className="admin-card__title">👤 Named Visitors — Allowed Tracking</p>
        {loadingVisitors ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : visitors.length === 0 ? (
          <p className="analytics__empty">No named visitors yet — they'll appear here once someone allows tracking.</p>
        ) : (
          <table className="analytics__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td style={{ color: "var(--cream)", fontWeight: 600 }}>{v.name}</td>
                  <td>{new Date(v.visited_at).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td>{new Date(v.visited_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Visit Chart */}
      <div className="admin-card">
        <p className="admin-card__title">📊 Last 14 Days — Daily Visits</p>
        {loadingStats ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : history.length === 0 ? (
          <p className="analytics__empty">No visit data yet.</p>
        ) : (
          <div className="analytics__chart">
            {history.map((v) => (
              <div key={v.date} className="analytics__bar-wrap">
                <span className="analytics__bar-count">{v.count}</span>
                <div className="analytics__bar" style={{ height: `${(v.count / maxCount) * 100}%` }} />
                <span className="analytics__bar-date">
                  {new Date(v.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Log */}
      <div className="admin-card">
        <p className="admin-card__title">📋 Full Visit Log</p>
        {stats.history.length === 0 ? (
          <p className="analytics__empty">No visits logged yet.</p>
        ) : (
          <table className="analytics__table">
            <thead><tr><th>Date</th><th>Visits</th></tr></thead>
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