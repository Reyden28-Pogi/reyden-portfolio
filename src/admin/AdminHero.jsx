import { useState } from "react";

export default function AdminHero({ data, update }) {
  const [form, setForm] = useState(data.hero);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const save = () => {
    update("hero", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Hero / Header Content</p>
        <div className="admin-field">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Role / Position</label>
          <input value={form.role} onChange={(e) => set("role", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Tagline</label>
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Short Bio</label>
          <textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>GitHub URL</label>
          <input value={form.github} onChange={(e) => set("github", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>LinkedIn URL</label>
          <input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
        </div>
        <button className="admin-save-btn" onClick={save}>Save Changes</button>
        {saved && <span className="admin-saved-msg">✓ Saved!</span>}
      </div>
    </div>
  );
}
