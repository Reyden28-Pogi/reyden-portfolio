import { useState } from "react";
import "./Contact.css";

const SOCIAL_CONFIG = [
  { key: "github",   label: "GitHub",   icon: "GH" },
  { key: "linkedin", label: "LinkedIn", icon: "IN" },
  { key: "upwork",   label: "Upwork",   icon: "UP" },
  { key: "indeed",   label: "Indeed",   icon: "ID" },
  { key: "facebook", label: "Facebook", icon: "FB" },
  { key: "twitter",  label: "Twitter",  icon: "TW" },
  { key: "youtube",  label: "YouTube",  icon: "YT" },
];

export default function Contact({ data }) {
  const c = data?.contact || {};
  const h = data?.hero || {};
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!c.formspree) { setStatus("success"); return; }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${c.formspree}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const socials = SOCIAL_CONFIG.filter((s) => h[s.key]);

  return (
    <section className="section contact" id="contact">
      <div className="container contact__inner">

        {/* Left col */}
        <div className="contact__left">
          <p className="section-label">Work With Me</p>
          <h2 className="section-title">{c.heading || "Let's Build Something"}</h2>
          <div className="divider" />
          <p className="contact__sub">{c.subheading}</p>

          {/* Quick contact info */}
          <div className="contact__info-list">
            <a href={`mailto:${c.email}`} className="contact__info-item">
              <span className="contact__info-icon">✉</span>
              <span>{c.email}</span>
            </a>
            {c.phone && (
              <a href={`tel:${c.phone}`} className="contact__info-item">
                <span className="contact__info-icon">📞</span>
                <span>{c.phone}</span>
              </a>
            )}
            {h.location && (
              <div className="contact__info-item">
                <span className="contact__info-icon">📍</span>
                <span>{h.location}</span>
              </div>
            )}
          </div>

          {/* Booking buttons */}
          <div className="contact__booking">
            <p className="contact__booking-label">Schedule a Meeting</p>
            <div className="contact__booking-btns">
              {c.calendly && (
                <a
                  href={`https://calendly.com/${c.calendly}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  📅 Book via Calendly
                </a>
              )}
              {c.zoom && (
                <a
                  href={c.zoom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  🎥 Join Zoom Call
                </a>
              )}
            </div>
          </div>

          {/* Social links */}
          {socials.length > 0 && (
            <div className="contact__socials">
              <p className="contact__socials-label">Find Me Online</p>
              <div className="contact__socials-grid">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={h[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-pill"
                  >
                    <span className="contact__social-icon">{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right col - form */}
        <div className="contact__right">
          <div className="contact__form-wrap">
            <p className="contact__form-title">Send a Message</p>
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__field">
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div className="contact__field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="contact__field">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} required />
              </div>
              <button type="submit" className="btn btn-primary contact__submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
              {status === "success" && <p className="contact__feedback contact__feedback--success">✓ Message sent! I'll get back to you soon.</p>}
              {status === "error" && <p className="contact__feedback contact__feedback--error">Something went wrong. Please email directly.</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="contact__footer">
        <div className="container contact__footer-inner">
          <p className="contact__footer-name">Reyden Fajiculay<span>.</span></p>
          <p className="contact__footer-tagline">"Turning Innovation into Advantage"</p>
          <p className="contact__footer-copy">© {new Date().getFullYear()} Quiverto Solutions · Built with React + Vite · Deployed on Vercel</p>
        </div>
      </div>
    </section>
  );
}
