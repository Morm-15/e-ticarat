import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute: يحمي المسارات من الوصول غير المصرح به.
 * إذا لم يكن هناك token في localStorage يتم التحويل لصفحة Login.
 */
export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
