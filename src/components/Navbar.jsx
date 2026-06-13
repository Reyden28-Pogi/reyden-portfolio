import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Portfolio", "Certificates", "Pricing", "Contact"];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        <a href="#hero" className="navbar__logo">
          Reyden<span>.</span>
        </a>
        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
            </li>
          ))}
          <li>
            <a href={data?.contact?.zoom || "#contact"} target="_blank" rel="noopener noreferrer" className="navbar__cta">
              Book a Call
            </a>
          </li>
        </ul>
        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
