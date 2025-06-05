import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ProductEditModal = ({ product, onClose, onSave }) => {
  const { t } = useTranslation();

  const [formState, setFormState] = useState({
    name: product.name || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    productType: product.productType || "",
    prices: product.prices || { USD: 0, EUR: 0, TL: 0 },
    stock: product.stock || 0,
    description: product.description || "",
    sizes: product.sizes || [],
    colors: product.colors || [],
    discount: product.discount || 0,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (product.images && Array.isArray(product.images)) {
      setExistingImages(product.images);
      setImagePreviews(product.images);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("prices.")) {
      const currency = name.split(".")[1];
      setFormState((prev) => ({
        ...prev,
        prices: {
          ...prev.prices,
          [currency]: Number(value),
        },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizesChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      sizes: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleColorsChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      colors: e.target.value.split(",").map((c) => c.trim()),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const removed = imagePreviews[index];

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (existingImages.includes(removed)) {
      setExistingImages((prev) => prev.filter((img) => img !== removed));
    } else {
      const newIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

    existingImages.forEach((img) => {
      formData.append("existingImages[]", img);
    });

    images.forEach((img) => formData.append("images", img));

    onSave({ _id: product._id, formData });
  };

  return (
    <div className="fixed inset-0 bg-white-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white/80 p-8 rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] border border-blue-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          {t("editProduct")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder={t("productName")}
            className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="category"
            value={formState.category}
            onChange={handleChange}
            placeholder={t("category")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <input
            name="subcategory"
            value={formState.subcategory}
            onChange={handleChange}
            placeholder={t("subcategory")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <input
            name="productType"
            value={formState.productType}
            onChange={handleChange}
            placeholder={t("productType")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder={t("description")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <input
            name="stock"
            type="number"
            value={formState.stock}
            onChange={handleChange}
            placeholder={t("stock")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <input
            name="discount"
            type="number"
            value={formState.discount}
            onChange={handleChange}
            placeholder={t("discountPercent")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₺
              </span>
              <input
                name="prices.TL"
                type="number"
                value={formState.prices.TL}
                onChange={handleChange}
                placeholder={t("priceTL")}
                className="w-full border p-2 pl-8 rounded-lg"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                name="prices.USD"
                type="number"
                value={formState.prices.USD}
                onChange={handleChange}
                placeholder={t("priceUSD")}
                className="w-full border p-2 pl-8 rounded-lg"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                €
              </span>
              <input
                name="prices.EUR"
                type="number"
                value={formState.prices.EUR}
                onChange={handleChange}
                placeholder={t("priceEUR")}
                className="w-full border p-2 pl-8 rounded-lg"
              />
            </div>
          </div>

          <input
            onChange={handleSizesChange}
            value={formState.sizes.join(",")}
            placeholder={t("sizesExample")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />
          <input
            onChange={handleColorsChange}
            value={formState.colors.join(",")}
            placeholder={t("colorsExample")}
            className="w-full border border-blue-300 p-3 rounded-xl"
          />

          <div className="col-span-3">
            <label className="block mb-1 font-semibold text-blue-800">
              {t("images")}
            </label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imagePreviews.map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${t("image")} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1"
                    aria-label={t("removeImage")}
                  >
                    ×
                  </button>
                </div>
              ))}

              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-400 rounded cursor-pointer text-blue-600 text-4xl font-bold hover:bg-blue-100 select-none"
                title={t("clickToAddImage")}
              >
                +
              </label>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              💾 {t("common.save")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md"
            >
              ❌ {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
