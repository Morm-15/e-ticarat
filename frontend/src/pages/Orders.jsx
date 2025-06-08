import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Orders() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState(null);

    // دالة لجلب الطلبات
    const fetchOrders = async () => {
        const res = await fetch("http://localhost:5000/api/orders");
        if (!res.ok) throw new Error(t("order.fetchOrdersError"));
        return res.json();
    };

    // استخدام useQuery بصيغة object
    const { data: orders = [], isLoading, isError, error } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
    });

    // استخدام useMutation مع الدوال المناسبة
    const mutation = useMutation({
        mutationFn: ({ orderId, newStatus }) =>
            fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            }).then((res) => {
                if (!res.ok) throw new Error(t("order.updateStatusError"));
                return res.json();
            }),
        onMutate: ({ orderId }) => {
            setUpdatingId(orderId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onSettled: () => {
            setUpdatingId(null);
        },
        onError: (err) => {
            alert(err.message);
        },
    });

    const handleStatusChange = (orderId, newStatus) => {
        mutation.mutate({ orderId, newStatus });
    };

    if (isLoading)
        return <div className="p-6 text-center text-gray-500">{t("order.loading")}</div>;

    if (isError)
        return (
            <div className="p-6 text-center text-red-600">
                {t("order.error")}: {error.message}
            </div>
        );

    const statuses = ["pending", "shipped", "delivered", "cancelled"];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
                {t("order.ordersList")}
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-600">{t("order.noOrders")}</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.orderNumber")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.customerName")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.products")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.totalAmount")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.orderStatus")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.changeStatus")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.paymentMethod")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("order.orderDate")}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">
                                    {order._id.slice(-6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {order.user?.name || t("order.unknown")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    <ul className="list-disc list-inside">
                                        {order.products.map((item) => (
                                            <li key={item.product._id}>
                                                {item.product.name} - {t("order.quantity")}: {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                    {order.totalAmount} {t("order.currency")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                    {t(`order.statuses.${order.status}`)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        disabled={updatingId === order._id}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {t(`order.statuses.${status}`)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                    {order.paymentMethod.replace("_", " ")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
