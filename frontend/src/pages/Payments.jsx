import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaClock, FaPlus, FaTimes } from "react-icons/fa";
import { FiDollarSign, FiTrendingUp, FiActivity } from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const STATUS_STYLES = {
    completed: { cls: "badge-success", icon: <FaCheckCircle />, label: "Completed" },
    pending:   { cls: "badge-warning", icon: <FaClock />,       label: "Pending"   },
    failed:    { cls: "badge-danger",  icon: <FaTimesCircle />, label: "Failed"    },
    refunded:  { cls: "badge-info",    icon: <FaTimesCircle />, label: "Refunded"  },
};

const CARD_STYLE = {
    style: {
        base: {
            fontSize: "16px",
            color: "#f1f5f9",
            fontFamily: "'Inter', sans-serif",
            "::placeholder": { color: "#64748b" },
            iconColor: "#7c3aed",
        },
        invalid: { color: "#f87171" },
    },
};

// --- Stripe Payment Form ---
function PaymentForm({ onClose, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return setError("Please enter a valid amount.");
        }

        setLoading(true);
        setError("");

        try {
            // 1. Create Payment Intent
            const { data } = await axios.post(`${API}/api/payments/create-intent`, {
                amount: parseFloat(amount),
                currency: "usd",
                customerName: name,
                customerEmail: email,
                description,
            });

            // 2. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name, email },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                setSuccess(true);
                setTimeout(() => { onSuccess?.(); onClose?.(); }, 2500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem", animation: "fadeInUp 0.4s ease" }}>✅</div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-green)", marginBottom: "0.5rem" }}>Payment Successful!</h3>
                <p style={{ color: "var(--text-muted)" }}>Transaction of <strong style={{ color: "var(--text-primary)" }}>${amount}</strong> was processed.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Full Name</label>
                    <input className="input-glass" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Email</label>
                    <input className="input-glass" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
            </div>
            <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Amount (USD)</label>
                <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--accent-green)", fontWeight: 700 }}>$</span>
                    <input className="input-glass" type="number" min="0.5" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required style={{ paddingLeft: "1.8rem" }} />
                </div>
            </div>
            <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Description (optional)</label>
                <input className="input-glass" placeholder="Payment for order..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {/* Card Element */}
            <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Card Details</label>
                <div style={{ background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "0.85rem 1rem", transition: "all 0.2s" }}>
                    <CardElement options={CARD_STYLE} />
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    🔒 Test card: <span style={{ fontFamily: "monospace", color: "var(--accent-primary)" }}>4242 4242 4242 4242</span> · Any future date · Any 3-digit CVC
                </p>
            </div>

            {error && (
                <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#f87171" }}>
                    ⚠️ {error}
                </div>
            )}

            <button type="submit" className="btn-primary" disabled={!stripe || loading} style={{ justifyContent: "center", padding: "0.85rem" }}>
                {loading ? <><div className="spinner" /> Processing...</> : <><FaCreditCard /> Charge ${amount || "0.00"}</>}
            </button>
        </form>
    );
}

// --- Main Payments Page ---
export default function Payments() {
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["payments"],
        queryFn: () => axios.get(`${API}/api/payments`).then(r => r.data),
    });

    const transactions = data?.transactions || [];
    const totalRevenue = data?.totalRevenue || 0;
    const stats = data?.stats || [];

    const getStatCount = (status) => stats.find(s => s._id === status)?.count || 0;
    const getStatTotal = (status) => stats.find(s => s._id === status)?.total || 0;

    return (
        <div style={{ maxWidth: 1400 }}>
            {/* Header */}
            <div className="page-header animate-fade-in" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1>💳 Payments</h1>
                    <p>Manage Stripe transactions and revenue</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                    <FaPlus /> New Payment
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                <div className="stat-card animate-fade-in-up stagger-1">
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                        <FiDollarSign color="white" size={22} />
                    </div>
                    <div className="stat-value">${totalRevenue.toFixed(2)}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card animate-fade-in-up stagger-2">
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                        <FiActivity color="white" size={22} />
                    </div>
                    <div className="stat-value">{getStatCount("completed")}</div>
                    <div className="stat-label">Successful</div>
                    <div className="stat-change" style={{ color: "var(--accent-green)" }}>✅ ${getStatTotal("completed").toFixed(0)} collected</div>
                </div>
                <div className="stat-card animate-fade-in-up stagger-3">
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                        <FaClock color="white" size={20} />
                    </div>
                    <div className="stat-value">{getStatCount("pending")}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card animate-fade-in-up stagger-4">
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                        <FaTimesCircle color="white" size={20} />
                    </div>
                    <div className="stat-value">{getStatCount("failed")}</div>
                    <div className="stat-label">Failed</div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="section-card animate-fade-in-up">
                <div className="section-card-header">
                    <h3>📋 Transaction History</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{transactions.length} transactions</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    {isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FaCreditCard /></div>
                            <p>No transactions yet. Create your first payment!</p>
                            <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setShowForm(true)}>
                                <FaPlus /> New Payment
                            </button>
                        </div>
                    ) : (
                        <table className="table-glass">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Stripe ID</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => {
                                    const st = STATUS_STYLES[tx.status] || STATUS_STYLES.pending;
                                    return (
                                        <tr key={tx._id}>
                                            <td style={{ fontFamily: "monospace", color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: 700 }}>
                                                #{tx._id?.slice(-8)}
                                            </td>
                                            <td>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{tx.customerName || "—"}</p>
                                                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{tx.customerEmail || ""}</p>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 800, color: "var(--accent-green)", fontSize: "1rem" }}>
                                                ${tx.amount?.toFixed(2)}
                                            </td>
                                            <td>
                                                <span className="badge badge-purple">⚡ {tx.paymentMethod}</span>
                                            </td>
                                            <td>
                                                <span className={`badge ${st.cls}`}>{st.icon} {st.label}</span>
                                            </td>
                                            <td style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {tx.stripePaymentIntentId || tx.stripeSessionId || "—"}
                                            </td>
                                            <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Payment Form Modal */}
            {showForm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", animation: "fadeIn 0.2s ease" }}>
                    <div className="glass-card" style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: "2rem", position: "relative" }}>
                        {/* Close */}
                        <button
                            onClick={() => setShowForm(false)}
                            style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-glass)", border: "1px solid var(--border-glass)", borderRadius: 8, color: "var(--text-muted)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                            <FaTimes />
                        </button>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>⚡ New Payment</h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.25rem" }}>Powered by Stripe — Test mode active</p>
                        </div>

                        <Elements stripe={stripePromise}>
                            <PaymentForm onClose={() => setShowForm(false)} onSuccess={refetch} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
}
