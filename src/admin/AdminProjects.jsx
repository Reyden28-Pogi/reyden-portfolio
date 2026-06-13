import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const STATUS_OPTS = ["Completed", "In Progress", "Ongoing", "Planned"];
const EMPTY = { title: "", description: "", tags: "", status: "In Progress", link: "", featured: false };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setEditing("new"); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
      status: p.status || "In Progress",
      link: p.link || "",
      featured: p.featured || false,
    });
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title.trim()) { showMsg("Title is required.", "error"); return; }
    setSaving(true);
    const payload = { ...form };

    if (editing === "new") {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) showMsg("Failed to add project.", "error");
      else showMsg("Project added!");
    } else {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (error) showMsg("Failed to update project.", "error");
      else showMsg("Project updated!");
    }
    setSaving(false);
    setEditing(null);
    setForm(EMPTY);
    fetchProjects();
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) showMsg("Failed to delete.", "error");
    else { showMsg("Deleted!"); fetchProjects(); }
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Projects ({projects.length}) — Saved to Supabase ☁️</p>

        {loading ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : projects.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No projects yet. Add one below!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.2rem" }}>{p.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {p.status} · {p.featured ? "⭐ Featured" : "Not Featured"}
                  </p>
                  {p.tags && <p style={{ fontSize: "0.68rem", color: "var(--tangerine)", marginTop: "0.2rem" }}>{p.tags}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button onClick={() => openEdit(p)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => remove(p.id)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Project</button>
        {msg && (
          <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>
            {msg.type === "error" ? "✗" : "✗"} {msg.text}
          </span>
        )}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Project" : "Edit Project"}</p>

          <div className="admin-field">
            <label>Project Title</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Villahermosa B2B System" />
          </div>
          <div className="admin-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of the project..." />
          </div>
          <div className="admin-field">
            <label>Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="e.g. React, Laravel, MySQL" />
          </div>
          <div className="admin-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Live URL (optional)</label>
            <input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} style={{ marginRight: "0.5rem", accentColor: "var(--tangerine)" }} />
              Featured Project
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancel} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}