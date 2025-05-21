import { useState } from "react";
import { FaUsers, FaBoxOpen, FaBars, FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد دالة الترجمة

export default function Sidebar() {
  const { t } = useTranslation(); // الحصول على دالة الترجمة
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [activeMainLink, setActiveMainLink] = useState("");

  const location = useLocation();

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

  return (
    <aside
      className={`bg-gray-900 text-white h-screen p-4 transition-all duration-300 shadow-lg ${
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

      <nav className="sticky top-0 flex flex-col space-y-2 text-sm font-medium">
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
          {isSidebarOpen && <span>{t("sidebar.users")}</span>} {/* ترجمة */}
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
          {isSidebarOpen && <span>{t("sidebar.products")}</span>} {/* ترجمة */}
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
              {t("sidebar.productsList")} {/* ترجمة */}
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
              {t("sidebar.addProduct")} {/* ترجمة */}
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}
