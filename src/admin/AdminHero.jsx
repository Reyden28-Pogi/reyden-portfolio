import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { uploadFile } from "../lib/supabaseStorage";

export default function AdminHero({ data, update }) {
  const [form, setForm] = useState(data.hero);
  const [saved, setSaved] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Load current profile photo
  useEffect(() => {
    const { data: urlData } = supabase.storage
      .from("profile")
      .getPublicUrl("profile-photo");
    if (urlData?.publicUrl) setPhotoPreview(urlData.publicUrl);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setUploading(true);

    // Upload profile photo if changed
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      await uploadFile(photoFile, "profile", `profile-photo`);
    }

    update("hero", form);
    setUploading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {/* Profile Photo Upload */}
      <div className="admin-card">
        <p className="admin-card__title">Profile Photo ☁️ Supabase Storage</p>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile"
              style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--tangerine)" }}
            />
          )}
          <div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "var(--bg3)", border: "1px dashed var(--border)", borderRadius: 2, cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <i className="bx bx-upload" style={{ fontSize: "1rem" }} />
              {photoFile ? photoFile.name : "Choose Photo"}
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
              Recommended: Square photo, at least 400x400px
            </p>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="admin-card">
        <p className="admin-card__title">Hero Content</p>
        {[
          ["name",    "Full Name"],
          ["role",    "Role / Position"],
          ["tagline", "Tagline"],
          ["email",   "Email", "email"],
          ["github",  "GitHub URL"],
          ["linkedin","LinkedIn URL"],
          ["upwork",  "Upwork URL"],
        ].map(([key, label, type]) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input
              type={type || "text"}
              value={form[key] || ""}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}
        <div className="admin-field">
          <label>Short Bio</label>
          <textarea rows={3} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} />
        </div>

        <button className="admin-save-btn" onClick={save} disabled={uploading}>
          {uploading ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="admin-saved-msg">✓ Saved!</span>}
      </div>
    </div>
  );
}