import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ConsentBanner.css";

const CONSENT_KEY = "reyden_visitor_consent";
const NAME_KEY = "reyden_visitor_name";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if already decided
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show after 2 seconds
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("visitors").insert([{
        name: name.trim(),
        date: today,
      }]);
    } catch {}
    localStorage.setItem(CONSENT_KEY, "allowed");
    localStorage.setItem(NAME_KEY, name.trim());
    setSaving(false);
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-banner">
      <div className="consent-banner__inner">
        <div className="consent-banner__text">
          <p className="consent-banner__title">👋 Quick question!</p>
          <p className="consent-banner__desc">
            May I record your name to track who visits my portfolio? Totally optional — decline and you'll still see everything!
          </p>
        </div>

        <div className="consent-banner__actions">
          <input
            type="text"
            className="consent-banner__input"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAllow()}
            maxLength={60}
          />
          <button
            className="consent-banner__allow"
            onClick={handleAllow}
            disabled={!name.trim() || saving}
          >
            {saving ? "Saving..." : "Allow ✓"}
          </button>
          <button className="consent-banner__decline" onClick={handleDecline}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}