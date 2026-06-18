import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userAPI";

export default function Login() {
  const navigate = useNavigate();

  // useRef dipakai untuk mengakses input email secara langsung.
  const emailInputRef = useRef(null);

  // useState dipakai untuk menyimpan data yang berubah di halaman login.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ username: "", password: "" });

  // useEffect dipakai untuk menjalankan fokus input saat halaman login pertama kali dibuka.
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

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
      // Supabase returns an array of matching rows
      if (result && result.length > 0) {
        // Successful login, navigate to dashboard (placeholder)
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#ffffff" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display@0;1&display=swap');

        .auth-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          background: #ffffff;
          border: 1px solid #ccfbf1;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #334155;
          outline: none;
          transition: 0.2s;
        }

        .auth-input::placeholder {
          color: #9ca3af;
        }

        .auth-input:focus {
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.14);
        }

        .auth-btn {
          width: 100%;
          padding: 13px;
          background: #14b8a6;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(20,184,166,0.22);
          transition: 0.2s;
        }

        .auth-btn:hover:not(:disabled) {
          background: #0f766e;
          box-shadow: 0 10px 22px rgba(20,184,166,0.28);
          transform: translateY(-1px);
        }

        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="w-full mx-4" style={{ maxWidth: 380 }}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #ccfbf1",
            borderRadius: 24,
            padding: "40px 32px",
            boxShadow: "0 18px 45px rgba(20,184,166,0.12)",
          }}
        >
          {/* Title */}
          <div className="text-center mb-6">
            <div
              className="mx-auto mb-4"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#14b8a6",
                boxShadow: "0 8px 18px rgba(20,184,166,0.24)",
              }}
            ></div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.6rem",
                color: "#334155",
              }}
            >
              BrightWash
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              Welcome Back
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#b91c1c",
              }}
            >
              <MdError />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(20,184,166,0.06)",
                border: "1px solid rgba(20,184,166,0.18)",
                color: "#0f766e",
              }}
            >
              <AiOutlineLoading3Quarters className="animate-spin" />
              Mohon Tunggu...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#374151",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Username
              </label>
              <input
                ref={emailInputRef}
                name="username"
                type="text"
                value={dataForm.username}
                onChange={handleChange}
                className="auth-input"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <label style={{ fontSize: "0.8rem", color: "#374151" }}>
                  Password
                </label>
                <a href="/forgot" style={{ color: "#14b8a6", fontSize: "0.75rem" }}>
                  Lupa password?
                </a>
              </div>
              <input
                name="password"
                type="password"
                value={dataForm.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="********"
              />
            </div>

            {/* Button */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Masuk...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <p
              className="text-center mt-4"
              style={{ fontSize: "0.8rem", color: "#6b7280" }}
            >
              Belum punya akun?{" "}
              <a href="/register" style={{ color: "#14b8a6" }}>
                Daftar
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
