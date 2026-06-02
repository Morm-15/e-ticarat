import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaStore, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: ({ email, password }) =>
            axios.post(`${API_BASE_URL}/api/users/login`, { email, password }).then(r => r.data),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        },
    });

    const handleLogin = (e) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    const LANGS = [
        { code: "ar", flag: "🇸🇦" },
        { code: "en", flag: "🇺🇸" },
        { code: "fr", flag: "🇫🇷" },
        { code: "tr", flag: "🇹🇷" },
    ];

    return (
        <div className="login-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem" }}>

            {/* Lang switcher top right */}
            <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", display: "flex", gap: "0.4rem", zIndex: 10 }}>
                {LANGS.map(l => (
                    <button
                        key={l.code}
                        onClick={() => i18n.changeLanguage(l.code)}
                        style={{
                            background: i18n.language === l.code ? "var(--gradient-primary)" : "var(--bg-glass)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: 8, padding: "0.35rem 0.6rem",
                            color: "var(--text-primary)", cursor: "pointer",
                            fontSize: "0.78rem", fontWeight: 600,
                            transition: "all 0.2s",
                        }}
                    >
                        {l.flag} {l.code.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="login-card animate-fade-in-up">
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: "var(--gradient-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 1rem",
                        boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                    }}>
                        <FaStore size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                        {t("welcome_admin") || "Admin Dashboard"}
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Sign in to manage your store
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Email */}
                    <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("email") || "Email"}
                        </label>
                        <div style={{ position: "relative" }}>
                            <FiMail style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="email"
                                className="input-glass"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@store.com"
                                required
                                style={{ paddingLeft: "2.5rem" }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("password") || "Password"}
                        </label>
                        <div style={{ position: "relative" }}>
                            <FiLock style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-glass"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {mutation.isError && (
                        <div style={{
                            background: "rgba(239,68,68,0.12)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 8, padding: "0.75rem 1rem",
                            fontSize: "0.85rem", color: "#f87171",
                            animation: "fadeInUp 0.2s ease",
                        }}>
                            ⚠️ {mutation.error?.response?.data?.message || t("error_message") || "Invalid credentials"}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={mutation.isPending}
                        style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
                    >
                        {mutation.isPending ? (
                            <><div className="spinner" /> Signing in...</>
                        ) : (
                            <>{t("login") || "Sign In"} <FiArrowRight /></>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
                    Admin access only · Secured with JWT
                </p>
            </div>
        </div>
    );
}
