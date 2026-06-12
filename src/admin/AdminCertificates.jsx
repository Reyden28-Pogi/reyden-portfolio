import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const EMPTY = { title: "", issuer: "", date: "", link: "" };

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  // Fetch all certificates
  const fetchCerts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("id", { ascending: false });
    if (!error) setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCerts(); }, []);

  const openAdd = () => { setEditing("new"); setForm(EMPTY); };
  const openEdit = (c) => { setEditing(c.id); setForm({ title: c.title, issuer: c.issuer, date: c.date, link: c.link }); };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title.trim()) { showMsg("Title is required.", "error"); return; }
    setSaving(true);
    if (editing === "new") {
      const { error } = await supabase.from("certificates").insert([form]);
      if (error) { showMsg("Failed to add certificate.", "error"); }
      else { showMsg("Certificate added!"); }
    } else {
      const { error } = await supabase.from("certificates").update(form).eq("id", editing);
      if (error) { showMsg("Failed to update certificate.", "error"); }
      else { showMsg("Certificate updated!"); }
    }
    setSaving(false);
    setEditing(null);
    setForm(EMPTY);
    fetchCerts();
  };

  const remove = async (id) => {
    if (!confirm("Delete this certificate?")) return;
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) { showMsg("Failed to delete.", "error"); }
    else { showMsg("Deleted!"); fetchCerts(); }
  };

  const field = (key, label, placeholder = "") => (
    <div className="admin-field">
      <label>{label}</label>
      <input
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Certificates ({certs.length}) — Saved to Supabase ☁️</p>

        {loading ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : certs.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No certificates yet. Add one below!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {certs.map((c) => (
              <div key={c.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.15rem" }}>{c.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button onClick={() => openEdit(c)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => remove(c.id)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Certificate</button>

        {msg && (
          <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>
            {msg.type === "error" ? "✗" : "✓"} {msg.text}
          </span>
        )}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Certificate" : "Edit Certificate"}</p>
          {field("title", "Certificate Title", "e.g. React Developer Certification")}
          {field("issuer", "Issuing Organization", "e.g. freeCodeCamp")}
          {field("date", "Date", "e.g. 2024")}
          {field("link", "Canva / Google Drive / Credential Link", "https://...")}
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