import { useState } from "react";

export default function AdminPricing({ data, update }) {
  const [plans, setPlans] = useState(data.pricing || []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [delivInput, setDelivInput] = useState("");

  const openEdit = (p) => { setEditing(p.id); setForm({ ...p, deliverables: [...p.deliverables] }); setDelivInput(""); };

  const addDeliv = () => {
    if (delivInput.trim()) {
      setForm((p) => ({ ...p, deliverables: [...p.deliverables, delivInput.trim()] }));
      setDelivInput("");
    }
  };

  const removeDeliv = (i) => setForm((p) => ({ ...p, deliverables: p.deliverables.filter((_, idx) => idx !== i) }));

  const save = () => {
    const next = plans.map((p) => p.id === editing ? form : p);
    setPlans(next);
    update("pricing", next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="admin-card">
        <p className="admin-card__title">Pricing Plans</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {plans.map((p) => (
            <div key={p.id} style={{ background: "var(--bg3)", border: `1px solid ${p.highlighted ? "var(--tangerine)" : "var(--border)"}`, borderRadius: 2, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.15rem" }}>{p.tier} — {p.rate}{p.period}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.focus} {p.highlighted ? "· ⭐ Highlighted" : ""}</p>
              </div>
              <button onClick={() => openEdit(p)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.25rem 0.7rem", fontSize: "0.7rem", cursor: "pointer", flexShrink: 0 }}>Edit</button>
            </div>
          ))}
        </div>
        {saved && <span className="admin-saved-msg" style={{ display: "block", marginTop: "0.75rem" }}>✓ Saved!</span>}
      </div>

      {editing !== null && form && (
        <div className="admin-card">
          <p className="admin-card__title">Edit Plan</p>
          {[["tier","Plan Name"],["rate","Rate","e.g. $10.00"],["period","Period","e.g. / hour"],["focus","Focus Area"],["description","Description"]].map(([key, label, ph]) => (
            <div key={key} className="admin-field">
              <label>{label}</label>
              <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={ph || ""} />
            </div>
          ))}
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm((p) => ({ ...p, highlighted: e.target.checked }))} style={{ marginRight: "0.5rem", accentColor: "var(--tangerine)" }} />
              Mark as Most Popular / Highlighted
            </label>
          </div>
          <div className="admin-field">
            <label>Deliverables</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {form.deliverables.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)", padding: "0.4rem 0.75rem", borderRadius: 2, border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{d}</span>
                  <button onClick={() => removeDeliv(i)} style={{ background: "none", border: "none", color: "rgba(255,100,80,0.7)", cursor: "pointer", fontSize: "0.85rem" }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 2, padding: "0.5rem 0.8rem", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--cream)", flex: 1 }} placeholder="Add deliverable..." value={delivInput} onChange={(e) => setDelivInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDeliv()} />
              <button className="admin-save-btn" onClick={addDeliv}>Add</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="admin-save-btn" onClick={save}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", padding: "0.6rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
