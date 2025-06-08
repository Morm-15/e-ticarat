import { useTranslation } from "react-i18next";
import {
    FaUsers,
    FaBoxOpen,
    FaShoppingCart,
    FaDollarSign,
} from "react-icons/fa";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const data = [
    { name: "Jan", sales: 400 },
    { name: "Feb", sales: 600 },
    { name: "Mar", sales: 800 },
    { name: "Apr", sales: 500 },
];

function SalesChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#2d2d2d",
                        borderRadius: 8,
                        border: "none",
                    }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
                />
                <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const fetchUsers = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/users`);
    return data || [];
};

const fetchProducts = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/products`);
    return data || [];
};

const fetchExchangeRates = async () => {
    const { data } = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    return {
        usdToTry: data.rates.TRY,
        usdToEur: data.rates.EUR,
    };
};

export default function Dashboard() {
    const { t, i18n } = useTranslation();

    const {
        data: users = [],
        isLoading: usersLoading,
        isError: usersError,
    } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const {
        data: products = [],
        isLoading: productsLoading,
        isError: productsError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const {
        data: exchangeRates,
        isLoading: ratesLoading,
        isError: ratesError,
    } = useQuery({
        queryKey: ["exchangeRates"],
        queryFn: fetchExchangeRates,
    });

    const formatNumber = (number) =>
        new Intl.NumberFormat(i18n.language, { style: "decimal" }).format(number);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const dir = i18n.language === "ar" ? "rtl" : "ltr";

    return (
        <div className="p-6 text-white" dir={dir}>
            <h1 className="text-black text-2xl font-bold mb-6">👋 {t("dashboard.welcome")}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
                <div className="bg-gray-800 rounded-xl p-5 shadow-md flex items-center space-x-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                    <FaUsers className="text-4xl text-blue-400" />
                    <div>
                        <p className="text-gray-400">{t("dashboard.users")}</p>
                        <h2 className="text-2xl font-semibold">
                            {usersLoading ? "..." : usersError ? "خطأ" : formatNumber(users.length)}
                        </h2>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 shadow-md flex items-center space-x-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                    <FaBoxOpen className="text-4xl text-green-400" />
                    <div>
                        <p className="text-gray-400">{t("dashboard.products")}</p>
                        <h2 className="text-2xl font-semibold">
                            {productsLoading ? "..." : productsError ? "خطأ" : formatNumber(products.length)}
                        </h2>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 shadow-md flex items-center space-x-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                    <FaShoppingCart className="text-4xl text-yellow-400" />
                    <div>
                        <p className="text-gray-400">{t("dashboard.orders")}</p>
                        <h2 className="text-2xl font-semibold">{formatNumber(45)}</h2>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 shadow-md flex items-center space-x-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                    <FaDollarSign className="text-4xl text-red-400" />
                    <div>
                        <p className="text-gray-400">{t("dashboard.sales")}</p>
                        <h2 className="text-2xl font-semibold">{formatCurrency(3200)}</h2>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 shadow-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                    <div>
                        <p className="text-gray-400 mb-2">{t("dashboard.exchangeRates") || "أسعار العملات"}</p>
                        {ratesLoading ? (
                            <p className="text-gray-500">جارٍ التحميل...</p>
                        ) : ratesError ? (
                            <p className="text-red-500">فشل في جلب أسعار العملات</p>
                        ) : (
                            <div className="text-sm space-y-1">
                                <p>USD → TRY: <span className="font-semibold">{exchangeRates.usdToTry}</span></p>
                                <p>USD → EUR: <span className="font-semibold">{exchangeRates.usdToEur}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-5 text-gray-300">
                    {t("dashboard.salesChartTitle")}
                </h3>
                <SalesChart />
            </div>
        </div>
    );
}
