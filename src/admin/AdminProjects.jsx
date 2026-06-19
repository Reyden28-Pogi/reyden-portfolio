import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { uploadFile, deleteFile, getPathFromUrl } from "../lib/supabaseStorage";

const STATUS_OPTS = ["Completed", "In Progress", "Ongoing", "Planned"];
const EMPTY = { title: "", description: "", tags: "", status: "In Progress", link: "", featured: false, image_url: "" };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("id", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing("new");
    setForm(EMPTY);
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title || "", description: p.description || "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
      status: p.status || "In Progress", link: p.link || "",
      featured: p.featured || false, image_url: p.image_url || "",
    });
    setImageFile(null);
    setImagePreview(p.image_url || null);
  };

  const cancel = () => { setEditing(null); setForm(EMPTY); setImageFile(null); setImagePreview(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const save = async () => {
    if (!form.title.trim()) { showMsg("Title is required.", "error"); return; }
    setSaving(true);

    let image_url = form.image_url;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `project-${Date.now()}.${ext}`;
      const url = await uploadFile(imageFile, "projects", path);
      if (url) image_url = url;
      else { showMsg("Image upload failed.", "error"); setSaving(false); return; }
    }

    const payload = { ...form, image_url };

    if (editing === "new") {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) showMsg("Failed to add.", "error");
      else showMsg("Project added! ☁️");
    } else {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (error) showMsg("Failed to update.", "error");
      else showMsg("Updated! ☁️");
    }

    setSaving(false);
    cancel();
    fetchProjects();
  };

  const remove = async (project) => {
    if (!confirm("Delete this project?")) return;
    if (project.image_url) {
      const path = getPathFromUrl(project.image_url, "projects");
      if (path) await deleteFile("projects", path);
    }
    await supabase.from("projects").delete().eq("id", project.id);
    showMsg("Deleted!");
    fetchProjects();
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Projects ({projects.length}) ☁️ Supabase</p>

        {loading ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : projects.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No projects yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)", flexShrink: 0 }} />
                    : <div style={{ width: 56, height: 40, background: "var(--bg)", borderRadius: 4, border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="bx bx-image" style={{ color: "var(--text-muted)", fontSize: "1.1rem" }} /></div>
                  }
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.15rem" }}>{p.title}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {p.status} · {p.featured ? "⭐ Featured" : "Not Featured"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button onClick={() => openEdit(p)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => remove(p)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Project</button>
        {msg && <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>{msg.type === "error" ? "✗" : "✓"} {msg.text}</span>}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Project" : "Edit Project"}</p>

          {/* Image Upload */}
          <div className="admin-field">
            <label>Project Screenshot / Image (Optional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {imagePreview && (
                <img src={imagePreview} alt="preview" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />
              )}
              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 1rem", background: "var(--bg3)", border: "1px dashed var(--border)", borderRadius: 2, cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <i className="bx bx-upload" style={{ fontSize: "1rem" }} />
                {imageFile ? imageFile.name : "Choose Image"}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
              {imagePreview && (
                <button onClick={() => { setImageFile(null); setImagePreview(null); setForm(p => ({ ...p, image_url: "" })); }}
                  style={{ background: "none", border: "1px solid rgba(255,100,80,0.3)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.4rem 0.75rem", fontSize: "0.72rem", cursor: "pointer" }}>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          {[["title","Project Title","e.g. Villahermosa B2B System"],["description","Description","Brief description...",true],["tags","Tags (comma-separated)","e.g. React, Laravel, MySQL"],["link","Live URL (optional)","https://..."]].map(([key, label, ph, isTextarea]) => (
            <div key={key} className="admin-field">
              <label>{label}</label>
              {isTextarea
                ? <textarea rows={3} value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} />
                : <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} />
              }
            </div>
          ))}

          <div className="admin-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ marginRight: "0.5rem", accentColor: "var(--tangerine)" }} />
              Featured Project
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            <button onClick={cancel} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}