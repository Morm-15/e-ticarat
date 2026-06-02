import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign,
    FaArrowUp, FaArrowDown, FaCreditCard,
} from "react-icons/fa";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";

const API = import.meta.env.VITE_API_BASE_URL;

const salesData = [
    { name: "Jan", revenue: 4200, orders: 38 },
    { name: "Feb", revenue: 6100, orders: 54 },
    { name: "Mar", revenue: 8400, orders: 72 },
    { name: "Apr", revenue: 5800, orders: 49 },
    { name: "May", revenue: 9200, orders: 86 },
    { name: "Jun", revenue: 11000, orders: 97 },
    { name: "Jul", revenue: 8700, orders: 78 },
];

const categoryData = [
    { name: "Clothing", value: 45, color: "#7c3aed" },
    { name: "Shoes", value: 30, color: "#06b6d4" },
    { name: "Accessories", value: 25, color: "#10b981" },
];

const recentOrders = [
    { id: "ORD-001", customer: "Ahmed Ali", amount: 129, status: "delivered", date: "2024-07-01" },
    { id: "ORD-002", customer: "Sara M.", amount: 245, status: "shipped", date: "2024-07-01" },
    { id: "ORD-003", customer: "John D.", amount: 89, status: "pending", date: "2024-06-30" },
    { id: "ORD-004", customer: "Fatima K.", amount: 320, status: "delivered", date: "2024-06-30" },
];

const STATUS_BADGE = {
    delivered: "badge-success",
    shipped:   "badge-info",
    pending:   "badge-warning",
    cancelled: "badge-danger",
};

function StatCard({ icon, label, value, change, positive, gradient, delay }) {
    return (
        <div className={`stat-card animate-fade-in-up stagger-${delay}`}>
            <div className="stat-icon" style={{ background: gradient }}>
                {icon}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {change && (
                <div className="stat-change" style={{ color: positive ? "var(--accent-green)" : "var(--accent-red)" }}>
                    {positive ? <FaArrowUp style={{ display: "inline", marginRight: 3 }} /> : <FaArrowDown style={{ display: "inline", marginRight: 3 }} />}
                    {change} vs last month
                </div>
            )}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#1a1a2e", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.82rem" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, fontWeight: 700 }}>
                    {p.name === "revenue" ? "$" : ""}{p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const dir = i18n.language === "ar" ? "rtl" : "ltr";

    const { data: users = [] }    = useQuery({ queryKey: ["users"],    queryFn: () => axios.get(`${API}/api/users`).then(r => r.data) });
    const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => axios.get(`${API}/api/products`).then(r => r.data) });
    const { data: orders = [] }   = useQuery({ queryKey: ["orders"],   queryFn: () => axios.get(`${API}/api/orders`).then(r => r.data) });
    const { data: payData }       = useQuery({ queryKey: ["payments"], queryFn: () => axios.get(`${API}/api/payments`).then(r => r.data) });

    const totalRevenue = payData?.totalRevenue || 0;

    return (
        <div dir={dir} style={{ maxWidth: 1400 }}>
            {/* Page Header */}
            <div className="page-header animate-fade-in">
                <h1>👋 {t("dashboard.welcome") || "Welcome back, Admin"}</h1>
                <p>Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                <StatCard
                    delay={1}
                    icon={<FaUsers color="white" />}
                    label={t("dashboard.users") || "Total Users"}
                    value={users.length || 0}
                    change="+12%"
                    positive
                    gradient="linear-gradient(135deg, #7c3aed, #4f46e5)"
                />
                <StatCard
                    delay={2}
                    icon={<FaBoxOpen color="white" />}
                    label={t("dashboard.products") || "Products"}
                    value={products.length || 0}
                    change="+8%"
                    positive
                    gradient="linear-gradient(135deg, #06b6d4, #4f46e5)"
                />
                <StatCard
                    delay={3}
                    icon={<FaShoppingCart color="white" />}
                    label={t("dashboard.orders") || "Total Orders"}
                    value={orders.length || 0}
                    change="+23%"
                    positive
                    gradient="linear-gradient(135deg, #10b981, #059669)"
                />
                <StatCard
                    delay={4}
                    icon={<FaCreditCard color="white" />}
                    label={t("dashboard.sales") || "Revenue"}
                    value={`$${totalRevenue.toLocaleString()}`}
                    change="+18%"
                    positive
                    gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
                />
            </div>

            {/* Charts Row */}
            <div className="grid-2" style={{ marginBottom: "2rem" }}>
                {/* Revenue Chart */}
                <div className="section-card animate-fade-in-up stagger-1">
                    <div className="section-card-header">
                        <h3>📈 Revenue Overview</h3>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Last 7 months</span>
                    </div>
                    <div style={{ padding: "1.25rem" }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone" dataKey="revenue"
                                    stroke="#7c3aed" strokeWidth={2.5}
                                    fill="url(#revenueGrad)"
                                    dot={{ fill: "#7c3aed", strokeWidth: 0, r: 3 }}
                                    activeDot={{ r: 5, fill: "#a78bfa" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders + Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Orders Chart */}
                    <div className="section-card animate-fade-in-up stagger-2" style={{ flex: 1 }}>
                        <div className="section-card-header">
                            <h3>🛒 Orders Trend</h3>
                        </div>
                        <div style={{ padding: "1rem" }}>
                            <ResponsiveContainer width="100%" height={100}>
                                <LineChart data={salesData}>
                                    <Line
                                        type="monotone" dataKey="orders"
                                        stroke="#06b6d4" strokeWidth={2.5}
                                        dot={false} activeDot={{ r: 4 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="section-card animate-fade-in-up stagger-3" style={{ flex: 1 }}>
                        <div className="section-card-header">
                            <h3>🏷️ Categories</h3>
                        </div>
                        <div style={{ padding: "0.75rem", display: "flex", alignItems: "center" }}>
                            <ResponsiveContainer width="50%" height={100}>
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
                                        {categoryData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                {categoryData.map((c, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                                        <span style={{ color: "var(--text-secondary)", flex: 1 }}>{c.name}</span>
                                        <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{c.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="section-card animate-fade-in-up">
                <div className="section-card-header">
                    <h3>📋 Recent Orders</h3>
                    <a href="/dashboard/orders" style={{ fontSize: "0.8rem", color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}>
                        View all →
                    </a>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="table-glass">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 600 }}>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td style={{ fontWeight: 700 }}>${order.amount}</td>
                                    <td><span className={`badge ${STATUS_BADGE[order.status]}`}>● {order.status}</span></td>
                                    <td style={{ color: "var(--text-muted)" }}>{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
