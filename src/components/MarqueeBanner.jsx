import "./MarqueeBanner.css";

const ITEMS = [
  "Forward-Thinking",
  "Entrepreneurial",
  "Bold",
  "Surprising",
  "Visionary",
  "Innovative",
  "Forward-Thinking",
  "Entrepreneurial",
  "Bold",
  "Surprising",
  "Visionary",
  "Innovative",
];

export default function MarqueeBanner() {
  return (
    <div className="marquee-banner">
      <div className="marquee-banner__track">
        {/* Duplicated for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="marquee-banner__item">
            <span className="marquee-banner__dot">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}