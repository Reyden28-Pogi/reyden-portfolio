import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./About.css";

export default function About() {
  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("about_settings").select("*").limit(1).single()
      .then(({ data }) => { if (data) setA(data); setLoading(false); });
  }, []);

  if (loading) return (
    <section className="section about" id="about">
      <div className="container" style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: "1.2rem", color: "var(--tangerine)" }} />
        Loading...
      </div>
    </section>
  );

  const adjectives = a?.adjectives ? a.adjectives.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <section className="section about" id="about">
      <div className="container about__inner">
        <div className="about__left">
          <p className="section-label">About Me</p>
          <h2 className="section-title">{a?.headline || "Forward-Thinking. Bold. Visionary."}</h2>
          <div className="divider" />
          {(a?.body || "").split("\n\n").map((para, i) => (
            <p key={i} className="about__para">{para}</p>
          ))}

          <div className="about__meta">
            <div className="about__meta-item">
              <span className="about__meta-label">
                <i className="bx bx-map-pin" /> Location
              </span>
              <span className="about__meta-value">{a?.location}</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-label">
                <i className="bx bx-briefcase" /> Status
              </span>
              <span className={`about__status ${a?.available ? "about__status--open" : "about__status--closed"}`}>
                <i className={`bx ${a?.available ? "bx-check-circle" : "bx-x-circle"}`} />
                {a?.available ? "Open to Work" : "Not Available"}
              </span>
            </div>
          </div>
        </div>

        <div className="about__right">
          <div className="about__card">
            <p className="about__card-label">
              <i className="bx bxs-star" /> Fascination Advantage
            </p>
            <p className="about__card-advantage">Innovation</p>
            <p className="about__card-sub">Your brand speaks the language of creativity</p>

            <div className="about__adjectives">
              {adjectives.map((adj, i) => (
                <span key={i} className="tag">{adj}</span>
              ))}
            </div>

            <div className="about__pillars">
              <p className="about__pillars-title">Core Pillars</p>
              <ul>
                <li>Invent surprising solutions</li>
                <li>Turn something old into something new</li>
                <li>Do the opposite</li>
                <li>Infuse a dose of vice</li>
              </ul>
            </div>
          </div>

          <div className="about__stats">
            {[
              { num: a?.years_coding || "3+",     label: "Years Coding",    icon: "bx-code-alt" },
              { num: a?.projects_built || "10+",  label: "Projects Built",  icon: "bx-folder-open" },
              { num: a?.tech_stacks || "5+",      label: "Tech Stacks",     icon: "bx-layer" },
            ].map((s, i) => (
              <div key={i} className="about__stat">
                <i className={`bx ${s.icon} about__stat-icon`} />
                <span className="about__stat-num">{s.num}</span>
                <span className="about__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}