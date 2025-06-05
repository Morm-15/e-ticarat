import { useState } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaBars,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [activeMainLink, setActiveMainLink] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // حالة عرض نافذة التأكيد

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleButtonClick = () => {
    setIsActive(!isActive);
  };

  const handleMainNavClick = (linkName) => {
    setActiveMainLink(linkName);
    if (linkName !== "products") {
      setIsProductMenuOpen(false);
    }
  };

  const toggleProductMenu = () => {
    setIsProductMenuOpen((prev) => !prev);
    setActiveMainLink("products");
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside
        className={`sticky top-0 bg-gray-900 text-white h-screen p-4 transition-all duration-300 shadow-lg flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* زر القائمة */}
        <div
          className="flex justify-center items-center mb-6 cursor-pointer"
          onClick={toggleSidebar}
          onMouseEnter={(e) => e.target.classList.add("scale-110")}
          onMouseLeave={(e) => e.target.classList.remove("scale-110")}
          style={{ transition: "transform 0.3s ease" }}
        >
          <FaBars
            size={24}
            className={`transition-all duration-300 ${
              isActive ? "text-blue-500" : "text-white"
            }`}
            onClick={handleButtonClick}
          />
        </div>

        {/* قائمة التنقل */}
        <nav className="flex flex-col space-y-2 text-sm font-medium flex-grow overflow-auto">
          {/* المستخدمون */}
          <NavLink
            to="/dashboard/users"
            className={`flex items-center space-x-3 p-2 rounded-lg transition duration-300 ${
              activeMainLink === "users"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleMainNavClick("users")}
          >
            <FaUsers className="text-lg" />
            {isSidebarOpen && <span>{t("sidebar.users")}</span>}
          </NavLink>

          {/* المنتجات */}
          <button
            onClick={toggleProductMenu}
            className={`flex items-center space-x-3 p-2 w-full rounded-lg transition duration-300 ${
              activeMainLink === "products"
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <FaBoxOpen className="text-lg" />
            {isSidebarOpen && <span>{t("sidebar.products")}</span>}
            {isSidebarOpen && (
              <FaChevronDown
                className={`ml-auto transition-transform ${
                  isProductMenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* القائمة الفرعية للمنتجات */}
          {isProductMenuOpen && isSidebarOpen && (
            <div className="ml-6 mt-1 flex flex-col space-y-2 border-l border-gray-600 pl-4">
              <NavLink
                to="/dashboard/products/list"
                className={({ isActive }) =>
                  `transition duration-200 rounded px-2 py-1 ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                {t("sidebar.productsList")}
              </NavLink>
              <NavLink
                to="/dashboard/products/add"
                className={({ isActive }) =>
                  `transition duration-200 rounded px-2 py-1 ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                {t("sidebar.addProduct")}
              </NavLink>
            </div>
          )}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="mt-auto">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center space-x-3 p-2 w-full rounded-lg transition duration-300 hover:bg-red-600 text-gray-300 hover:text-white"
          >
            <FaSignOutAlt className="text-lg" />
            {isSidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* نافذة تأكيد تسجيل الخروج */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <p className="text-lg font-medium mb-4">{t("logoutConfirm")}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
