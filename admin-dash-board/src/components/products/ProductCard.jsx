import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();
  const isOutOfStock = product.stock === 0;

  const renderStars = () => {
    const stars = [];
    let rating = product.rating || 0;
    for (let i = 1; i <= 5; i++) {
      if (rating >= 1) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
      rating -= 1;
    }
    return stars;
  };

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? `http://localhost:5000/uploads/${encodeURIComponent(product.images[0])}`
      : "/fallback.jpg";

  return (
    <div
      className={`relative flex flex-col border rounded-lg p-4 bg-white shadow-md transition-transform hover:scale-105 ${
        isOutOfStock
          ? "bg-gray-800 cursor-not-allowed opacity-70"
          : "cursor-pointer"
      }`}
    >
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      <h3 className="font-semibold text-lg mb-1 text-gray-900">
        {product.name}
      </h3>

      <div className="flex items-center space-x-1 mb-2">{renderStars()}</div>

      <div className="text-gray-700 mb-3 font-medium">
        {(product.prices?.TL ?? 0).toFixed(2)} TL
        {product.discount > 0 && (
          <span className="ml-2 text-sm text-red-500 line-through">
            {(
              (product.prices?.TL ?? 0) *
              (1 + (product.discount ?? 0) / 100)
            ).toFixed(2)}{" "}
            TL
          </span>
        )}
      </div>

      <div className="flex justify-between mt-auto">
        <button
          onClick={() => !isOutOfStock && onEdit(product)}
          disabled={isOutOfStock}
          title={isOutOfStock ? t("product.not_editable") : t("actions.edit")}
          className={`text-blue-600 hover:text-blue-800 transition ${
            isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaEdit size={20} />
        </button>

        <button
          onClick={() => !isOutOfStock && onDelete(product)}
          disabled={isOutOfStock}
          title={
            isOutOfStock ? t("product.not_deletable") : t("actions.delete")
          }
          className={`text-red-600 hover:text-red-800 transition ${
            isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaTrash size={20} />
        </button>

        <button
          onClick={() => onView(product)}
          title={t("actions.view_details")}
          className={`text-gray-600 hover:text-gray-800 transition ${
            isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isOutOfStock}
        >
          <FaInfoCircle size={20} />
        </button>
      </div>

      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {t("product.out_of_stock")}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
