import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from "react-icons/fa";
import { FiGrid, FiList } from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ProductsList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => axios.get(`${API}/api/products`).then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(`${API}/api/products/${id}`),
        onMutate: (id) => setDeletingId(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); setConfirmDelete(null); },
        onSettled: () => setDeletingId(null),
    });

    const filtered = products.filter(p =>
        !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const CATEGORY_COLORS = {
        giyim:    { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" },
        ayakkabı: { bg: "rgba(6,182,212,0.15)",  color: "#22d3ee" },
        aksesuar: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
    };

    return (
        <div style={{ maxWidth: 1400 }}>
            {/* Header */}
            <div className="page-header animate-fade-in" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1>📦 {t("product.listTitle") || "Products"}</h1>
                    <p>{products.length} products in store</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/dashboard/products/add")}>
                    <FaPlus /> {t("sidebar.addProduct") || "Add Product"}
                </button>
            </div>

            {/* Toolbar */}
            <div className="section-card animate-fade-in-up" style={{ marginBottom: "1.25rem" }}>
                <div style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.8rem" }} />
                        <input
                            className="input-glass"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: "2.4rem" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", padding: "0.2rem", border: "1px solid var(--border-glass)" }}>
                        {[{ mode: "grid", icon: <FiGrid /> }, { mode: "list", icon: <FiList /> }].map(v => (
                            <button
                                key={v.mode}
                                onClick={() => setViewMode(v.mode)}
                                style={{
                                    background: viewMode === v.mode ? "var(--gradient-primary)" : "transparent",
                                    border: "none", borderRadius: 6, padding: "0.4rem 0.65rem",
                                    color: viewMode === v.mode ? "white" : "var(--text-muted)",
                                    cursor: "pointer", transition: "all 0.2s", fontSize: "0.9rem",
                                }}
                            >
                                {v.icon}
                            </button>
                        ))}
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{filtered.length} found</span>
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                    <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="section-card">
                    <div className="empty-state">
                        <div className="empty-icon"><FaBoxOpen /></div>
                        <p>No products found</p>
                        <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => navigate("/dashboard/products/add")}>
                            <FaPlus /> Add First Product
                        </button>
                    </div>
                </div>
            ) : viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
                    {filtered.map((product, i) => {
                        const catStyle = CATEGORY_COLORS[product.category] || { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" };
                        const imgSrc = product.images?.[0]
                            ? `${API}/uploads/${product.images[0]}`
                            : null;
                        return (
                            <div
                                key={product._id}
                                className={`glass-card animate-fade-in-up stagger-${(i % 5) + 1}`}
                                style={{ overflow: "hidden", padding: 0 }}
                            >
                                {/* Image */}
                                <div style={{ height: 180, background: "var(--bg-glass-strong)", position: "relative", overflow: "hidden" }}>
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                                            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                                            onMouseLeave={e => e.target.style.transform = "scale(1)"}
                                        />
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "3rem", opacity: 0.3 }}>
                                            <FaBoxOpen />
                                        </div>
                                    )}
                                    {/* Status badge */}
                                    <div style={{ position: "absolute", top: "0.6rem", right: "0.6rem" }}>
                                        <span className={product.isActive ? "badge badge-success" : "badge badge-danger"}>
                                            {product.isActive ? "● Active" : "● Inactive"}
                                        </span>
                                    </div>
                                    {product.discount > 0 && (
                                        <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem" }}>
                                            <span className="badge badge-warning">-{product.discount}%</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, flex: 1 }}>
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: 6, background: catStyle.bg, color: catStyle.color }}>
                                            {product.category}
                                        </span>
                                        {product.productType && (
                                            <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: 6, background: "var(--bg-glass)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                                                {product.productType}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-green)" }}>
                                                ${product.prices?.USD || 0}
                                            </p>
                                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Stock: {product.stock}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                                                onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-danger"
                                                style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                                                onClick={() => setConfirmDelete(product)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div className="section-card animate-fade-in-up">
                    <div style={{ overflowX: "auto" }}>
                        <table className="table-glass">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price (USD)</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg-glass)", overflow: "hidden", flexShrink: 0 }}>
                                                    {product.images?.[0] ? (
                                                        <img src={`${API}/uploads/${product.images[0]}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    ) : (
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4 }}><FaBoxOpen /></div>
                                                    )}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-purple">{product.category}</span></td>
                                        <td style={{ fontWeight: 700, color: "var(--accent-green)" }}>${product.prices?.USD || 0}</td>
                                        <td style={{ color: product.stock < 5 ? "var(--accent-red)" : "var(--text-primary)" }}>{product.stock}</td>
                                        <td><span className={product.isActive ? "badge badge-success" : "badge badge-danger"}>{product.isActive ? "Active" : "Inactive"}</span></td>
                                        <td>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button className="btn-secondary" style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }} onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}>
                                                    <FaEdit /> Edit
                                                </button>
                                                <button className="btn-danger" style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }} onClick={() => setConfirmDelete(product)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {confirmDelete && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeIn 0.2s ease" }}>
                    <div className="glass-card" style={{ padding: "2rem", maxWidth: 380, width: "90%", textAlign: "center" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🗑️</div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Delete Product?</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                            "<strong style={{ color: "var(--text-primary)" }}>{confirmDelete.name}</strong>" will be permanently deleted.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                            <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                            <button
                                className="btn-danger"
                                disabled={deletingId === confirmDelete._id}
                                onClick={() => deleteMutation.mutate(confirmDelete._id)}
                            >
                                {deletingId === confirmDelete._id ? <><div className="spinner" style={{ width: 14, height: 14, display: "inline-block" }} /> Deleting...</> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
