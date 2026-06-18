import { useState } from "react";
import userAPI from "../../services/userAPI";

export default function Register() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
    const [strength, setStrength] = useState(0);

    const handleRegister = async (e) => {
      e.preventDefault();
      if (form.password && form.password === form.confirmPassword) {
        try {
          await userAPI.registerUser({ username: form.username, password: form.password, role: "user" });
          alert("User registered successfully");
          // Optionally reset form
          setForm({ username: "", password: "", confirmPassword: "" });
        } catch (err) {
          console.error(err);
          alert(err.message || "Failed to register");
        }
      } else {
        alert("Password and Confirm Password must match");
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

    const strengthColor = ["#ef5350", "#ff9800", "#26a69a", "#009688"][strength - 1] || "rgba(0,150,136,0.1)";
    const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #f0fdfb 0%, #e6f7f5 50%, #f0fdfb 100%)" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes bubbleFloat {
          0%   { transform: translateY(110vh) scale(0.8); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes iconPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.08); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .card-in  { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .title-in { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .form-in  { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s both; }

        .auth-input {
          width: 100%;
          padding: 11px 16px 11px 42px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(0,150,136,0.2);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #004d40;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(4px);
          box-sizing: border-box;
        }
        .auth-input::placeholder { color: #b2dfdb; }
        .auth-input:focus {
          border-color: #009688;
          box-shadow: 0 0 0 4px rgba(0,150,136,0.12);
        }
        .pass-input { padding-right: 42px; }

        .auth-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #009688, #00796b);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(0,150,136,0.3);
        }
        .auth-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(0,150,136,0.38);
        }
        .auth-btn:active { transform: translateY(0); }
      `}</style>

            {/* Floating bubbles */}
            {[
                { left: "8%", size: 20, dur: 9, delay: 0 },
                { left: "20%", size: 13, dur: 12, delay: 2 },
                { left: "50%", size: 17, dur: 10, delay: 1 },
                { left: "72%", size: 11, dur: 11, delay: 3 },
                { left: "85%", size: 19, dur: 8, delay: 0.5 },
                { left: "38%", size: 9, dur: 13, delay: 4 },
            ].map((b, i) => (
                <div key={i} className="absolute rounded-full pointer-events-none bottom-0"
                    style={{
                        left: b.left, width: b.size, height: b.size,
                        background: i % 2 === 0 ? "rgba(0,150,136,0.13)" : "rgba(0,121,107,0.09)",
                        border: "1px solid rgba(0,150,136,0.18)",
                        animation: `bubbleFloat ${b.dur}s ease-in ${b.delay}s infinite`,
                        opacity: 0,
                    }} />
            ))}

            {/* Ambient blobs */}
            <div className="absolute w-80 h-80 rounded-full opacity-20 -top-16 -left-20"
                style={{ background: "radial-gradient(circle, #4db6ac, transparent 70%)" }} />
            <div className="absolute w-64 h-64 rounded-full opacity-15 -bottom-12 -right-14"
                style={{ background: "radial-gradient(circle, #00796b, transparent 70%)" }} />

            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(circle, #00695c 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

            {/* Card */}
            <div className="card-in relative z-10 w-full max-w-sm mx-4 py-6">
                <div style={{
                    background: "rgba(255,255,255,0.78)",
                    backdropFilter: "blur(20px)",
                    border: "1.5px solid rgba(0,150,136,0.15)",
                    borderRadius: 20,
                    padding: "36px 36px",
                    boxShadow: "0 20px 60px rgba(0,100,90,0.1), 0 2px 8px rgba(0,150,136,0.06)",
                }}>

                    {/* Icon */}
                    <div className="title-in flex justify-center mb-4">
                        <div style={{
                            width: 58, height: 58, borderRadius: "50%",
                            background: "linear-gradient(145deg, #e0f2f1, #b2dfdb)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(0,150,136,0.18)",
                            animation: "iconPulse 3s ease-in-out infinite",
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#009688" strokeWidth="1.6" strokeLinecap="round" />
                                <circle cx="9" cy="7" r="4" stroke="#009688" strokeWidth="1.6" />
                                <path d="M19 8v6M22 11h-6" stroke="#00796b" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Brand */}
                    <div className="title-in text-center mb-1">
                        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.6rem", color: "#004d40" }}>Pixel</span>
                        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.6rem", color: "#009688" }}>Mags</span>
                    </div>

                    <h2 className="title-in text-center mb-2" style={{
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        fontSize: "1.05rem", color: "#004d40",
                    }}>
                        Create Your Account ✨
                    </h2>

                    <div className="flex justify-center mb-5">
                        <div style={{ width: 40, height: 2, borderRadius: 99, background: "linear-gradient(90deg, #80cbc4, #009688)" }} />
                    </div>

                    {/* Form */}
                    <form className="form-in" onSubmit={handleRegister}>

                        {/* Email */}
                        <div className="mb-4">
                            <label style={{
                                display: "block", fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, fontSize: "0.78rem", color: "#00695c",
                                letterSpacing: "0.03em", marginBottom: 6,
                            }}>Username</label>
                            <div style={{ position: "relative" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#80cbc4" strokeWidth="1.6" />
                                    <path d="M2 8l10 6 10-6" stroke="#80cbc4" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                                <input name="username" type="text" onChange={handleChange}
                                     className="auth-input" placeholder="yourusername" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label style={{
                                display: "block", fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, fontSize: "0.78rem", color: "#00695c",
                                letterSpacing: "0.03em", marginBottom: 6,
                            }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                    <rect x="2" y="11" width="20" height="11" rx="3" stroke="#80cbc4" strokeWidth="1.6" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#80cbc4" strokeWidth="1.6" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1.5" fill="#80cbc4" />
                                </svg>
                                <input name="password" type={showPass ? "text" : "password"}
                                    onChange={handleChange} className="auth-input pass-input" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#80cbc4" }}>
                                    {showPass ? (
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
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password strength */}
                        {form.password && (
                            <div className="mb-4">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((lvl) => (
                                        <div key={lvl} style={{
                                            flex: 1, height: 3, borderRadius: 99,
                                            background: strength >= lvl ? strengthColor : "rgba(0,150,136,0.1)",
                                            transition: "background 0.3s",
                                        }} />
                                    ))}
                                </div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: strengthColor, fontWeight: 400 }}>
                                    {strengthLabel}
                                </p>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label style={{
                                display: "block", fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, fontSize: "0.78rem", color: "#00695c",
                                letterSpacing: "0.03em", marginBottom: 6,
                            }}>Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                    <rect x="2" y="11" width="20" height="11" rx="3" stroke="#80cbc4" strokeWidth="1.6" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#80cbc4" strokeWidth="1.6" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1.5" fill="#80cbc4" />
                                </svg>
                                <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                                    onChange={handleChange} className="auth-input pass-input" placeholder="••••••••"
                                    style={{
                                        borderColor: form.confirmPassword
                                            ? form.confirmPassword === form.password ? "rgba(0,150,136,0.5)" : "rgba(239,83,80,0.4)"
                                            : "rgba(0,150,136,0.2)"
                                    }} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#80cbc4" }}>
                                    {showConfirm ? (
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
                                    )}
                                </button>
                                {form.confirmPassword && form.confirmPassword === form.password && (
                                    <div style={{ position: "absolute", right: 38, top: "50%", transform: "translateY(-50%)" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17l-5-5" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {form.confirmPassword && form.confirmPassword !== form.password && (
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#ef5350", marginTop: 4 }}>
                                    Password tidak cocok
                                </p>
                            )}
                        </div>

                        <button type="submit" className="auth-btn">
                            Daftar Sekarang
                        </button>

                        <p className="text-center mt-4" style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                            color: "#80cbc4", fontWeight: 300,
                        }}>
                            Sudah punya akun?{" "}
                            <a href="/login" style={{ color: "#009688", fontWeight: 500, textDecoration: "none" }}>
                                Masuk di sini
                            </a>
                        </p>
                    </form>

                    {/* Shimmer bar */}
                    <div className="mt-5 rounded-full overflow-hidden mx-auto" style={{ width: 120, height: 2, background: "rgba(0,150,136,0.1)" }}>
                        <div style={{
                            height: "100%", width: "100%", borderRadius: 99,
                            background: "linear-gradient(90deg, #e0f2f1 0%, #009688 40%, #4db6ac 60%, #e0f2f1 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 2.5s linear infinite",
                        }} />
                    </div>
                </div>

                <p className="text-center mt-5" style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                    fontSize: "0.65rem", letterSpacing: "0.3em",
                    textTransform: "uppercase", color: "#b2dfdb",
                }}>
                    Pixel Mags · Laundry System
                </p>
            </div>
        </div>
    );
}