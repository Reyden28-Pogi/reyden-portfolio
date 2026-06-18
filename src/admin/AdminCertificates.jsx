import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { uploadFile, deleteFile, getPathFromUrl } from "../lib/supabaseStorage";

const EMPTY = { title: "", issuer: "", date: "", link: "", image_url: "" };

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
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

  const fetchCerts = async () => {
    setLoading(true);
    const { data } = await supabase.from("certificates").select("*").order("id", { ascending: false });
    setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCerts(); }, []);

  const openAdd = () => { setEditing("new"); setForm(EMPTY); setImageFile(null); setImagePreview(null); };
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ title: c.title || "", issuer: c.issuer || "", date: c.date || "", link: c.link || "", image_url: c.image_url || "" });
    setImageFile(null);
    setImagePreview(c.image_url || null);
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

    // Upload image if new file selected
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `cert-${Date.now()}.${ext}`;
      const url = await uploadFile(imageFile, "certificates", path);
      if (url) image_url = url;
      else { showMsg("Image upload failed.", "error"); setSaving(false); return; }
    }

    const payload = { ...form, image_url };

    if (editing === "new") {
      const { error } = await supabase.from("certificates").insert([payload]);
      if (error) showMsg("Failed to add.", "error");
      else showMsg("Certificate added! ☁️");
    } else {
      const { error } = await supabase.from("certificates").update(payload).eq("id", editing);
      if (error) showMsg("Failed to update.", "error");
      else showMsg("Updated! ☁️");
    }

    setSaving(false);
    cancel();
    fetchCerts();
  };

  const remove = async (cert) => {
    if (!confirm("Delete this certificate?")) return;
    if (cert.image_url) {
      const path = getPathFromUrl(cert.image_url, "certificates");
      if (path) await deleteFile("certificates", path);
    }
    await supabase.from("certificates").delete().eq("id", cert.id);
    showMsg("Deleted!");
    fetchCerts();
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Certificates ({certs.length}) ☁️ Supabase</p>
        {loading ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading...</p>
        ) : certs.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No certificates yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {certs.map((c) => (
              <div key={c.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {c.image_url && <img src={c.image_url} alt={c.title} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />}
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.15rem" }}>{c.title}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button onClick={() => openEdit(c)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => remove(c)} style={{ background: "none", border: "1px solid rgba(255,100,80,0.2)", borderRadius: 2, color: "rgba(255,100,80,0.7)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="admin-save-btn" style={{ marginTop: "1rem" }} onClick={openAdd}>+ Add Certificate</button>
        {msg && <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>{msg.type === "error" ? "✗" : "✓"} {msg.text}</span>}
      </div>

      {editing !== null && (
        <div className="admin-card">
          <p className="admin-card__title">{editing === "new" ? "Add Certificate" : "Edit Certificate"}</p>

          {/* Image Upload */}
          <div className="admin-field">
            <label>Certificate Image</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />}
              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 1rem", background: "var(--bg3)", border: "1px dashed var(--border)", borderRadius: 2, cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <i className="bx bx-upload" style={{ fontSize: "1rem" }} />
                {imageFile ? imageFile.name : "Choose Image"}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          {[["title","Certificate Title","e.g. React Developer Certification"],["issuer","Issuing Organization","e.g. freeCodeCamp"],["date","Date","e.g. 2024"],["link","Canva / Drive / Credential Link (optional)","https://..."]].map(([key, label, ph]) => (
            <div key={key} className="admin-field">
              <label>{label}</label>
              <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} />
            </div>
          ))}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            <button onClick={cancel} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}