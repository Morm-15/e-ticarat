import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Login() {
  const { t, i18n } = useTranslation(); // تفعيل الترجمة

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
      setError(err.response?.data?.message || t("login.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // حفظ اللغة المحددة في التخزين المحلي
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-xl">
        {/* أزرار تغيير اللغة */}
        <div className="flex justify-end space-x-2">
          {["en", "ar", "fr", "tr"].map((lng) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                i18n.language === lng
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        {/* العنوان */}
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-2xl font-bold text-gray-700">
            {t("login.welcome")}
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600">
              {t("login.email")}
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">
              {t("login.password")}
            </label>
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
              <strong>{t("login.error")}:</strong> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? t("login.loading") : t("login.loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
