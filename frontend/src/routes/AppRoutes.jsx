import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import UsersList from "../pages/users/UsersList.jsx";
import ProductsList from "../pages/products/ProductsList.jsx";
import ProductAddForm from "../pages/products/AddProduct.jsx";
import Orders from "../pages/Orders.jsx";
import Payments from "../pages/Payments.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "users",
                element: <UsersList />,
            },
            {
                path: "products/list",
                element: <ProductsList />,
            },
            {
                path: "products/add",
                element: <ProductAddForm />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "payments",
                element: <Payments />,
            },
        ],
    },
]);

export default router;
