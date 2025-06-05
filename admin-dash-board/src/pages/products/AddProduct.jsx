import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddProduct = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // حالة النموذج
  const [formState, setFormState] = useState({
    name: "",
    category: "",
    subcategory: "",
    productType: "",
    prices: { USD: 0, EUR: 0, TL: 0 },
    stock: 0,
    description: "",
    sizes: [],
    colors: [],
    discount: 0,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // التعامل مع تغير القيم في الحقول العادية وأسعار العملات
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("prices.")) {
      const currency = name.split(".")[1];
      setFormState((prev) => ({
        ...prev,
        prices: { ...prev.prices, [currency]: Number(value) },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  // معالجة تغير قيم الأحجام (sizes)
  const handleSizesChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      sizes: e.target.value
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size !== ""),
    }));
  };

  // معالجة تغير قيم الألوان (colors)
  const handleColorsChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      colors: e.target.value
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== ""),
    }));
  };

  // رفع الصور وعرض المعاينة
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // حذف صورة من المعاينة
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ارسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("category", formState.category);
      formData.append("subcategory", formState.subcategory);
      formData.append("productType", formState.productType);
      formData.append("description", formState.description);
      formData.append("discount", formState.discount);
      formData.append("stock", formState.stock);
      formData.append("prices", JSON.stringify(formState.prices));
      formData.append("sizes", formState.sizes.join(","));
      formData.append("colors", formState.colors.join(","));

      images.forEach((image) => {
        formData.append("images", image);
      });

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(t("messages.product_added_success"));
      navigate("/dashboard/products/list");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(t("messages.error_adding_product"));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {t("product.addTitle")}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        noValidate
      >
        {/* اسم المنتج */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.name")}
          </label>
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />
        </div>

        {/* التصنيف */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.category")}
          </label>
          <input
            name="category"
            value={formState.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />
        </div>

        {/* التصنيف الفرعي */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.subcategory")}
          </label>
          <input
            name="subcategory"
            value={formState.subcategory}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* نوع المنتج */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.productType")}
          </label>
          <input
            name="productType"
            value={formState.productType}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* الوصف */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.description")}
          </label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            rows={4}
          />
        </div>

        {/* المخزون */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.stock")}
          </label>
          <input
            name="stock"
            type="number"
            value={formState.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            min={0}
          />
        </div>

        {/* الخصم */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.discount")}
          </label>
          <input
            name="discount"
            type="number"
            value={formState.discount}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            min={0}
            max={100}
          />
        </div>

        {/* أسعار العملات */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.priceTL")}
          </label>
          <input
            name="prices.TL"
            type="number"
            value={formState.prices.TL}
            onChange={handleChange}
            placeholder="₺"
            className="w-full border p-3 rounded-xl"
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.priceUSD")}
          </label>
          <input
            name="prices.USD"
            type="number"
            value={formState.prices.USD}
            onChange={handleChange}
            placeholder="$"
            className="w-full border p-3 rounded-xl"
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.priceEUR")}
          </label>
          <input
            name="prices.EUR"
            type="number"
            value={formState.prices.EUR}
            onChange={handleChange}
            placeholder="€"
            className="w-full border p-3 rounded-xl"
            min={0}
          />
        </div>

        {/* الأحجام */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.sizesHint")}
          </label>
          <input
            type="text"
            onChange={handleSizesChange}
            placeholder={t("form.sizesPlaceholder")}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* الألوان */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.colorsHint")}
          </label>
          <input
            type="text"
            onChange={handleColorsChange}
            placeholder={t("form.colorsPlaceholder")}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* رفع الصور */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">
            {t("form.uploadImages")}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* عرض صور المعاينة مع زر الحذف */}
        {imagePreviews.length > 0 && (
          <div className="md:col-span-2 flex flex-wrap gap-4 mt-4">
            {imagePreviews.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt={t("form.imagePreviewAlt")}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl"
                  aria-label={t("form.removeImage")}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* زر الإرسال */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            {t("form.submitButton")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
