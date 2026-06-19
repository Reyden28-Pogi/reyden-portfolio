import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminAbout() {
  const [form, setForm] = useState({
    headline: "",
    body: "",
    location: "",
    available: true,
    adjectives: "",
    years_coding: "3+",
    projects_built: "10+",
    tech_stacks: "5+",
  });
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    supabase.from("about_settings").select("*").limit(1).single()
      .then(({ data }) => {
        if (data) { setForm({ ...form, ...data }); setRecordId(data.id); }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    delete payload.id;

    let error;
    if (recordId) {
      ({ error } = await supabase.from("about_settings").update(payload).eq("id", recordId));
    } else {
      const { data, error: err } = await supabase.from("about_settings").insert([payload]).select().single();
      if (data) setRecordId(data.id);
      error = err;
    }

    setSaving(false);
    if (error) showMsg("Failed to save.", "error");
    else showMsg("Saved! ☁️");
  };

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  if (loading) return <div className="admin-card"><p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading...</p></div>;

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">About Section ☁️ Supabase</p>

        <div className="admin-field">
          <label>Headline</label>
          <input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Forward-Thinking. Bold. Visionary." />
        </div>

        <div className="admin-field">
          <label>Body Text (use blank line between paragraphs)</label>
          <textarea rows={8} value={form.body} onChange={(e) => set("body", e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Province" />
        </div>

        <div className="admin-field">
          <label>Available for Work?</label>
          <select value={form.available ? "yes" : "no"} onChange={(e) => set("available", e.target.value === "yes")}>
            <option value="yes">Yes — Open to Work</option>
            <option value="no">No — Not Available</option>
          </select>
        </div>

        <div className="admin-field">
          <label>Adjectives (comma-separated)</label>
          <input value={form.adjectives} onChange={(e) => set("adjectives", e.target.value)} placeholder="Forward-Thinking,Entrepreneurial,Bold,Surprising,Visionary" />
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Separate with commas — e.g. Bold,Visionary,Creative
          </p>
        </div>
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Stats</p>
        {[
          ["years_coding",   "Years Coding"],
          ["projects_built", "Projects Built"],
          ["tech_stacks",    "Tech Stacks"],
        ].map(([key, label]) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder="e.g. 3+" />
          </div>
        ))}
      </div>

      <button className="admin-save-btn" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {msg && (
        <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>
          {msg.type === "error" ? "✗" : "✓"} {msg.text}
        </span>
      )}
    </div>
  );
}