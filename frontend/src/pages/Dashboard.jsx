import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <div className="page-heading"><div><div className="eyebrow muted">ACCOUNT CENTRE / OVERVIEW</div><h1>Good to have you here, {user?.name?.split(" ")[0]}.</h1><p>Your ShadowTrace account and access information at a glance.</p></div><span className="status-pill"><i></i> ACCOUNT ACTIVE</span></div>
      <div className="welcome-banner"><div><div className="eyebrow">SHADOWTRACE SECURITY CONSOLE</div><h2>Identity protection starts with visibility.</h2><p>Your account is ready. Credential exposure monitoring features will be available through the platform's subsequent modules.</p></div><div className="banner-symbol">⌁</div></div>
      <div className="section-title">ACCOUNT SUMMARY <span>LIVE ACCOUNT DATA</span></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>ACCOUNT STATUS</span><b className="stat-icon green">✓</b></div><strong className="stat-value small-value">Active</strong><small>Your account is registered</small></div>
        <div className="stat-card"><div className="stat-top"><span>ACCESS LEVEL</span><b className="stat-icon blue">◇</b></div><strong className="stat-value small-value">{user?.role === "admin" ? "Admin" : "User"}</strong><small>Role-based permissions</small></div>
        <div className="stat-card"><div className="stat-top"><span>PROFILE</span><b className="stat-icon purple">◎</b></div><strong className="stat-value small-value">Configured</strong><small>{user?.email}</small></div>
      </div>
      <div className="section-title">MODULE 01 <span>AUTHENTICATION & ACCOUNT MANAGEMENT</span></div>
      <div className="feature-grid">
        <div className="feature-card"><span className="feature-number">01</span><h3>Secure authentication</h3><p>Your password is stored as a bcrypt hash. Authentication uses a protected session cookie.</p><span className="feature-tag">ENABLED</span></div>
        <div className="feature-card"><span className="feature-number">02</span><h3>Access control</h3><p>Your account role determines which protected areas and administrative actions you can access.</p><span className="feature-tag">ENABLED</span></div>
        <div className="feature-card"><span className="feature-number">03</span><h3>Profile management</h3><p>Review and update your registered name from your personal profile page.</p><span className="feature-tag">ENABLED</span></div>
      </div>
    </div>
  );
}
