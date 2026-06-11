import { useState } from "react";
import "./Projects.css";

const STATUS_COLORS = {
  Completed: { bg: "rgba(154,177,10,0.12)", color: "#9AB10A", border: "rgba(154,177,10,0.3)" },
  "In Progress": { bg: "rgba(173,115,65,0.12)", color: "var(--tangerine)", border: "rgba(173,115,65,0.3)" },
  Ongoing: { bg: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
};

export default function Projects({ data }) {
  const projects = data?.projects || [];
  const [filter, setFilter] = useState("All");

  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <p className="section-label">My Work</p>
        <h2 className="section-title">Projects</h2>
        <div className="divider" />

        <div className="projects__filters">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`projects__filter-btn ${filter === tag ? "projects__filter-btn--active" : ""}`}
              onClick={() => setFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="projects__featured">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="projects__grid">
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="projects__empty">No projects match this filter.</p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, featured }) {
  const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS["Ongoing"];

  return (
    <div className={`project-card ${featured ? "project-card--featured" : ""}`}>
      <div className="project-card__top">
        <div className="project-card__meta">
          <span
            className="project-card__status"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {project.status}
          </span>
          {featured && <span className="project-card__featured-badge">Featured</span>}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__link-icon"
            title="View project"
          >
            ↗
          </a>
        )}
      </div>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{project.description}</p>

      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}
