import { useState, useEffect } from "react";
import { DEFAULT_DATA } from "../data/defaults";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "reyden_portfolio";

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

// Track visit in Supabase
export function useVisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const sessionKey = `visited_${today}`;
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, "1");

        const { data: existing } = await supabase
          .from("visits")
          .select("id, count")
          .eq("date", today)
          .single();

        if (existing) {
          await supabase
            .from("visits")
            .update({ count: existing.count + 1 })
            .eq("id", existing.id);
        } else {
          await supabase.from("visits").insert([{ date: today, count: 1 }]);
        }
      } catch {}
    };
    trackVisit();
  }, []);
}

// Get visit stats from Supabase
export async function getVisitStats() {
  try {
    const { data: visits, error } = await supabase
      .from("visits")
      .select("*")
      .order("date", { ascending: false })
      .limit(90);

    if (error || !visits) return { total: 0, today: 0, week: 0, history: [] };

    const total = visits.reduce((sum, v) => sum + v.count, 0);
    const today = new Date().toISOString().split("T")[0];
    const todayVisits = visits.find((v) => v.date === today)?.count || 0;

    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    const weekVisits = visits
      .filter((v) => new Date(v.date) > last7)
      .reduce((sum, v) => sum + v.count, 0);

    return {
      total,
      today: todayVisits,
      week: weekVisits,
      history: [...visits].reverse(),
    };
  } catch {
    return { total: 0, today: 0, week: 0, history: [] };
  }
}