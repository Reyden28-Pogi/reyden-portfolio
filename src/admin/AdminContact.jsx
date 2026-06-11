import { useState } from "react";

export default function AdminContact({ data, update }) {
  const [form, setForm] = useState({ ...data.contact });
  const [heroForm, setHeroForm] = useState({
    email: data.hero.email,
    phone: data.hero.phone,
    location: data.hero.location,
    github: data.hero.github,
    linkedin: data.hero.linkedin,
    upwork: data.hero.upwork,
    indeed: data.hero.indeed,
    facebook: data.hero.facebook || "",
    twitter: data.hero.twitter || "",
    youtube: data.hero.youtube || "",
  });
  const [saved, setSaved] = useState(false);

  const saveAll = () => {
    update("contact", form);
    update("hero", { ...data.hero, ...heroForm });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (obj, setObj, key, label, placeholder = "", type = "text") => (
    <div className="admin-field">
      <label>{label}</label>
      <input type={type} value={obj[key]} onChange={(e) => setObj((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
    </div>
  );

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Contact Section Text</p>
        {field(form, setForm, "heading", "Section Heading")}
        {field(form, setForm, "subheading", "Subheading / Description")}
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Booking & Meetings</p>
        {field(form, setForm, "calendly", "Calendly Username", "e.g. reydenfajiculay")}
        {field(form, setForm, "zoom", "Zoom Meeting Link", "https://us05web.zoom.us/j/...")}
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Calendly link will be: https://calendly.com/<strong style={{ color: "var(--tangerine)" }}>{form.calendly}</strong>
        </p>
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Contact Details</p>
        {field(heroForm, setHeroForm, "email", "Email Address", "your@email.com", "email")}
        {field(heroForm, setHeroForm, "phone", "Phone Number", "09xxxxxxxxx")}
        {field(heroForm, setHeroForm, "location", "Location", "City, Province")}
        {field(form, setForm, "formspree", "Formspree ID (for contact form)", "xxxxxxxx")}
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Get your Formspree ID at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" style={{ color: "var(--tangerine)" }}>formspree.io</a> — paste only the ID, not the full URL.
        </p>
      </div>

      <div className="admin-card">
        <p className="admin-card__title">Social Media Links</p>
        {field(heroForm, setHeroForm, "github",   "GitHub URL")}
        {field(heroForm, setHeroForm, "linkedin", "LinkedIn URL")}
        {field(heroForm, setHeroForm, "upwork",   "Upwork URL")}
        {field(heroForm, setHeroForm, "indeed",   "Indeed URL")}
        {field(heroForm, setHeroForm, "facebook", "Facebook URL")}
        {field(heroForm, setHeroForm, "twitter",  "Twitter / X URL")}
        {field(heroForm, setHeroForm, "youtube",  "YouTube URL")}
      </div>

      <button className="admin-save-btn" onClick={saveAll}>Save All Changes</button>
      {saved && <span className="admin-saved-msg">✓ Saved!</span>}
    </div>
  );
}
