import { useState } from "react";

const CATEGORIES = ["Frontend", "Backend", "Database", "Automation", "Tools", "DevOps"];

const EMPTY_SKILL = { name: "", category: "Frontend", level: 80 };

export default function AdminSkills({ data, update }) {
  const [skills, setSkills] = useState(data.skills);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_SKILL);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setEditing("new"); setForm({ ...EMPTY_SKILL, id: Date.now() }); };
  const openEdit = (s) => { setEditing(s.id); setForm({ ...s }); };

  const save = () => {
    let next;
    if (editing === "new") {
      next = [...skills, form];
    } else {
      next = skills.map((s) => (s.id === editing ? form : s));
    }
    setSkills(next);
    update("skills", next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const remove = (id) => {
    const next = skills.filter((s) => s.id !== id);
    setSkills(next);
    update("skills", next);
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Skills</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr>
              {["Skill", "Category", "Level", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", padding: "0.5rem 0.6rem", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,248,204,0.05)" }}>
                <td style={{ padding: "0.65rem 0.6rem", color: "var(--cream)" }}>{s.name}</td>
                <td style={{ padding: "0.65rem 0.6rem", color: "var(--text-muted)" }}>{s.category}</td>
                <td style={{ padding: "0.65rem 0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 80, height: 3, background: "rgba(255,248,204,0.1)", borderRadius: 2 }}>
                      <div style={{ width: `${s.level}%`, height: "100%", background: "var(--tangerine)", borderRadius: 2 }} />
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{s.level}%</span>
                  </div>
                </td>
                <td style={{ padding: "0.65rem 0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={() => openEdit(s)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.2rem 0.6rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => remove(s.id)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.2rem 0.6rem", fontSize: "0.7rem", cursor: "pointer" }}>×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Skill</button>
        {saved && <span className="admin-saved-msg">✓ Saved!</span>}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add New Skill" : "Edit Skill"}</p>
          <div className="admin-field">
            <label>Skill Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. React / Vite" />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Proficiency Level ({form.level}%)</label>
            <input type="range" min={10} max={100} value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))} style={{ accentColor: "var(--tangerine)" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
