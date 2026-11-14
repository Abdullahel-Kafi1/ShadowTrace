import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 8) return setError("Password must contain at least 8 characters.");
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="brand"><span className="brand-mark">S</span><span>SHADOW<span className="brand-light">TRACE</span></span></div>
        <div className="visual-copy"><div className="eyebrow"><span className="pulse-dot"></span> BUILD YOUR SECURITY PROFILE</div><h1>Your identity.<br/><em>Your control.</em></h1><p>Create a secure workspace to monitor account exposure and understand digital identity risks.</p></div>
        <div className="visual-foot">AWARENESS IS THE FIRST LINE OF DEFENCE.</div>
        <div className="orb orb-one"></div><div className="orb orb-two"></div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand brand"><span className="brand-mark">S</span><span>SHADOW<span className="brand-light">TRACE</span></span></div>
          <div className="eyebrow muted">ACCOUNT REGISTRATION / 01</div>
          <h2>Create account</h2><p className="subtext">Set up your ShadowTrace user profile.</p>
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={submit}>
            <label>Full name</label><input name="name" value={form.name} onChange={update} placeholder="Your full name" minLength="2" maxLength="80" autoComplete="name" required/>
            <label>Email address</label><input type="email" name="email" value={form.email} onChange={update} placeholder="name@example.com" autoComplete="email" required/>
            <label>Password <span className="label-hint">MIN. 8 CHARACTERS</span></label><input type="password" name="password" value={form.password} onChange={update} placeholder="Create a password" minLength="8" maxLength="72" autoComplete="new-password" required/>
            <label>Confirm password</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} placeholder="Re-enter your password" autoComplete="new-password" required/>
            <button className="primary-button full" disabled={busy}>{busy ? "Creating account…" : "Create secure account"} <span>→</span></button>
          </form>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
          <div className="form-note">New accounts receive standard User permissions.</div>
        </div>
      </div>
    </div>
  );
}
