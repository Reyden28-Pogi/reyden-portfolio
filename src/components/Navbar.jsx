import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (!e.target.closest(".navbar__links") && !e.target.closest(".navbar__burger")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const links = [
    { label: "About",        id: "about" },
    { label: "Portfolio",    id: "projects" },
    { label: "Certificates", id: "certificates" },
    { label: "Pricing",      id: "pricing" },
    { label: "Contact",      id: "contact" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        <a href="#hero" className="navbar__logo">
          <img src={logo} alt="Quiverto Solutions" className="navbar__logo-img" />
          <span className="navbar__logo-text">Quiverto Solutions<span className="navbar__logo-dot">.</span></span>
        </a>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {/* X button — inside sidebar only */}
          <li className="navbar__close-item">
            <button className="navbar__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </li>

          {links.map((link) => (
            <li key={link.label}>
              <a href={`#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a>
            </li>
          ))}
          <li>
            <a href={data?.contact?.zoom || "#contact"} target="_blank" rel="noopener noreferrer" className="navbar__cta">
              Book a Call
            </a>
          </li>
        </ul>

        {/* Hamburger only — no X toggle */}
        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}