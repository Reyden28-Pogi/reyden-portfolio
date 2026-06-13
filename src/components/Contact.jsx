import { useState } from "react";
import "./Contact.css";

const SOCIALS = [
  { key: "github",   label: "GitHub",   svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>' },
  { key: "linkedin", label: "LinkedIn", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  { key: "upwork",   label: "Upwork",   svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H8.557v7.094c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H1.45v7.094c0 2.72 2.214 4.934 4.934 4.934 2.717 0 4.932-2.214 4.932-4.934v-1.19c.543 1.327 1.235 2.687 2.097 3.931l-1.77 8.33h2.529l1.22-5.64c1.051.619 2.222.998 3.209.998 2.721 0 4.936-2.215 4.936-4.936-.001-2.721-2.216-4.936-4.936-4.936z"/></svg>' },
  { key: "indeed",   label: "Indeed",   svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.06 0C5.405 0 0 5.405 0 12.06c0 6.656 5.405 12.06 12.06 12.06 6.656 0 12.06-5.404 12.06-12.06C24.12 5.405 18.716 0 12.06 0zm-1.583 5.876h3.165v7.388l3.146-3.165h3.793l-3.793 3.793 3.793 5.237h-3.651l-2.22-3.354-1.068 1.068v2.286H10.477V5.876z"/></svg>' },
  { key: "facebook", label: "Facebook", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { key: "twitter",  label: "Twitter",  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  { key: "youtube",  label: "YouTube",  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
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
        <div className="contact__left" data-animate="left">
          <p className="section-label">Work With Me</p>
          <h2 className="section-title">{c.heading || "Let's Build Something"}</h2>
          <div className="divider" />
          <p className="contact__sub">{c.subheading}</p>

          <div className="contact__info-list">
            <a href={`mailto:${c.email}`} className="contact__info-item">
              <span className="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <span>{c.email}</span>
            </a>
            {c.phone && (
              <a href={`tel:${c.phone}`} className="contact__info-item">
                <span className="contact__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span>{c.phone}</span>
              </a>
            )}
            {h.location && (
              <div className="contact__info-item">
                <span className="contact__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>{h.location}</span>
              </div>
            )}
          </div>

          <div className="contact__booking">
            <p className="contact__booking-label">Schedule a Meeting</p>
            <div className="contact__booking-btns">
              {c.calendly && (
                <a href={`https://calendly.com/${c.calendly}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  📅 Book via Calendly
                </a>
              )}
              {c.zoom && (
                <a href={c.zoom} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  🎥 Join Zoom Call
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
                    <span
                      className="contact__social-icon"
                      dangerouslySetInnerHTML={{ __html: s.svg }}
                    />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="contact__right" data-animate="right">
          <div className="contact__form-wrap hover-glow">
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
