import React from "react";
import { useTranslation } from "react-i18next";

const ProductDetailModal = ({ product, onClose }) => {
  const { t } = useTranslation();

  if (!product) return null; // حماية في حالة عدم وجود المنتج

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-blue-100/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-xl w-full relative shadow-2xl border border-blue-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 text-3xl font-bold transition-colors duration-300"
          onClick={onClose}
          aria-label={t("modal.close", "Close modal")}
        >
          &#10005;
        </button>

        {product.images && product.images.length > 0 ? (
          <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(
              product.images[0]
            )}`}
            alt={product.name}
            className="w-full h-72 object-cover rounded-xl mb-6 shadow-md border border-blue-100"
            loading="lazy"
          />
        ) : (
          <img
            src="/fallback.jpg"
            alt={t("modal.noImage", "No image available")}
            className="w-full h-72 object-cover rounded-xl mb-6 shadow-md border border-gray-200"
            loading="lazy"
          />
        )}

        <h3 className="text-3xl font-extrabold mb-4 text-blue-900">
          {product.name}
        </h3>
        <p className="mb-6 text-blue-700 leading-relaxed">
          {product.description ||
            t(
              "modal.noDescription",
              "No description available for this product."
            )}
        </p>

        <div className="space-y-3 text-blue-800 font-medium">
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.priceTRY", "Price (TRY):")}
            </span>{" "}
            {product.prices?.TL?.toFixed(2) || "0.00"} ₺
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.category", "Category:")}
            </span>{" "}
            {product.category} - {product.subcategory || "-"}
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.productType", "Product Type:")}
            </span>{" "}
            {product.productType}
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.colors", "Colors:")}
            </span>{" "}
            {product.colors && product.colors.length > 0
              ? product.colors.join(", ")
              : "-"}
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.sizes", "Sizes:")}
            </span>{" "}
            {product.sizes && product.sizes.length > 0
              ? product.sizes.join(", ")
              : "-"}
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.stock", "Stock:")}
            </span>{" "}
            {product.stock}
          </p>
          <p>
            <span className="font-semibold text-blue-900">
              {t("modal.rating", "Rating:")}
            </span>{" "}
            {product.rating?.toFixed(1) || "0"} / 5
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
