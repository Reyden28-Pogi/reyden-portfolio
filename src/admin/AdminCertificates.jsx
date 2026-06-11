import { useState } from "react";

const EMPTY = { id: Date.now(), title: "", issuer: "", date: "", link: "" };

export default function AdminCertificates({ data, update }) {
  const [certs, setCerts] = useState(data.certificates || []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setEditing("new"); setForm({ ...EMPTY, id: Date.now() }); };
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c }); };

  const save = () => {
    const next = editing === "new" ? [...certs, form] : certs.map((c) => c.id === editing ? form : c);
    setCerts(next);
    update("certificates", next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const remove = (id) => {
    const next = certs.filter((c) => c.id !== id);
    setCerts(next);
    update("certificates", next);
  };

  const field = (key, label, placeholder = "") => (
    <div className="admin-field">
      <label>{label}</label>
      <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
    </div>
  );

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Certificates ({certs.length})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {certs.map((c) => (
            <div key={c.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.15rem" }}>{c.title || "Untitled"}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.issuer} {c.date && `· ${c.date}`}</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button onClick={() => openEdit(c)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                <button onClick={() => remove(c.id)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Certificate</button>
        {saved && <span className="admin-saved-msg">✓ Saved!</span>}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Certificate" : "Edit Certificate"}</p>
          {field("title", "Certificate Title", "e.g. React Developer Certification")}
          {field("issuer", "Issuing Organization", "e.g. freeCodeCamp")}
          {field("date", "Date", "e.g. 2024")}
          {field("link", "Canva / Google Drive / Credential Link", "https://...")}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
