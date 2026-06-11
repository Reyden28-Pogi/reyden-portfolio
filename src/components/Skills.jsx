import { useEffect, useRef } from "react";
import "./Skills.css";

const CATEGORY_COLORS = {
  Frontend: "var(--tangerine)",
  Backend: "var(--celadon)",
  Database: "var(--tan)",
  Automation: "#c9a84c",
  Tools: "var(--text-muted)",
  DevOps: "#8fa3b1",
};

export default function Skills({ data }) {
  const skills = data?.skills || [];
  const categories = [...new Set(skills.map((s) => s.category))];
  const barRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("skills__bar--animate");
          }
        });
      },
      { threshold: 0.2 }
    );
    barRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [skills]);

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <p className="section-label">What I Work With</p>
        <h2 className="section-title">Skills & Stack</h2>
        <div className="divider" />

        <div className="skills__grid">
          {categories.map((cat) => (
            <div key={cat} className="skills__group">
              <p
                className="skills__cat-label"
                style={{ color: CATEGORY_COLORS[cat] || "var(--tangerine)" }}
              >
                {cat}
              </p>
              <div className="skills__list">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill, i) => (
                    <div key={skill.id} className="skills__item">
                      <div className="skills__item-header">
                        <span className="skills__name">{skill.name}</span>
                        <span className="skills__level">{skill.level}%</span>
                      </div>
                      <div className="skills__track">
                        <div
                          ref={(el) => barRefs.current.push(el)}
                          className="skills__bar"
                          style={{
                            "--target-width": `${skill.level}%`,
                            "--bar-color":
                              CATEGORY_COLORS[cat] || "var(--tangerine)",
                            animationDelay: `${i * 0.08}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="skills__tags-section">
          <p className="skills__tags-label">Also familiar with</p>
          <div className="skills__tags">
            {["REST APIs", "Webhooks", "Figma", "Vercel", "Cloudflare", "Linux", "Postman", "VS Code", "Formspree", "SheetJS"].map(
              (t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
