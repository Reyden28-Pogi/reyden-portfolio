import { useState } from "react";

const STATUS_OPTS = ["Completed", "In Progress", "Ongoing", "Planned"];
const EMPTY_PROJECT = { title: "", description: "", tags: [], status: "In Progress", link: "", featured: false };

export default function AdminProjects({ data, update }) {
  const [projects, setProjects] = useState(data.projects);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setEditing("new"); setForm({ ...EMPTY_PROJECT, id: Date.now() }); setTagInput(""); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setTagInput(""); };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm((p) => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (i) => setForm((p) => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  const save = () => {
    const next = editing === "new"
      ? [...projects, form]
      : projects.map((p) => (p.id === editing ? form : p));
    setProjects(next);
    update("projects", next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const remove = (id) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    update("projects", next);
  };

  const field = (key, label, type = "text", rows) => (
    <div className="admin-field">
      <label>{label}</label>
      {rows
        ? <textarea rows={rows} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
        : <input type={type} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
      }
    </div>
  );

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Projects ({projects.length})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {projects.map((p) => (
            <div key={p.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.2rem" }}>{p.title}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.status} · {p.featured ? "Featured" : "Not Featured"}</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button onClick={() => openEdit(p)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                <button onClick={() => remove(p.id)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Project</button>
        {saved && <span className="admin-saved-msg">✓ Saved!</span>}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Project" : "Edit Project"}</p>
          {field("title", "Project Title")}
          {field("description", "Description", "text", 3)}
          {field("link", "Live URL (optional)")}
          <div className="admin-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} style={{ marginRight: "0.5rem", accentColor: "var(--tangerine)" }} />
              Featured Project
            </label>
          </div>

          <div className="admin-field">
            <label>Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {form.tags.map((t, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "rgba(173,115,65,0.12)", border: "1px solid rgba(173,115,65,0.25)", color: "var(--tangerine)", padding: "0.2rem 0.6rem", borderRadius: 2, fontSize: "0.7rem" }}>
                  {t}
                  <button onClick={() => removeTag(i)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "0.5rem 0.8rem", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--cream)", flex: 1 }}
                placeholder="e.g. React"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button className="admin-save-btn" onClick={addTag}>Add</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
