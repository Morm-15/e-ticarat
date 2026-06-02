import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    FaPlus, FaEdit, FaTrash, FaSearch, FaUsers,
    FaUserShield, FaUser, FaToggleOn, FaToggleOff,
} from "react-icons/fa";
import { FiX, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

// ===== Add User Modal =====
function AddUserModal({ onClose, onSuccess }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: (data) => axios.post(`${API}/api/users/register`, data).then(r => r.data),
        onSuccess: () => { onSuccess?.(); onClose?.(); },
        onError: (err) => setError(err.response?.data?.message || "Failed to create user"),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        mutation.mutate(form);
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", animation: "fadeIn 0.2s ease" }}>
            <div className="glass-card" style={{ width: "100%", maxWidth: 480, padding: "2rem", position: "relative" }}>
                {/* Close */}
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: 8, color: "var(--text-muted)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <FiX />
                </button>

                <div style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>👤 {t("addUser") || "Add New User"}</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.25rem" }}>Create a new admin or user account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Name */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("name") || "Full Name"} <span style={{ color: "var(--accent-red)" }}>*</span>
                        </label>
                        <input
                            className="input-glass"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("email") || "Email"} <span style={{ color: "var(--accent-red)" }}>*</span>
                        </label>
                        <input
                            className="input-glass"
                            type="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("password") || "Password"} <span style={{ color: "var(--accent-red)" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="input-glass"
                                type={showPass ? "text" : "password"}
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                required
                                minLength={6}
                                style={{ paddingRight: "2.5rem" }}
                            />
                            <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                                {showPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                            {t("role") || "Role"}
                        </label>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            {["user", "admin"].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, role: r }))}
                                    style={{
                                        flex: 1, padding: "0.65rem",
                                        background: form.role === r ? "var(--gradient-primary)" : "var(--bg-glass)",
                                        border: `1px solid ${form.role === r ? "transparent" : "var(--border-glass)"}`,
                                        borderRadius: "var(--radius-md)",
                                        color: form.role === r ? "white" : "var(--text-secondary)",
                                        cursor: "pointer", transition: "all 0.2s",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                                        fontSize: "0.85rem", fontWeight: 600,
                                        boxShadow: form.role === r ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
                                    }}
                                >
                                    {r === "admin" ? <FaUserShield /> : <FaUser />}
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#f87171" }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={mutation.isPending}>
                            {mutation.isPending ? <><div className="spinner" /> Creating...</> : <><FiCheck /> Create User</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ===== Edit User Modal =====
function EditUserModal({ user, onClose, onSuccess }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, isActive: user.isActive });
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: (data) => axios.put(`${API}/api/users/${user._id}`, data).then(r => r.data),
        onSuccess: () => { onSuccess?.(); onClose?.(); },
        onError: (err) => setError(err.response?.data?.message || "Update failed"),
    });

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", animation: "fadeIn 0.2s ease" }}>
            <div className="glass-card" style={{ width: "100%", maxWidth: 480, padding: "2rem", position: "relative" }}>
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: 8, color: "var(--text-muted)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <FiX />
                </button>

                <div style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>✏️ {t("editUser") || "Edit User"}</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Update user information</p>
                </div>

                <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>{t("name") || "Name"}</label>
                        <input className="input-glass" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>{t("email") || "Email"}</label>
                        <input className="input-glass" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                    </div>

                    {/* Role */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>{t("role") || "Role"}</label>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            {["user", "admin"].map(r => (
                                <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                                    style={{ flex: 1, padding: "0.6rem", background: form.role === r ? "var(--gradient-primary)" : "var(--bg-glass)", border: `1px solid ${form.role === r ? "transparent" : "var(--border-glass)"}`, borderRadius: "var(--radius-md)", color: form.role === r ? "white" : "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600 }}>
                                    {r === "admin" ? <FaUserShield /> : <FaUser />}
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem" }}>
                        <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Account Status</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{form.isActive ? "User can log in" : "Account is disabled"}</p>
                        </div>
                        <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.8rem", color: form.isActive ? "var(--accent-green)" : "var(--text-muted)", transition: "all 0.2s" }}>
                            {form.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#f87171" }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={mutation.isPending}>
                            {mutation.isPending ? <><div className="spinner" /> Saving...</> : <><FiCheck /> Save</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ===== Delete Confirm Modal =====
function DeleteModal({ user, onClose, onSuccess }) {
    const mutation = useMutation({
        mutationFn: () => axios.delete(`${API}/api/users/${user._id}`),
        onSuccess: () => { onSuccess?.(); onClose?.(); },
    });
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", animation: "fadeIn 0.2s ease" }}>
            <div className="glass-card" style={{ padding: "2rem", maxWidth: 380, width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🗑️</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Delete User?</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    "<strong style={{ color: "var(--text-primary)" }}>{user.name}</strong>" will be permanently removed.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-danger" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
                        {mutation.isPending ? <><div className="spinner" style={{ width: 14, height: 14, display: "inline-block" }} /> Deleting...</> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ===== Main Users Page =====
export default function UsersList() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: () => axios.get(`${API}/api/users`).then(r => Array.isArray(r.data) ? r.data : []),
    });

    const reload = () => queryClient.invalidateQueries({ queryKey: ["users"] });

    const filtered = users.filter(u => {
        const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "all" || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const totalAdmins = users.filter(u => u.role === "admin").length;
    const totalActive = users.filter(u => u.isActive !== false).length;

    if (isLoading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh", flexDirection: "column", gap: "1rem" }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p style={{ color: "var(--text-muted)" }}>Loading users...</p>
        </div>
    );

    if (isError) return (
        <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p>Failed to load users. Check your backend connection.</p>
        </div>
    );

    return (
        <div style={{ maxWidth: 1400 }}>
            {/* Header */}
            <div className="page-header animate-fade-in page-header-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1>👥 {t("usersListTitle") || "Users"}</h1>
                    <p>{users.length} total users · {totalAdmins} admins · {totalActive} active</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>
                    <FaPlus /> {t("addUser") || "Add User"}
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
                {[
                    { label: "Total Users", value: users.length, emoji: "👥", gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
                    { label: "Admins", value: totalAdmins, emoji: "🛡️", gradient: "linear-gradient(135deg,#06b6d4,#4f46e5)" },
                    { label: "Active", value: totalActive, emoji: "✅", gradient: "linear-gradient(135deg,#10b981,#059669)" },
                    { label: "Inactive", value: users.length - totalActive, emoji: "⛔", gradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
                ].map((s, i) => (
                    <div key={i} className={`stat-card animate-fade-in-up stagger-${i + 1}`}>
                        <div className="stat-icon" style={{ background: s.gradient }}>{s.emoji}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="section-card animate-fade-in-up" style={{ marginBottom: "1.25rem" }}>
                <div style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                        <FaSearch style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.8rem" }} />
                        <input
                            className="input-glass"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: "2.4rem" }}
                        />
                    </div>
                    {/* Role filter */}
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                        {["all", "admin", "user"].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilterRole(r)}
                                className={filterRole === r ? "btn-primary" : "btn-secondary"}
                                style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem" }}
                            >
                                {r === "all" ? "All" : r === "admin" ? "🛡️ Admins" : "👤 Users"}
                            </button>
                        ))}
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>{filtered.length} found</span>
                </div>
            </div>

            {/* Table */}
            <div className="section-card animate-fade-in-up">
                <div className="table-responsive">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FaUsers /></div>
                            <p>No users found</p>
                            <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setShowAdd(true)}>
                                <FaPlus /> Add User
                            </button>
                        </div>
                    ) : (
                        <table className="table-glass">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%",
                                                    background: user.role === "admin" ? "var(--gradient-primary)" : "linear-gradient(135deg,#06b6d4,#4f46e5)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: "0.9rem", fontWeight: 700, color: "white", flexShrink: 0,
                                                }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{user.email}</td>
                                        <td>
                                            <span className={user.role === "admin" ? "badge badge-purple" : "badge badge-info"}>
                                                {user.role === "admin" ? <><FaUserShield /> Admin</> : <><FaUser /> User</>}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={user.isActive !== false ? "badge badge-success" : "badge badge-danger"}>
                                                {user.isActive !== false ? "● Active" : "● Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button className="btn-secondary" style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }} onClick={() => setEditUser(user)}>
                                                    <FaEdit /> Edit
                                                </button>
                                                <button className="btn-danger" style={{ padding: "0.35rem 0.5rem", fontSize: "0.78rem" }} onClick={() => setDeleteUser(user)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showAdd    && <AddUserModal    onClose={() => setShowAdd(false)}    onSuccess={reload} />}
            {editUser   && <EditUserModal   user={editUser}  onClose={() => setEditUser(null)}  onSuccess={reload} />}
            {deleteUser && <DeleteModal     user={deleteUser} onClose={() => setDeleteUser(null)} onSuccess={reload} />}
        </div>
    );
}
