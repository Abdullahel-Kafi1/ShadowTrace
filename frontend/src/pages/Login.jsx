import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="brand"><span className="brand-mark">S</span><span>SHADOW<span className="brand-light">TRACE</span></span></div>
        <div className="visual-copy"><div className="eyebrow"><span className="pulse-dot"></span> DIGITAL IDENTITY PROTECTION</div><h1>See the risk.<br/><em>Secure the identity.</em></h1><p>A unified security workspace for credential exposure awareness and threat intelligence.</p></div>
        <div className="visual-foot">PROACTIVE SECURITY. INFORMED ACTION.</div>
        <div className="orb orb-one"></div><div className="orb orb-two"></div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand brand"><span className="brand-mark">S</span><span>SHADOW<span className="brand-light">TRACE</span></span></div>
          <div className="eyebrow muted">SECURE ACCESS / 01</div>
          <h2>Welcome back</h2><p className="subtext">Sign in to access your ShadowTrace workspace.</p>
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={submit}>
            <label>Email address</label><input type="email" name="email" value={form.email} onChange={update} placeholder="name@example.com" autoComplete="email" required/>
            <label>Password</label><input type="password" name="password" value={form.password} onChange={update} placeholder="Enter your password" autoComplete="current-password" required/>
            <button className="primary-button full" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"} <span>→</span></button>
          </form>
          <p className="auth-switch">New to ShadowTrace? <Link to="/register">Create an account</Link></p>
          <div className="form-note">Protected session · Encrypted password storage</div>
        </div>
      </div>
    </div>
  );
}
