import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

const STATUS_STYLES = {
    pending:   { cls: "badge-warning", emoji: "⏳" },
    shipped:   { cls: "badge-info",    emoji: "🚚" },
    delivered: { cls: "badge-success", emoji: "✅" },
    cancelled: { cls: "badge-danger",  emoji: "❌" },
};

const PAYMENT_STYLES = {
    cash:        { cls: "badge-success", label: "💵 Cash" },
    credit_card: { cls: "badge-info",    label: "💳 Card" },
    paypal:      { cls: "badge-purple",  label: "🅿️ PayPal" },
    stripe:      { cls: "badge-purple",  label: "⚡ Stripe" },
};

export default function Orders() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const { data: orders = [], isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: () => fetch(`${API}/api/orders`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
    });

    const mutation = useMutation({
        mutationFn: ({ orderId, newStatus }) =>
            fetch(`${API}/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            }).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        onMutate: ({ orderId }) => setUpdatingId(orderId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
        onSettled: () => setUpdatingId(null),
    });

    const statuses = ["pending", "shipped", "delivered", "cancelled"];

    const filtered = orders.filter(o => {
        const matchSearch = !search ||
            o._id?.slice(-6).includes(search) ||
            o.user?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusCounts = statuses.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    if (isLoading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh", flexDirection: "column", gap: "1rem" }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p style={{ color: "var(--text-muted)" }}>Loading orders...</p>
        </div>
    );

    if (isError) return (
        <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p>Failed to load orders. Check your backend connection.</p>
        </div>
    );

    return (
        <div style={{ maxWidth: 1400 }}>
            {/* Header */}
            <div className="page-header animate-fade-in" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1>🛒 {t("order.ordersList") || "Orders"}</h1>
                    <p>{orders.length} total orders</p>
                </div>
                <button className="btn-secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ["orders"] })}>
                    <FiRefreshCw /> Refresh
                </button>
            </div>

            {/* Status Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[{ key: "all", label: "All Orders", count: orders.length, emoji: "📋" }, ...statuses.map(s => ({ key: s, label: s, count: statusCounts[s], emoji: STATUS_STYLES[s]?.emoji }))].map(item => (
                    <button
                        key={item.key}
                        onClick={() => setFilterStatus(item.key)}
                        style={{
                            background: filterStatus === item.key ? "var(--gradient-primary)" : "var(--bg-glass)",
                            border: `1px solid ${filterStatus === item.key ? "transparent" : "var(--border-glass)"}`,
                            borderRadius: "var(--radius-md)",
                            padding: "0.75rem",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s",
                            boxShadow: filterStatus === item.key ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
                        }}
                    >
                        <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>{item.emoji}</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{item.count}</div>
                        <div style={{ fontSize: "0.68rem", color: filterStatus === item.key ? "rgba(255,255,255,0.8)" : "var(--text-muted)", textTransform: "capitalize" }}>{item.label}</div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="section-card animate-fade-in-up" style={{ marginBottom: "1.25rem" }}>
                <div style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <FaSearch style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.8rem" }} />
                        <input
                            className="input-glass"
                            placeholder="Search by order ID or customer..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: "2.4rem" }}
                        />
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                        {filtered.length} results
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="section-card animate-fade-in-up">
                <div style={{ overflowX: "auto" }}>
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <p>{t("order.noOrders") || "No orders found"}</p>
                        </div>
                    ) : (
                        <table className="table-glass">
                            <thead>
                                <tr>
                                    <th>{t("order.orderNumber") || "Order #"}</th>
                                    <th>{t("order.customerName") || "Customer"}</th>
                                    <th>{t("order.products") || "Products"}</th>
                                    <th>{t("order.totalAmount") || "Total"}</th>
                                    <th>{t("order.orderStatus") || "Status"}</th>
                                    <th>{t("order.paymentMethod") || "Payment"}</th>
                                    <th>{t("order.changeStatus") || "Update"}</th>
                                    <th>{t("order.orderDate") || "Date"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => {
                                    const st = STATUS_STYLES[order.status] || {};
                                    const pm = PAYMENT_STYLES[order.paymentMethod] || { cls: "badge-info", label: order.paymentMethod };
                                    return (
                                        <tr key={order._id}>
                                            <td>
                                                <span style={{ fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 700, fontSize: "0.82rem" }}>
                                                    #{order._id?.slice(-6)}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{order.user?.name || "—"}</td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                                    {order.products?.slice(0, 2).map((item, i) => (
                                                        <span key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                                                            {item.product?.name || "Product"} × {item.quantity}
                                                        </span>
                                                    ))}
                                                    {order.products?.length > 2 && (
                                                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>+{order.products.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 800, color: "var(--accent-green)" }}>${order.totalAmount}</td>
                                            <td><span className={`badge ${st.cls}`}>{st.emoji} {t(`order.statuses.${order.status}`) || order.status}</span></td>
                                            <td><span className={`badge ${pm.cls}`}>{pm.label}</span></td>
                                            <td>
                                                <select
                                                    className="input-glass"
                                                    value={order.status}
                                                    disabled={updatingId === order._id}
                                                    onChange={e => mutation.mutate({ orderId: order._id, newStatus: e.target.value })}
                                                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem", width: "auto", minWidth: 120 }}
                                                >
                                                    {statuses.map(s => (
                                                        <option key={s} value={s} style={{ background: "#1a1a2e" }}>
                                                            {t(`order.statuses.${s}`) || s}
                                                        </option>
                                                    ))}
                                                </select>
                                                {updatingId === order._id && <div className="spinner" style={{ display: "inline-block", marginLeft: 6 }} />}
                                            </td>
                                            <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
