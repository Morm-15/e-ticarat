import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiGlobe, FiDollarSign, FiBell, FiSearch, FiChevronDown, FiMenu } from "react-icons/fi";
import { FaStore } from "react-icons/fa";

const LANGUAGES = [
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];
const CURRENCIES = ["USD", "EUR", "TRY"];

export default function Header({ onMenuClick }) {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [notifOpen, setNotifOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[1];

    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    useEffect(() => {
        document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }, [i18n.language]);

    useEffect(() => {
        const close = () => { setLangOpen(false); setCurrencyOpen(false); setNotifOpen(false); };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const Dropdown = ({ children, isOpen, style = {} }) => (
        isOpen ? (
            <div className="dropdown-menu" style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 200, ...style }} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        ) : null
    );

    const IconBtn = ({ onClick, children, badge }) => (
        <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={onClick} style={{
                position: "relative",
                background: "var(--bg-glass)", border: "1px solid var(--border-glass)",
                borderRadius: 8, padding: "0.4rem 0.55rem",
                color: "var(--text-secondary)", cursor: "pointer",
                display: "flex", alignItems: "center", transition: "all 0.2s",
            }}>
                {children}
                {badge && (
                    <span style={{
                        position: "absolute", top: -4, right: -4,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "var(--accent-primary)", fontSize: "0.6rem",
                        color: "white", display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 700,
                        border: "2px solid var(--bg-primary)",
                    }}>{badge}</span>
                )}
            </button>
        </div>
    );

    return (
        <header className="header">
            {/* Left side */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Hamburger (mobile) */}
                <button
                    className="header-mobile-toggle"
                    onClick={onMenuClick}
                    style={{ background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: 8, color: "var(--text-secondary)", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                    <FiMenu size={18} />
                </button>

                {/* Logo */}
                <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FaStore color="white" size={15} />
                    </div>
                    {!isMobile && (
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>AdminStore</span>
                    )}
                </button>

                {/* Search — hidden on mobile via CSS */}
                <div className="header-search" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <FiSearch style={{ position: "absolute", left: "0.75rem", color: "var(--text-muted)", fontSize: "0.875rem" }} />
                    <input
                        className="input-glass"
                        placeholder="Search..."
                        style={{ width: 180, paddingLeft: "2.2rem", height: 36, fontSize: "0.82rem" }}
                    />
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>

                {/* Language */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setLangOpen(p => !p); setCurrencyOpen(false); setNotifOpen(false); }}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.35rem",
                            background: "var(--bg-glass)", border: "1px solid var(--border-glass)",
                            borderRadius: 8, padding: "0.4rem 0.65rem",
                            color: "var(--text-secondary)", cursor: "pointer",
                            fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s",
                        }}
                    >
                        <FiGlobe size={13} />
                        <span>{currentLang.flag} {!isMobile && currentLang.code.toUpperCase()}</span>
                        {!isMobile && <FiChevronDown size={10} />}
                    </button>
                    <Dropdown isOpen={langOpen}>
                        {LANGUAGES.map(lang => (
                            <button key={lang.code} className={`dropdown-item ${i18n.language === lang.code ? "active" : ""}`}
                                onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}>
                                {lang.flag} {lang.label}
                            </button>
                        ))}
                    </Dropdown>
                </div>

                {/* Currency — hide on small mobile */}
                {!isMobile && (
                    <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => { setCurrencyOpen(p => !p); setLangOpen(false); setNotifOpen(false); }}
                            style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: 8, padding: "0.4rem 0.65rem", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s" }}
                        >
                            <FiDollarSign size={13} />
                            <span>{selectedCurrency}</span>
                            <FiChevronDown size={10} />
                        </button>
                        <Dropdown isOpen={currencyOpen}>
                            {CURRENCIES.map(cur => (
                                <button key={cur} className={`dropdown-item ${selectedCurrency === cur ? "active" : ""}`}
                                    onClick={() => { setSelectedCurrency(cur); setCurrencyOpen(false); }}>
                                    {cur}
                                </button>
                            ))}
                        </Dropdown>
                    </div>
                )}

                {/* Notifications */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                    <IconBtn onClick={() => { setNotifOpen(p => !p); setLangOpen(false); setCurrencyOpen(false); }} badge="3">
                        <FiBell size={16} />
                    </IconBtn>
                    <Dropdown isOpen={notifOpen} style={{ width: 270, right: 0 }}>
                        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-subtle)" }}>
                            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>Notifications</p>
                        </div>
                        {[
                            { text: "New order received #4521", time: "2 min ago", dot: "var(--accent-green)" },
                            { text: "Payment confirmed $250", time: "15 min ago", dot: "var(--accent-primary)" },
                            { text: "New user registered", time: "1 hr ago", dot: "var(--accent-cyan)" },
                        ].map((n, i) => (
                            <div key={i} className="dropdown-item" style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.dot, marginTop: 5, flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", lineHeight: 1.4 }}>{n.text}</p>
                                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </Dropdown>
                </div>

                {/* Avatar */}
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 700, color: "white", cursor: "pointer", border: "2px solid rgba(124,58,237,0.4)", flexShrink: 0 }}>
                    A
                </div>
            </div>
        </header>
    );
}