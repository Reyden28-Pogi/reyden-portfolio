import "./About.css";

export default function About({ data }) {
  const a = data?.about || {};

  return (
    <section className="section about" id="about">
      <div className="container about__inner">
        <div className="about__left">
          <p className="section-label">About Me</p>
          <h2 className="section-title">{a.headline || "Forward-Thinking. Bold. Visionary."}</h2>
          <div className="divider" />
          {(a.body || "").split("\n\n").map((para, i) => (
            <p key={i} className="about__para">{para}</p>
          ))}

          <div className="about__meta">
            <div className="about__meta-item">
              <span className="about__meta-label">Location</span>
              <span className="about__meta-value">{a.location}</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-label">Status</span>
              <span className={`about__status ${a.available ? "about__status--open" : "about__status--closed"}`}>
                {a.available ? "Open to Work" : "Not Available"}
              </span>
            </div>
          </div>
        </div>

        <div className="about__right">
          <div className="about__card">
            <p className="about__card-label">Fascination Advantage</p>
            <p className="about__card-advantage">Innovation</p>
            <p className="about__card-sub">Your brand speaks the language of creativity</p>

            <div className="about__adjectives">
              {(a.adjectives || []).map((adj, i) => (
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
            <div className="about__stat">
              <span className="about__stat-num">3+</span>
              <span className="about__stat-label">Years Coding</span>
            </div>
            <div className="about__stat">
              <span className="about__stat-num">10+</span>
              <span className="about__stat-label">Projects Built</span>
            </div>
            <div className="about__stat">
              <span className="about__stat-num">5+</span>
              <span className="about__stat-label">Tech Stacks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
