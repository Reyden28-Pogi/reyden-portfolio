import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = ["Frontend", "Backend", "Database", "Automation", "Tools", "DevOps"];
const EMPTY = { name: "", category: "Frontend", level: 80 };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true });
    if (!error) setSkills(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => { setEditing("new"); setForm(EMPTY); };
  const openEdit = (s) => { setEditing(s.id); setForm({ name: s.name, category: s.category, level: s.level }); };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.name.trim()) { showMsg("Skill name is required.", "error"); return; }
    setSaving(true);
    if (editing === "new") {
      const { error } = await supabase.from("skills").insert([form]);
      if (error) showMsg("Failed to add skill.", "error");
      else showMsg("Skill added!");
    } else {
      const { error } = await supabase.from("skills").update(form).eq("id", editing);
      if (error) showMsg("Failed to update skill.", "error");
      else showMsg("Skill updated!");
    }
    setSaving(false);
    setEditing(null);
    setForm(EMPTY);
    fetchSkills();
  };

  const remove = async (id) => {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) showMsg("Failed to delete.", "error");
    else { showMsg("Deleted!"); fetchSkills(); }
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Skills ({skills.length}) — Saved to Supabase ☁️</p>

        {loading ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : skills.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No skills yet. Add one below!</p>
        ) : (
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
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,248,221,0.05)" }}>
                  <td style={{ padding: "0.65rem 0.6rem", color: "var(--cream)" }}>{s.name}</td>
                  <td style={{ padding: "0.65rem 0.6rem", color: "var(--text-muted)" }}>{s.category}</td>
                  <td style={{ padding: "0.65rem 0.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 80, height: 3, background: "rgba(255,248,221,0.1)", borderRadius: 2 }}>
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
        )}

        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Skill</button>
        {msg && (
          <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>
            {msg.type === "error" ? "✗" : "✓"} {msg.text}
          </span>
        )}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Skill" : "Edit Skill"}</p>
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
            <input
              type="range"
              min={10}
              max={100}
              value={form.level}
              onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))}
              style={{ accentColor: "var(--tangerine)", width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
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