import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userAPI from "../../services/userAPI";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn, user } = useAuth();

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/dashboard");
    else navigate("/member-portal");
  };

  useEffect(() => {
    if (isLoggedIn) redirectByRole(user?.role || "customer");
  }, [isLoggedIn]);

  const usernameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ username: "", password: "" });

  useEffect(() => { usernameRef.current?.focus(); }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await userAPI.loginUser({ username: dataForm.username, password: dataForm.password });
      if (result && result.length > 0) {
        const userRole = result[0].role || "customer";
        const authResult = await login(dataForm.username, userRole);
        if (authResult.success) redirectByRole(userRole);
        else setError(authResult.error || "Gagal memuat profil customer");
      } else {
        setError("Username atau password salah");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display@0;1&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .left-panel { animation: fadeIn 0.6s ease-out both; }
        .right-panel { animation: fadeIn 0.6s ease-out 0.2s both; }

        .login-input {
          width: 100%; padding: 12px 16px 12px 44px; background: #f8fffe;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          color: #1e293b; outline: none; transition: 0.2s; box-sizing: border-box;
        }
        .login-input::placeholder { color: #94a3b8; }
        .login-input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); background: #fff; }

        .login-btn {
          width: 100%; padding: 13px; background: linear-gradient(135deg, #14b8a6, #0d9488);
          color: white; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: 0.2s; letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(20,184,166,0.3);
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(20,184,166,0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .tab-active { color: #14b8a6; border-bottom: 2.5px solid #14b8a6; font-weight: 600; }
        .tab-inactive { color: #94a3b8; border-bottom: 2.5px solid transparent; font-weight: 400; }

        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .split-layout { flex-direction: column !important; }
        }
      `}</style>

      <div className="split-layout" style={{ display: "flex", width: "100%", minHeight: "100vh" }}>

        {/* LEFT PANEL - Laundry Theme */}
        <div className="left-panel" style={{
          flex: "1 1 45%", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", padding: "48px 40px",
          background: "linear-gradient(160deg, #0f766e 0%, #14b8a6 40%, #06b6d4 100%)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Background circles */}
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -60, left: -80 }} />
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: 40, right: -40 }} />
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)", top: "40%", right: "20%" }} />

          {/* Washing Machine SVG */}
          <div style={{ position: "relative", marginBottom: 40, animation: "float 4s ease-in-out infinite" }}>
            <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
              {/* Machine body */}
              <rect x="20" y="20" width="140" height="170" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              {/* Control panel */}
              <rect x="35" y="35" width="110" height="30" rx="8" fill="rgba(255,255,255,0.1)" />
              <circle cx="55" cy="50" r="6" fill="rgba(255,255,255,0.4)" />
              <circle cx="75" cy="50" r="6" fill="rgba(255,255,255,0.25)" />
              <rect x="95" y="44" width="35" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
              {/* Door / Drum */}
              <circle cx="90" cy="125" r="50" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
              <circle cx="90" cy="125" r="38" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              {/* Spinning clothes */}
              <g style={{ transformOrigin: "90px 125px", animation: "spin 6s linear infinite" }}>
                <circle cx="75" cy="112" r="8" fill="rgba(255,255,255,0.2)" />
                <circle cx="108" cy="118" r="6" fill="rgba(255,255,255,0.15)" />
                <circle cx="85" cy="142" r="7" fill="rgba(255,255,255,0.18)" />
                <circle cx="100" cy="135" r="5" fill="rgba(255,255,255,0.12)" />
              </g>
              {/* Door handle */}
              <circle cx="90" cy="125" r="5" fill="rgba(255,255,255,0.35)" />
            </svg>
          </div>

          {/* Brand + Welcome */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem",
            color: "#ffffff", marginBottom: 8, textAlign: "center", letterSpacing: "-0.02em",
          }}>
            WELCOME
          </h1>
          <p style={{
            fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem",
            color: "rgba(255,255,255,0.85)", marginBottom: 24, textAlign: "center",
          }}>
            to BrightWash
          </p>
          <p style={{
            fontSize: "0.9rem", color: "rgba(255,255,255,0.7)",
            textAlign: "center", maxWidth: 320, lineHeight: 1.7,
          }}>
            Layanan laundry terpercaya dengan kualitas terbaik.
            Serahkan pakaian Anda, kami yang kerjakan.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
            {["Cuci Express", "Dry Cleaning", "Member Reward"].map((f) => (
              <span key={f} style={{
                padding: "6px 16px", borderRadius: 99,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", fontWeight: 500,
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Login Form */}
        <div className="right-panel" style={{
          flex: "1 1 55%", display: "flex", justifyContent: "center",
          alignItems: "center", padding: "48px 32px", background: "#ffffff",
        }}>
          <div style={{ width: "100%", maxWidth: 400 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                boxShadow: "0 4px 12px rgba(20,184,166,0.3)",
              }} />
              <span style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.4rem", color: "#0f766e",
              }}>BrightWash</span>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              Login Akun
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 24 }}>
              Masuk ke akun Anda untuk melanjutkan
            </p>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 24, marginBottom: 28, borderBottom: "1px solid #e2e8f0", paddingBottom: 0 }}>
              <span className="tab-active" style={{ paddingBottom: 10, fontSize: "0.9rem", cursor: "pointer" }}>
                Login
              </span>
              <Link to="/register" className="tab-inactive" style={{
                paddingBottom: 10, fontSize: "0.9rem", cursor: "pointer", textDecoration: "none",
              }}>
                Daftar
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px", borderRadius: 10,
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 8,
              }}>
                <MdError size={16} />
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{
                marginBottom: 16, padding: "10px 14px", borderRadius: 10,
                background: "#f0fdfa", border: "1px solid #ccfbf1",
                color: "#0f766e", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 8,
              }}>
                <AiOutlineLoading3Quarters className="animate-spin" />
                Memproses...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.8" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input ref={usernameRef} name="username" type="text" value={dataForm.username}
                    onChange={handleChange} className="login-input" placeholder="Masukkan username Anda" required />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>Password</label>
                  <Link to="/forgot" style={{ fontSize: "0.75rem", color: "#14b8a6", textDecoration: "none" }}>
                    Lupa password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <rect x="3" y="11" width="18" height="11" rx="3" stroke="#94a3b8" strokeWidth="1.8" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input name="password" type="password" value={dataForm.password}
                    onChange={handleChange} className="login-input" placeholder="Masukkan password Anda" required />
                </div>
              </div>

              {/* Button */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <AiOutlineLoading3Quarters className="animate-spin" /> Masuk...
                  </span>
                ) : "Masuk"}
              </button>

              <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "#64748b" }}>
                Belum punya akun?{" "}
                <Link to="/register" style={{ color: "#14b8a6", fontWeight: 600, textDecoration: "none" }}>
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
