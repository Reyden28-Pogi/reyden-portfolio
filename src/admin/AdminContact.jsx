import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const FIELDS = [
  { key: "heading",    label: "Section Heading" },
  { key: "subheading", label: "Subheading / Description" },
  { key: "email",      label: "Email Address",   type: "email" },
  { key: "phone",      label: "Phone Number" },
  { key: "location",   label: "Location" },
  { key: "calendly",   label: "Calendly Username", hint: "e.g. reydenfajiculay" },
  { key: "zoom",       label: "Zoom Meeting Link" },
  { key: "formspree",  label: "Formspree ID",     hint: "e.g. mpqejnwr" },
  { key: "github",     label: "GitHub URL" },
  { key: "linkedin",   label: "LinkedIn URL" },
  { key: "upwork",     label: "Upwork URL" },
  { key: "indeed",     label: "Indeed URL" },
  { key: "facebook",   label: "Facebook URL" },
  { key: "twitter",    label: "Twitter / X URL" },
  { key: "youtube",    label: "YouTube URL" },
];

const DEFAULT_FORM = {
  heading: "Let's Build Something",
  subheading: "Available for freelance projects and full-time opportunities.",
  email: "reydenfajiculay@gmail.com",
  phone: "09383569456",
  location: "Cawayan, San Agustin, Romblon",
  calendly: "reydenfajiculay",
  zoom: "https://us05web.zoom.us/j/7619091314?pwd=U1weSi8Hiwf4V5ZTbacjE2wHc4abzp.1",
  formspree: "mpqejnwr",
  github: "https://github.com/Reyden28-Pogi",
  linkedin: "https://www.linkedin.com/in/reyden-fajiculay-3a706a3b6/",
  upwork: "https://www.upwork.com/freelancers/~01c9536de872472b3e",
  indeed: "https://profile.indeed.com/?hl=en_PH&co=PH&from=gnav-jobseeker-profile--profile-one-frontend",
  facebook: "", twitter: "", youtube: "",
};

export default function AdminContact() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    supabase.from("contact_settings").select("*").limit(1).single()
      .then(({ data, error }) => {
        if (data) { setForm({ ...DEFAULT_FORM, ...data }); setRecordId(data.id); }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    delete payload.id;

    let error;
    if (recordId) {
      ({ error } = await supabase.from("contact_settings").update(payload).eq("id", recordId));
    } else {
      const { data, error: err } = await supabase.from("contact_settings").insert([payload]).select().single();
      if (data) setRecordId(data.id);
      error = err;
    }

    setSaving(false);
    if (error) showMsg("Failed to save.", "error");
    else showMsg("Saved successfully! ☁️");
  };

  if (loading) return <div className="admin-card"><p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading...</p></div>;

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Contact Section ☁️ Saved to Supabase</p>
        {FIELDS.slice(0, 2).map(({ key, label, type, hint }) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input type={type || "text"} value={form[key] || ""} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} />
            {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{hint}</p>}
          </div>
        ))}
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Contact Details</p>
        {FIELDS.slice(2, 5).map(({ key, label, type, hint }) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input type={type || "text"} value={form[key] || ""} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} />
            {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{hint}</p>}
          </div>
        ))}
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Booking & Meetings</p>
        {FIELDS.slice(5, 8).map(({ key, label, type, hint }) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input type={type || "text"} value={form[key] || ""} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} />
            {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{hint}</p>}
          </div>
        ))}
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Social Media Links</p>
        {FIELDS.slice(8).map(({ key, label }) => (
          <div key={key} className="admin-field">
            <label>{label}</label>
            <input value={form[key] || ""} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder="https://..." />
          </div>
        ))}
      </div>

      <button className="admin-save-btn" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save All Changes"}
      </button>
      {msg && (
        <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: msg.type === "error" ? "#ff8070" : "#9AB19A" }}>
          {msg.type === "error" ? "✗" : "✓"} {msg.text}
        </span>
      )}
    </div>
  );
}