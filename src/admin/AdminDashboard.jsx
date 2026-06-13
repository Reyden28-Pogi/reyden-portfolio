import { useState } from "react";
import AdminAnalytics from "./AdminAnalytics";
import AdminHero from "./AdminHero";
import AdminAbout from "./AdminAbout";
import AdminSkills from "./AdminSkills";
import AdminProjects from "./AdminProjects";
import AdminCertificates from "./AdminCertificates";
import AdminPricing from "./AdminPricing";
import AdminContact from "./AdminContact";
import "./AdminDashboard.css";

const NAV = [
  { id: "analytics",    label: "Analytics",    icon: "📊" },
  { id: "hero",         label: "Hero / Header", icon: "🏠" },
  { id: "about",        label: "About",         icon: "👤" },
  { id: "projects",     label: "Portfolio",     icon: "🗂" },
  { id: "certificates", label: "Certificates",  icon: "🏆" },
  { id: "skills",       label: "Skills",        icon: "⚡" },
  { id: "pricing",      label: "Pricing",       icon: "💰" },
  { id: "contact",      label: "Contact",       icon: "✉" },
];

export default function AdminDashboard({ data, update, onLogout }) {
  const [active, setActive] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPanel = () => {
    switch (active) {
      case "analytics":    return <AdminAnalytics />;
      case "hero":         return <AdminHero data={data} update={update} />;
      case "about":        return <AdminAbout data={data} update={update} />;
      case "skills":       return <AdminSkills data={data} update={update} />;
      case "projects":     return <AdminProjects data={data} update={update} />;
      case "certificates": return <AdminCertificates data={data} update={update} />;
      case "pricing":      return <AdminPricing data={data} update={update} />;
      case "contact":      return <AdminContact data={data} update={update} />;
      default: return null;
    }
  };

  return (
    <div className="admin-dash">
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__name">Reyden<span>.</span></span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <button key={item.id} className={`admin-sidebar__link ${active === item.id ? "admin-sidebar__link--active" : ""}`} onClick={() => { setActive(item.id); setSidebarOpen(false); }}>
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__view-btn">View Portfolio ↗</a>
          <button onClick={onLogout} className="admin-sidebar__logout">Log Out</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__burger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="admin-topbar__title">
            {NAV.find((n) => n.id === active)?.icon}{" "}
            {NAV.find((n) => n.id === active)?.label}
          </h1>
        </header>
        <div className="admin-panel">{renderPanel()}</div>
      </main>
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
