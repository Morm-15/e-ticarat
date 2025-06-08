import Sidebar from "../components/Sidebar";  // استيراد الـ Sidebar
import Header from "../components/Header";  // استيراد الـ Header
import { Outlet } from "react-router-dom";  // هذا يعرض المحتوى الفرعي داخل الـ Layout

export default function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />  {/* إضافة الـ Header */}
            <div className="flex flex-1">
                <Sidebar />  {/* إضافة الـ Sidebar بدون حالة الـ isOpen */}
                <div className="flex-1 p-4">
                    <Outlet />  {/* سيتم هنا عرض المحتوى الفرعي مثل صفحة المستخدمين */}
                </div>
            </div>
        </div>
    );
}
