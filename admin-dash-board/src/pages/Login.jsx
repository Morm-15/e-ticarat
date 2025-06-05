import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import logo from "../assets/Moon_tc2.png";

function Login() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("error_message"));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* زرار تغيير اللغة */}
      <div className="flex gap-2 absolute top-4 right-4">
        <button
          onClick={() => changeLanguage("ar")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          AR
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("fr")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          FR
        </button>
        <button
          onClick={() => changeLanguage("tr")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          TR
        </button>
      </div>

      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-2xl font-bold text-gray-700">
            {t("welcome_admin")}
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600">{t("email")}</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">{t("password")}</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mt-2 bg-red-100 text-red-600 border-l-4 border-red-600 p-3 rounded-lg">
              <strong>{t("error_title")}</strong> {t("error_message")}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
