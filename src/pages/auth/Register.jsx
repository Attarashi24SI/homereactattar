import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userAPI from "../../services/userAPI";
import { customerAPI } from "../../services/customerAPI";

export default function Register() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        fullname: "", username: "", email: "",
        gender: "L", birthDate: "", password: "", confirmPassword: "",
    });
    const [strength, setStrength] = useState(0);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.fullname || !form.username || !form.email || !form.birthDate) {
            setError("Semua field wajib diisi."); return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Password dan Confirm Password harus sama."); return;
        }
        if (form.password.length < 6) {
            setError("Password minimal 6 karakter."); return;
        }
        setLoading(true);
        let createdCustomerId = null;
        try {
            const usernameExists = await userAPI.checkUsernameExists(form.username);
            if (usernameExists) { setError("Username sudah digunakan."); setLoading(false); return; }
            const emailExists = await userAPI.checkEmailExists(form.email);
            if (emailExists) { setError("Email sudah terdaftar."); setLoading(false); return; }

            createdCustomerId = `CUST${Date.now().toString().slice(-6)}`;

            await customerAPI.createCustomer({
                customerid: createdCustomerId, fullname: form.fullname,
                username: form.username, gender: form.gender,
                birthDate: form.birthDate, plan: "Silver",
            });

            try {
                await userAPI.registerUser({
                    username: form.username, password: form.password,
                    role: "customer", email: form.email, customerid: createdCustomerId,
                });
            } catch (userErr) {
                try { await customerAPI.deleteCustomer(createdCustomerId); } catch { }
                throw new Error(userErr.response?.data?.message || userErr.message || "Gagal membuat akun. Silakan coba lagi.");
            }

            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "password") {
            let s = 0;
            if (value.length >= 8) s++;
            if (/[A-Z]/.test(value)) s++;
            if (/[0-9]/.test(value)) s++;
            if (/[^A-Za-z0-9]/.test(value)) s++;
            setStrength(s);
        }
    };

    const strengthColor = ["#ef5350", "#ff9800", "#26a69a", "#009688"][strength - 1] || "rgba(20,184,166,0.1)";
    const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];

    // Shared icon components
    const IconUser = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
    const IconMail = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M2 8l10 6 10-6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
    const IconLock = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <rect x="3" y="11" width="18" height="11" rx="3" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
    const IconEye = ({ open }) => open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display@0;1&display=swap');
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

                .left-panel { animation: fadeIn 0.6s ease-out both; }
                .right-panel { animation: fadeIn 0.6s ease-out 0.2s both; }

                .reg-input {
                    width: 100%; padding: 10px 14px 10px 40px; background: #f8fffe;
                    border: 1.5px solid #e2e8f0; border-radius: 10px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
                    color: #1e293b; outline: none; transition: 0.2s; box-sizing: border-box;
                }
                .reg-input::placeholder { color: #94a3b8; }
                .reg-input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); background: #fff; }
                .reg-select { padding-left: 14px; cursor: pointer; }
                .pass-input { padding-right: 40px; }

                .reg-btn {
                    width: 100%; padding: 12px; background: linear-gradient(135deg, #14b8a6, #0d9488);
                    color: white; border: none; border-radius: 10px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
                    cursor: pointer; transition: 0.2s;
                    box-shadow: 0 4px 14px rgba(20,184,166,0.3);
                }
                .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(20,184,166,0.4); }
                .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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
                    flex: "1 1 42%", display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center", padding: "48px 40px",
                    background: "linear-gradient(160deg, #0f766e 0%, #14b8a6 40%, #06b6d4 100%)",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -60, left: -80 }} />
                    <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: 40, right: -40 }} />

                    {/* T-shirt + bubbles SVG */}
                    <div style={{ position: "relative", marginBottom: 40, animation: "float 4s ease-in-out infinite" }}>
                        <svg width="160" height="180" viewBox="0 0 160 180" fill="none">
                            {/* T-shirt */}
                            <path d="M40 40 L20 55 L35 70 L45 60 L45 150 L115 150 L115 60 L125 70 L140 55 L120 40 L105 45 C100 55 60 55 55 45 Z"
                                fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" />
                            {/* Collar */}
                            <path d="M55 45 C60 55 100 55 105 45" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                            {/* Sparkles */}
                            <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.3)" />
                            <circle cx="135" cy="25" r="3" fill="rgba(255,255,255,0.25)" />
                            <circle cx="20" cy="130" r="5" fill="rgba(255,255,255,0.2)" />
                            <circle cx="145" cy="120" r="4" fill="rgba(255,255,255,0.15)" />
                            <circle cx="80" cy="15" r="3" fill="rgba(255,255,255,0.2)" />
                            {/* Bubbles */}
                            <circle cx="50" cy="100" r="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                            <circle cx="110" cy="90" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                            <circle cx="75" cy="120" r="5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                        </svg>
                    </div>

                    <h1 style={{
                        fontFamily: "'DM Serif Display', serif", fontSize: "2rem",
                        color: "#ffffff", marginBottom: 8, textAlign: "center",
                    }}>
                        JOIN US
                    </h1>
                    <p style={{
                        fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem",
                        color: "rgba(255,255,255,0.85)", marginBottom: 20, textAlign: "center",
                    }}>
                        BrightWash Member
                    </p>
                    <p style={{
                        fontSize: "0.85rem", color: "rgba(255,255,255,0.7)",
                        textAlign: "center", maxWidth: 300, lineHeight: 1.7,
                    }}>
                        Daftar sekarang dan nikmati harga khusus member,
                        reward points, serta layanan prioritas.
                    </p>

                    <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
                        {["Harga Member", "Reward Points", "Free Pickup"].map((f) => (
                            <span key={f} style={{
                                padding: "5px 14px", borderRadius: 99,
                                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                                fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: 500,
                            }}>{f}</span>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL - Register Form */}
                <div className="right-panel" style={{
                    flex: "1 1 58%", display: "flex", justifyContent: "center",
                    alignItems: "flex-start", padding: "40px 32px",
                    background: "#ffffff", overflowY: "auto",
                }}>
                    <div style={{ width: "100%", maxWidth: 420, paddingTop: 12 }}>
                        {/* Logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <img
                                src="/img/BrightWashNoBg.png"
                                alt="BrightWash"
                                style={{ width: 40, height: 40, objectFit: "contain" }}
                            />
                            <span style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: "1.3rem", color: "#0f766e",
                            }}>BrightWash</span>
                        </div>

                        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                            Daftar Akun
                        </h2>
                        <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 20 }}>
                            Buat akun baru untuk mulai berbelanja
                        </p>

                        {/* Tabs */}
                        <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
                            <Link to="/login" className="tab-inactive" style={{
                                paddingBottom: 10, fontSize: "0.85rem", cursor: "pointer", textDecoration: "none",
                            }}>Login</Link>
                            <span className="tab-active" style={{ paddingBottom: 10, fontSize: "0.85rem", cursor: "default" }}>
                                Daftar
                            </span>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                marginBottom: 14, padding: "9px 12px", borderRadius: 8,
                                background: "#fef2f2", border: "1px solid #fecaca",
                                color: "#dc2626", fontSize: "0.78rem",
                            }}>{error}</div>
                        )}

                        <form onSubmit={handleRegister}>
                            {/* Full Name */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                    Nama Lengkap
                                </label>
                                <div style={{ position: "relative" }}>
                                    <IconUser />
                                    <input name="fullname" type="text" onChange={handleChange}
                                        className="reg-input" placeholder="Nama lengkap Anda" required />
                                </div>
                            </div>

                            {/* Username */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                    Username
                                </label>
                                <div style={{ position: "relative" }}>
                                    <IconUser />
                                    <input name="username" type="text" onChange={handleChange}
                                        className="reg-input" placeholder="Pilih username unik" required />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                    Email
                                </label>
                                <div style={{ position: "relative" }}>
                                    <IconMail />
                                    <input name="email" type="email" onChange={handleChange}
                                        className="reg-input" placeholder="email@example.com" required />
                                </div>
                            </div>

                            {/* Gender + Birth Date */}
                            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                        Gender
                                    </label>
                                    <select name="gender" value={form.gender} onChange={handleChange}
                                        className="reg-input reg-select" required>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                        Tanggal Lahir
                                    </label>
                                    <input name="birthDate" type="date" value={form.birthDate}
                                        onChange={handleChange} className="reg-input"
                                        style={{ paddingLeft: 14 }} required />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: 4 }}>
                                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                    Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <IconLock />
                                    <input name="password" type={showPass ? "text" : "password"}
                                        onChange={handleChange} className="reg-input pass-input" placeholder="Min. 6 karakter" required />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                                        <IconEye open={showPass} />
                                    </button>
                                </div>
                                {/* Strength bar */}
                                {form.password && (
                                    <div style={{ marginTop: 6 }}>
                                        <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                                            {[1, 2, 3, 4].map((lvl) => (
                                                <div key={lvl} style={{
                                                    flex: 1, height: 3, borderRadius: 99,
                                                    background: strength >= lvl ? strengthColor : "#e2e8f0",
                                                    transition: "background 0.3s",
                                                }} />
                                            ))}
                                        </div>
                                        <p style={{ fontSize: "0.68rem", color: strengthColor, fontWeight: 500 }}>
                                            {strengthLabel}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#374151", marginBottom: 5 }}>
                                    Konfirmasi Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <IconLock />
                                    <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                                        onChange={handleChange} className="reg-input pass-input" placeholder="Ulangi password"
                                        style={{
                                            borderColor: form.confirmPassword
                                                ? form.confirmPassword === form.password ? "#14b8a6" : "#fca5a5"
                                                : "#e2e8f0"
                                        }} required />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                                        <IconEye open={showConfirm} />
                                    </button>
                                    {form.confirmPassword && form.confirmPassword === form.password && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            style={{ position: "absolute", right: 38, top: "50%", transform: "translateY(-50%)" }}>
                                            <path d="M20 6L9 17l-5-5" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                {form.confirmPassword && form.confirmPassword !== form.password && (
                                    <p style={{ fontSize: "0.68rem", color: "#ef4444", marginTop: 4 }}>Password tidak cocok</p>
                                )}
                            </div>

                            <button type="submit" className="reg-btn" disabled={loading}>
                                {loading ? "Mendaftar..." : "Daftar Sekarang"}
                            </button>

                            <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.78rem", color: "#64748b" }}>
                                Sudah punya akun?{" "}
                                <Link to="/login" style={{ color: "#14b8a6", fontWeight: 600, textDecoration: "none" }}>
                                    Masuk di sini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
