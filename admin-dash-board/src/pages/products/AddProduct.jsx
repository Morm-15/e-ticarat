import React, { useState } from "react";
import axios from "axios";

const categories = ["giyim", "ayakkabı", "aksesuar"];
const subcategories = ["tişört", "pantolon", "bot", "çanta"];
const productTypes = ["erkek", "kadın", "çocuk", "unisex"];
const sizesOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const currencies = ["TL", "USD", "EUR"];

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        subcategory: "",
        productType: "",
        colors: [],  // مصفوفة ألوان
        sizes: [],   // مصفوفة مقاسات
        images: [],  // ملفات الصور (File objects)
        price: "",
        currency: "TL",
        discount: 0,
        stock: 0,
        description: "",
        isActive: true,
    });

    // إنشاء URLs معاينة للصور المختارة
    const [imagePreviews, setImagePreviews] = useState([]);

    // تحديث الحقول العادية والألوان والمقاسات
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox" && name !== "colors" && name !== "sizes") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name === "colors") {
            const colorsArray = value.split(",").map(c => c.trim()).filter(c => c !== "");
            setFormData((prev) => ({ ...prev, colors: colorsArray }));
        } else if (name === "sizes") {
            const sizesArray = value
                .split(",")
                .map(s => s.trim().toUpperCase())
                .filter(s => sizesOptions.includes(s));
            setFormData((prev) => ({ ...prev, sizes: sizesArray }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // معالجة رفع الصور وإنشاء معاينات
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...formData.images, ...files];
        setFormData(prev => ({ ...prev, images: newImages }));

        // إنشاء URLs للمعاينة
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    // حذف صورة
    const handleRemoveImage = (index) => {
        const newImages = [...formData.images];
        const newPreviews = [...imagePreviews];

        // تحرير الذاكرة الخاصة بـ URL.createObjectURL
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
    };

    // إرسال البيانات
    const handleSubmit = async (e) => {
        e.preventDefault();

        // تحقق من صحة القيم
        if (!categories.includes(formData.category)) {
            alert("الرجاء اختيار فئة صحيحة");
            return;
        }
        if (formData.subcategory && !subcategories.includes(formData.subcategory)) {
            alert("الرجاء اختيار فئة فرعية صحيحة أو تركها فارغة");
            return;
        }
        if (!productTypes.includes(formData.productType)) {
            alert("الرجاء اختيار نوع المنتج صحيح");
            return;
        }
        if (!currencies.includes(formData.currency)) {
            alert("الرجاء اختيار العملة بشكل صحيح");
            return;
        }
        if (formData.images.length === 0) {
            alert("يجب اختيار صورة واحدة على الأقل");
            return;
        }
        if (!formData.name.trim() || !formData.price) {
            alert("الاسم والسعر مطلوبان");
            return;
        }

        try {
            // تجهيز FormData للرفع
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("subcategory", formData.subcategory);
            data.append("productType", formData.productType);
            data.append("colors", JSON.stringify(formData.colors));
            data.append("sizes", JSON.stringify(formData.sizes));
            data.append("price", Number(formData.price));
            data.append("currency", formData.currency);
            data.append("discount", Number(formData.discount));
            data.append("stock", Number(formData.stock));
            data.append("description", formData.description);
            data.append("isActive", formData.isActive);

            // إضافة ملفات الصور
            formData.images.forEach((file, idx) => {
                data.append("images", file);
            });

            // إرسال البيانات مع هيدر النوع multipart/form-data
            await axios.post("http://localhost:5000/api/produits", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("تمت إضافة المنتج بنجاح");

            // إعادة تعيين الحقول
            setFormData({
                name: "",
                category: "",
                subcategory: "",
                productType: "",
                colors: [],
                sizes: [],
                images: [],
                price: "",
                currency: "TL",
                discount: 0,
                stock: 0,
                description: "",
                isActive: true,
            });

            // إعادة تعيين معاينات الصور
            setImagePreviews([]);

        } catch (error) {
            console.error("خطأ أثناء إضافة المنتج:", error);
            alert("حدث خطأ أثناء إضافة المنتج، حاول مرة أخرى");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-5xl"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">إضافة منتج</h2>

                <div className="grid grid-cols-3 gap-6">
                    {/* باقي الحقول كما هي */}
                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">اسم المنتج</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسم المنتج"
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">الفئة</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">اختر الفئة</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">الفئة الفرعية</label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">اختر الفئة الفرعية (اختياري)</option>
                            {subcategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">نوع المنتج</label>
                        <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">اختر نوع المنتج</option>
                            {productTypes.map(pt => (
                                <option key={pt} value={pt}>{pt}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">الألوان (مفصولة بفواصل)</label>
                        <input
                            type="text"
                            name="colors"
                            value={formData.colors.join(", ")}
                            onChange={handleChange}
                            placeholder="أدخل الألوان (مثل: أحمر, أزرق)"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">المقاسات (مفصولة بفواصل)</label>
                        <input
                            type="text"
                            name="sizes"
                            value={formData.sizes.join(",")}
                            onChange={handleChange}
                            placeholder="أدخل المقاسات (مثل: S, M, L)"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">السعر</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="أدخل السعر"
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">العملة</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {currencies.map(cur => (
                                <option key={cur} value={cur}>{cur}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">الخصم (%)</label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-blue-700">الكمية في المخزون</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-3">
                        <label className="block mb-2 font-semibold text-blue-700">الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="أدخل وصف المنتج"
                            rows={4}
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* حقل رفع الصور المعدل */}
                    <div className="col-span-3">
                        <label className="block mb-1 font-semibold text-blue-800">الصور (Images)</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                            {imagePreviews.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`صورة ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1"
                                        aria-label="حذف الصورة"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* زر رفع الصور */}
                            <label
                                htmlFor="imageUpload"
                                className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-400 rounded cursor-pointer text-blue-600 text-4xl font-bold hover:bg-blue-100 select-none"
                                title="اضغط لإضافة صورة"
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
                                required={imagePreviews.length === 0}
                            />
                        </div>
                    </div>

                    <div className="col-span-3 flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                        >
                            إضافة المنتج
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}