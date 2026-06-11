import { useEffect, useRef } from "react";
import "./Hero.css";

export default function Hero({ data }) {
  const h = data?.hero || {};
  const canvasRef = useRef(null);

  // Subtle particle/grain effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(173,115,65,${p.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero__canvas" />

      <div className="hero__noise" />

      <div className="container hero__inner">
        <div className="hero__available">
          {data?.about?.available && (
            <span className="hero__badge">
              <span className="hero__dot" />
              Available for projects
            </span>
          )}
        </div>

        <p className="hero__eyebrow">
          {h.role || "Full-Stack Developer & Freelancer"}
        </p>

        <h1 className="hero__name">
          {(h.name || "Reyden Rogon Fajiculay")
            .split(" ")
            .map((word, i) => (
              <span key={i} className="hero__name-word" style={{ animationDelay: `${i * 0.12}s` }}>
                {word}
              </span>
            ))}
        </h1>

        <p className="hero__tagline">
          "{h.tagline || "Turning Innovation into Advantage"}"
        </p>

        <p className="hero__bio">{h.bio}</p>

        <div className="hero__actions">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href={`mailto:${h.email}`} className="btn btn-outline">Get in Touch</a>
        </div>

        <div className="hero__socials">
          {h.github && (
            <a href={h.github} target="_blank" rel="noopener noreferrer" className="hero__social-link">
              GitHub
            </a>
          )}
          {h.linkedin && (
            <a href={h.linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link">
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
