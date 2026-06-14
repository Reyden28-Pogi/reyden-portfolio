import { useState } from "react";
import "./Contact.css";

const SOCIALS = [
  { key: "github",   label: "GitHub",   icon: "bxl-github" },
  { key: "linkedin", label: "LinkedIn", icon: "bxl-linkedin-square" },
  { key: "upwork",   label: "Upwork",   icon: "bxl-upwork" },
  { key: "indeed",   label: "Indeed",   icon: "bx-briefcase" },
  { key: "facebook", label: "Facebook", icon: "bxl-facebook-square" },
  { key: "twitter",  label: "Twitter",  icon: "bxl-twitter" },
  { key: "youtube",  label: "YouTube",  icon: "bxl-youtube" },
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

  const activeSocials = SOCIALS.filter((s) => h[s.key]);

  return (
    <section className="section contact" id="contact">
      <div className="container contact__inner">

        <div className="contact__left">
          <p className="section-label">Work With Me</p>
          <h2 className="section-title">{c.heading || "Let's Build Something"}</h2>
          <div className="divider" />
          <p className="contact__sub">{c.subheading}</p>

          <div className="contact__info-list">
            <a href={`mailto:${c.email}`} className="contact__info-item">
              <span className="contact__info-icon"><i className="bx bx-envelope" /></span>
              <span>{c.email}</span>
            </a>
            {c.phone && (
              <a href={`tel:${c.phone}`} className="contact__info-item">
                <span className="contact__info-icon"><i className="bx bx-phone" /></span>
                <span>{c.phone}</span>
              </a>
            )}
            {h.location && (
              <div className="contact__info-item">
                <span className="contact__info-icon"><i className="bx bx-map" /></span>
                <span>{h.location}</span>
              </div>
            )}
          </div>

          <div className="contact__booking">
            <p className="contact__booking-label">Schedule a Meeting</p>
            <div className="contact__booking-btns">
              {c.calendly && (
                <a href={`https://calendly.com/${c.calendly}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <i className="bx bx-calendar" /> Book via Calendly
                </a>
              )}
              {c.zoom && (
                <a href={c.zoom} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <i className="bx bx-video" /> Join Zoom Call
                </a>
              )}
            </div>
          </div>

          {activeSocials.length > 0 && (
            <div className="contact__socials">
              <p className="contact__socials-label">Find Me Online</p>
              <div className="contact__socials-grid">
                {activeSocials.map((s) => (
                  <a
                    key={s.key}
                    href={h[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-pill"
                    title={s.label}
                  >
                    <i className={`bx ${s.icon} contact__social-icon`} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

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
                {status === "sending" ? "Sending..." : <><i className="bx bx-send" /> Send Message</>}
              </button>
              {status === "success" && <p className="contact__feedback contact__feedback--success"><i className="bx bx-check-circle" /> Message sent! I'll get back to you soon.</p>}
              {status === "error" && <p className="contact__feedback contact__feedback--error"><i className="bx bx-error-circle" /> Something went wrong. Please email directly.</p>}
            </form>
          </div>
        </div>
      </div>

      <div className="contact__footer">
        <div className="container contact__footer-inner">
          <p className="contact__footer-name">Reyden Fajiculay<span>.</span></p>
          <p className="contact__footer-tagline">"Turning Innovation into Advantage"</p>
          <div className="contact__footer-socials">
            {activeSocials.map((s) => (
              <a key={s.key} href={h[s.key]} target="_blank" rel="noopener noreferrer" className="contact__footer-social" title={s.label}>
                <i className={`bx ${s.icon}`} />
              </a>
            ))}
          </div>
          <p className="contact__footer-copy">© {new Date().getFullYear()} Quiverto Solutions · Built with React + Vite · Deployed on Vercel</p>
        </div>
      </div>
    </section>
  );
}