import { useState } from "react";
import { ADMIN_PASSWORD } from "../data/defaults";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem("reyden_admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="admin-login">
      <div className={`admin-login__card ${shake ? "admin-login__card--shake" : ""}`}>
        <div className="admin-login__logo">
          <span className="admin-login__logo-text">Reyden</span>
          <span className="admin-login__logo-dot">.</span>
          <span className="admin-login__logo-sub">Admin</span>
        </div>
        <p className="admin-login__hint">Portfolio Management Panel</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label>Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="admin-login__error">Incorrect password. Try again.</p>}
          <button type="submit" className="btn btn-primary admin-login__btn">
            Enter Dashboard →
          </button>
        </form>

        <p className="admin-login__back">
          <a href="/">← Back to Portfolio</a>
        </p>
      </div>
    </div>
  );
}
