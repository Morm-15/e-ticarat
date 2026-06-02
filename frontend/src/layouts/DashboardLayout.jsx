import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // إغلاق السيدبار عند تغيير المسار على الموبايل
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    // منع scroll الخلفية عند فتح السيدبار
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            background: "var(--bg-primary)",
            position: "relative",
        }}>
            {/* Decorative orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(p => !p)} />

            <div style={{ display: "flex", flex: 1, position: "relative", zIndex: 1, overflow: "hidden" }}>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                        style={{ display: "block" }}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main content */}
                <main style={{
                    flex: 1,
                    padding: "1.75rem",
                    overflowY: "auto",
                    minHeight: "calc(100vh - 64px)",
                    overflowX: "hidden",
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
