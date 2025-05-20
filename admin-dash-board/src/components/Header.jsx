import { useState, useEffect } from "react";
import { FiGlobe, FiDollarSign } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function Header() {
  const { i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language.toUpperCase() || "EN"
  );
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const languages = ["AR", "EN", "FR", "TR"];
  const currencies = ["USD", "EUR", "TRY", "SAR"];

  // تغيير اتجاه الصفحة حسب اللغة
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    setShowLangDropdown(false);
  };

  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-gradient-to-r from-gray-100 via-white to-gray-100 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/path-to-your-logo.png" alt="Logo" className="w-12 h-12" />
      </div>

      {/* اللغة والعملة */}
      <div className="flex items-center gap-4 relative">
        {/* اللغة */}
        <div
          className="relative"
          onMouseEnter={() => setShowLangDropdown(true)}
          onMouseLeave={() =>
            setTimeout(() => setShowLangDropdown(false), 1000)
          }
        >
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-700 transition duration-300 font-medium">
            <FiGlobe />
            <span>{selectedLanguage}</span>
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-md z-50 min-w-[100px]">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition duration-200 ${
                    selectedLanguage === lang
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : ""
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* العملة */}
        <div
          className="relative"
          onMouseEnter={() => setShowCurrencyDropdown(true)}
          onMouseLeave={() =>
            setTimeout(() => setShowCurrencyDropdown(false), 1000)
          }
        >
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-700 transition duration-300 font-medium">
            <FiDollarSign />
            <span>{selectedCurrency}</span>
          </button>
          {showCurrencyDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-md z-50 min-w-[100px]">
              {currencies.map((cur) => (
                <button
                  key={cur}
                  onClick={() => {
                    setSelectedCurrency(cur);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition duration-200 ${
                    selectedCurrency === cur
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : ""
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
