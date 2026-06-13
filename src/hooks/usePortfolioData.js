import { useState, useEffect } from "react";
import { DEFAULT_DATA } from "../data/defaults";

const STORAGE_KEY = "reyden_portfolio";
const VISITS_KEY = "reyden_visits";

export function usePortfolioData() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_DATA, ...JSON.parse(stored) } : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const update = (section, value) => {
    setData((prev) => {
      const next = { ...prev, [section]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { data, update };
}

export function useVisitTracker() {
  useEffect(() => {
    try {
      const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || "[]");
      const today = new Date().toISOString().split("T")[0];
      const existing = visits.find((v) => v.date === today);
      if (existing) {
        existing.count += 1;
      } else {
        visits.push({ date: today, count: 1, page: window.location.pathname });
      }
      // Keep last 90 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const trimmed = visits.filter((v) => new Date(v.date) > cutoff);
      localStorage.setItem(VISITS_KEY, JSON.stringify(trimmed));
    } catch {}
  }, []);
}

export function getVisitStats() {
  try {
    const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || "[]");
    const total = visits.reduce((sum, v) => sum + v.count, 0);
    const today = new Date().toISOString().split("T")[0];
    const todayVisits = visits.find((v) => v.date === today)?.count || 0;

    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    const weekVisits = visits
      .filter((v) => new Date(v.date) > last7)
      .reduce((sum, v) => sum + v.count, 0);

    return { total, today: todayVisits, week: weekVisits, history: visits.slice(-30) };
  } catch {
    return { total: 0, today: 0, week: 0, history: [] };
  }
}
