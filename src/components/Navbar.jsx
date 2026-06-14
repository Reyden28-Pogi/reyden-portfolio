import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detector
  useEffect(() => {
    const sectionIds = ["hero", "about", "projects", "certificates", "pricing", "contact"];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close on outside click
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
          <span className="navbar__logo-text">
            Quiverto Solutions<span className="navbar__logo-dot">.</span>
          </span>
        </a>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className={activeSection === link.id ? "navbar__link--active" : ""}
              >
                {link.label}
                {activeSection === link.id && <span className="navbar__active-dot" />}
              </a>
            </li>
          ))}
          <li>
            <a
              href={data?.contact?.zoom || "#contact"}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__cta"
            >
              Book a Call
            </a>
          </li>
        </ul>

        {/* Hamburger ☰ → X toggle */}
        <button
          className={`navbar__burger ${menuOpen ? "navbar__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar__burger-line" />
          <span className="navbar__burger-line" />
          <span className="navbar__burger-line" />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}