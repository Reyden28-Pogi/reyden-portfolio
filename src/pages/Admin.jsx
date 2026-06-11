import { useState } from "react";
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem("reyden_admin_auth") === "1"
  );
  const { data, update } = usePortfolioData();

  const logout = () => {
    localStorage.removeItem("reyden_admin_auth");
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminDashboard data={data} update={update} onLogout={logout} />;
}
