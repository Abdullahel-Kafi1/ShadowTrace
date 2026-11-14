import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>SHADOW<span className="brand-light">TRACE</span></span></div>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/dashboard">◈ <span>Overview</span></NavLink>
          <NavLink to="/profile">◎ <span>My profile</span></NavLink>
          {user?.role === "admin" && <NavLink to="/admin">▦ <span>Admin panel</span></NavLink>}
          <NavLink to="/monitoring">⌕ <span>Exposure monitoring</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-status"><span className="pulse-dot"></span><div><b>System status</b><small>Authentication active</small></div></div>
          <button className="logout-button" onClick={handleLogout}>↪ <span>Sign out</span></button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">SHADOWTRACE <span>/</span> SECURITY CONSOLE</div>
          <div className="top-user"><div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div><div><b>{user?.name}</b><small>{user?.role === "admin" ? "Administrator" : "Standard user"}</small></div></div>
        </header>
        <div className="page-content"><Outlet /></div>
        <footer className="footer">SHADOWTRACE <span>•</span> SE331 ACADEMIC PROJECT <span>•</span> MODULES 01–02</footer>
      </main>
    </div>
  );
}
