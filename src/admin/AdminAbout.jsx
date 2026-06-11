import { useState } from "react";

export default function AdminAbout({ data, update }) {
  const [form, setForm] = useState(data.about);
  const [saved, setSaved] = useState(false);
  const [adjInput, setAdjInput] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addAdj = () => {
    if (adjInput.trim()) {
      set("adjectives", [...form.adjectives, adjInput.trim()]);
      setAdjInput("");
    }
  };

  const removeAdj = (i) => {
    set("adjectives", form.adjectives.filter((_, idx) => idx !== i));
  };

  const save = () => {
    update("about", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">About Section</p>
        <div className="admin-field">
          <label>Headline</label>
          <input value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Body Text (use blank line for paragraphs)</label>
          <textarea rows={6} value={form.body} onChange={(e) => set("body", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Available for Work?</label>
          <select value={form.available ? "yes" : "no"} onChange={(e) => set("available", e.target.value === "yes")}>
            <option value="yes">Yes — Open to Work</option>
            <option value="no">No — Not Available</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Adjectives / Descriptors</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          {form.adjectives.map((adj, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(173,115,65,0.15)", border: "1px solid rgba(173,115,65,0.3)", color: "var(--tangerine)", padding: "0.25rem 0.75rem", borderRadius: "2px", fontSize: "0.75rem", fontWeight: 600 }}>
              {adj}
              <button onClick={() => removeAdj(i)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "0.8rem", lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="admin-field input"
            style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "2px", padding: "0.55rem 0.9rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--cream)", flex: 1 }}
            placeholder="Add adjective..."
            value={adjInput}
            onChange={(e) => setAdjInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAdj()}
          />
          <button className="admin-save-btn" onClick={addAdj}>Add</button>
        </div>
      </div>

      <button className="admin-save-btn" onClick={save}>Save Changes</button>
      {saved && <span className="admin-saved-msg">✓ Saved!</span>}
    </div>
  );
}
