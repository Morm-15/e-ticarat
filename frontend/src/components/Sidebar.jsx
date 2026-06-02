import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FaHome, FaUsers, FaBoxOpen, FaShoppingCart,
    FaCreditCard, FaBars, FaChevronDown, FaSignOutAlt,
    FaListAlt, FaPlusCircle, FaStore, FaTimes,
} from "react-icons/fa";

export default function Sidebar({ isOpen: mobileOpen, onClose }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    // تحديد حالة العرض: على الموبايل نستخدم mobileOpen، على الديسكتوب نستخدم desktopCollapsed
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    // إغلاق عند تغيير المسار على الموبايل
    useEffect(() => {
        if (isMobile) onClose?.();
    }, [location.pathname]);

    const isExpanded = isMobile ? true : !desktopCollapsed;

    const confirmLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const NavItem = ({ to, icon, label, exact = false }) => (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={() => isMobile && onClose?.()}
        >
            <span className="link-icon">{icon}</span>
            {isExpanded && (
                <span style={{ opacity: isExpanded ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {label}
                </span>
            )}
        </NavLink>
    );

    return (
        <>
            <aside
                className={`sidebar${isMobile ? (mobileOpen ? " open" : "") : ""}`}
                style={isMobile ? {} : { width: desktopCollapsed ? "68px" : "240px" }}
            >
                {/* Logo & Toggle */}
                <div style={{
                    padding: "0 0.75rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isExpanded ? "space-between" : "center",
                    minHeight: "64px",
                    gap: "0.5rem",
                }}>
                    {isExpanded && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden" }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                background: "var(--gradient-primary)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1rem",
                            }}>
                                <FaStore color="white" />
                            </div>
                            <div style={{ overflow: "hidden" }}>
                                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, whiteSpace: "nowrap" }}>AdminStore</p>
                                <p style={{ fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: 500 }}>Dashboard</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => isMobile ? onClose?.() : setDesktopCollapsed(p => !p)}
                        style={{
                            background: "var(--bg-glass)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: 8,
                            color: "var(--text-secondary)",
                            width: 32, height: 32, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                    >
                        {isMobile ? <FaTimes size={14} /> : <FaBars size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "0.75rem 0.6rem", overflowY: "auto", overflowX: "hidden" }}>
                    {isExpanded && (
                        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, padding: "0 0.5rem", marginBottom: "0.5rem" }}>
                            Menu
                        </p>
                    )}

                    <NavItem to="/dashboard" exact icon={<FaHome />} label={t("sidebar.dashboard") || "Dashboard"} />
                    <NavItem to="/dashboard/users" icon={<FaUsers />} label={t("sidebar.users")} />
                    <NavItem to="/dashboard/orders" icon={<FaShoppingCart />} label={t("sidebar.orders")} />
                    <NavItem to="/dashboard/payments" icon={<FaCreditCard />} label={t("sidebar.payments") || "Payments"} />

                    {/* Products submenu */}
                    <button
                        onClick={() => setProductMenuOpen(p => !p)}
                        className="sidebar-link"
                        style={{ width: "100%", border: "none", background: "none" }}
                    >
                        <span className="link-icon"><FaBoxOpen /></span>
                        {isExpanded && (
                            <>
                                <span style={{ flex: 1, whiteSpace: "nowrap" }}>{t("sidebar.products")}</span>
                                <FaChevronDown size={10} style={{ transition: "transform 0.2s", transform: productMenuOpen ? "rotate(180deg)" : "rotate(0)", color: "var(--text-muted)", flexShrink: 0 }} />
                            </>
                        )}
                    </button>

                    {productMenuOpen && isExpanded && (
                        <div style={{ marginLeft: "1rem", borderLeft: "1px solid var(--border-glass)", paddingLeft: "0.75rem", marginBottom: "0.25rem" }}>
                            <NavLink to="/dashboard/products/list" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ fontSize: "0.82rem" }} onClick={() => isMobile && onClose?.()}>
                                <span className="link-icon" style={{ fontSize: "0.85rem" }}><FaListAlt /></span>
                                <span>{t("sidebar.productsList")}</span>
                            </NavLink>
                            <NavLink to="/dashboard/products/add" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ fontSize: "0.82rem" }} onClick={() => isMobile && onClose?.()}>
                                <span className="link-icon" style={{ fontSize: "0.85rem" }}><FaPlusCircle /></span>
                                <span>{t("sidebar.addProduct")}</span>
                            </NavLink>
                        </div>
                    )}
                </nav>

                {/* Logout */}
                <div style={{ padding: "0.75rem 0.6rem", borderTop: "1px solid var(--border-subtle)" }}>
                    <button
                        onClick={() => setShowLogout(true)}
                        className="sidebar-link"
                        style={{ width: "100%", border: "none", background: "none", color: "var(--accent-red)" }}
                    >
                        <span className="link-icon"><FaSignOutAlt /></span>
                        {isExpanded && <span style={{ whiteSpace: "nowrap" }}>{t("logout")}</span>}
                    </button>
                </div>
            </aside>

            {/* Logout Modal */}
            {showLogout && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeIn 0.2s ease", padding: "1rem" }}>
                    <div className="glass-card" style={{ padding: "2rem", maxWidth: 360, width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👋</div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{t("logoutConfirm") || "Log out?"}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Are you sure you want to sign out?</p>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                            <button className="btn-secondary" onClick={() => setShowLogout(false)}>{t("cancel")}</button>
                            <button className="btn-danger" onClick={confirmLogout}>{t("confirm")}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
