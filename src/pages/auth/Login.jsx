import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    axios
      .post("https://dummyjson.com/user/login", {
        username: dataForm.email,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }
        navigate("/");
      })
      .catch((err) => {
        if (err.response)
          setError(err.response.data.message || "An error occurred");
        else setError(err.message || "An unknown error occurred");
      })
      .finally(() => setLoading(false));
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
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: 0.2s;
        }

        .auth-input::placeholder {
          color: #9ca3af;
        }

        .auth-input:focus {
          border-color: #007AFF;
          box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
        }

        .auth-btn {
          width: 100%;
          padding: 13px;
          background: #007AFF;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,122,255,0.3);
          transition: 0.2s;
        }

        .auth-btn:hover:not(:disabled) {
          box-shadow: 0 6px 18px rgba(0,122,255,0.4);
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
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: "40px 32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.6rem",
                color: "#111827",
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
              Welcome Back 👋
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
                background: "rgba(0,122,255,0.05)",
                border: "1px solid rgba(0,122,255,0.15)",
                color: "#007AFF",
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
                Email
              </label>
              <input
                name="email"
                type="text"
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
                <a href="/forgot" style={{ color: "#007AFF", fontSize: "0.75rem" }}>
                  Lupa password?
                </a>
              </div>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="auth-input"
                placeholder="••••••••"
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
              <a href="/register" style={{ color: "#007AFF" }}>
                Daftar
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
