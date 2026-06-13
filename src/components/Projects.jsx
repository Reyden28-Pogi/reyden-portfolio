import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Projects.css";

const STATUS_COLORS = {
  Completed: { bg: "rgba(154,177,154,0.12)", color: "#9AB19A", border: "rgba(154,177,154,0.3)" },
  "In Progress": { bg: "rgba(223,152,65,0.12)", color: "var(--tangerine)", border: "rgba(223,152,65,0.3)" },
  Ongoing: { bg: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
  Planned: { bg: "rgba(140,140,160,0.12)", color: "#8c8ca0", border: "rgba(140,140,160,0.3)" },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });
      if (!error) setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Parse tags — stored as comma-separated string in Supabase
  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  };

  const allTags = ["All", ...new Set(projects.flatMap((p) => parseTags(p.tags)))];
  const filtered = filter === "All" ? projects : projects.filter((p) => parseTags(p.tags).includes(filter));
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <p className="section-label">My Work</p>
        <h2 className="section-title">Projects</h2>
        <div className="divider" />

        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading projects...</p>
        ) : (
          <>
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
                {featured.map((p) => (
                  <ProjectCard key={p.id} project={p} parseTags={parseTags} featured />
                ))}
              </div>
            )}

            {rest.length > 0 && (
              <div className="projects__grid">
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} parseTags={parseTags} />
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <p className="projects__empty">No projects match this filter.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, parseTags, featured }) {
  const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS["Ongoing"];
  const tags = parseTags(project.tags);

  return (
    <div className={`project-card ${featured ? "project-card--featured" : ""}`}>
      <div className="project-card__top">
        <div className="project-card__meta">
          <span className="project-card__status" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
            {project.status}
          </span>
          {featured && <span className="project-card__featured-badge">Featured</span>}
        </div>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card__link-icon">↗</a>
        )}
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{project.description}</p>
      <div className="project-card__tags">
        {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </div>
  );
}