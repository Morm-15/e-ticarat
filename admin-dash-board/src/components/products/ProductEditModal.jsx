import React, { useState } from 'react';

const categories = ['giyim', 'ayakkabı', 'aksesuar'];
const subcategories = ['tişört', 'pantolon', 'bot', 'çanta'];
const productTypes = ['erkek', 'kadın', 'çocuk', 'unisex'];
const sizesEnum = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const currencies = ['USD', 'EUR', 'TL'];

const ProductEditModal = ({ product, onClose, onSave }) => {
    const [name, setName] = useState(product.name || '');
    const [category, setCategory] = useState(product.category || '');
    const [subcategory, setSubcategory] = useState(product.subcategory || '');
    const [productType, setProductType] = useState(product.productType || '');
    const [colors, setColors] = useState(product.colors ? product.colors.join(',') : '');
    const [sizes, setSizes] = useState(product.sizes || []);
    const [images, setImages] = useState(product.images || []);
    const [prices, setPrices] = useState({
        USD: product.prices?.USD ?? 0,
        EUR: product.prices?.EUR ?? 0,
        TL: product.prices?.TL ?? 0,
    });
    const [discount, setDiscount] = useState(product.discount || 0);
    const [stock, setStock] = useState(product.stock || 0);
    const [description, setDescription] = useState(product.description || '');
    const [isActive, setIsActive] = useState(product.isActive || false);

    // تحميل الصور وتحويلها لقاعدة64
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = null;
    };

    // حذف صورة معينة من القائمة
    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // تحديث الأسعار بناءً على العملة والقيمة
    const handlePriceChange = (currency, value) => {
        setPrices(prev => ({
            ...prev,
            [currency]: value,
        }));
    };

    // تغيير حجم محدد (يضيف أو يحذف حسب الاختيار)
    const toggleSize = (size) => {
        setSizes(prev => {
            if (prev.includes(size)) {
                return prev.filter(s => s !== size);
            } else {
                return [...prev, size];
            }
        });
    };

    // حفظ التعديلات
    const handleSubmit = (e) => {
        e.preventDefault();

        // تحويل الألوان من نص إلى مصفوفة
        const colorsArr = colors.split(',').map(c => c.trim()).filter(Boolean);

        onSave({
            ...product,
            name,
            category,
            subcategory,
            productType,
            colors: colorsArr,
            sizes,
            images,
            prices: {
                USD: parseFloat(prices.USD) || 0,
                EUR: parseFloat(prices.EUR) || 0,
                TL: parseFloat(prices.TL) || 0,
            },
            discount: parseFloat(discount) || 0,
            stock: parseInt(stock, 10) || 0,
            description,
            isActive,
        });
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-blue-100/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-xl w-full relative shadow-2xl border border-blue-200 overflow-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 text-3xl font-bold transition-colors duration-300"
                    onClick={onClose}
                    aria-label="إغلاق النافذة"
                >
                    &#10005;
                </button>

                <h3 className="text-3xl font-extrabold mb-6 text-blue-900">تعديل المنتج</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">اسم المنتج</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الفئة</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">اختر فئة</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الفئة الفرعية</label>
                        <select
                            value={subcategory}
                            onChange={e => setSubcategory(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">اختر فئة فرعية</option>
                            {subcategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">نوع المنتج</label>
                        <select
                            value={productType}
                            onChange={e => setProductType(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">اختر النوع</option>
                            {productTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الألوان (افصل بينهم بفواصل)</label>
                        <input
                            type="text"
                            value={colors}
                            onChange={e => setColors(e.target.value)}
                            placeholder="أحمر, أزرق, أخضر"
                            className="w-full border border-blue-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">المقاسات</label>
                        <div className="flex flex-wrap gap-2">
                            {sizesEnum.map(size => (
                                <label key={size} className={`cursor-pointer px-3 py-1 border rounded ${sizes.includes(size) ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border-blue-500'}`}>
                                    <input
                                        type="checkbox"
                                        checked={sizes.includes(size)}
                                        onChange={() => toggleSize(size)}
                                        className="hidden"
                                    />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الصور</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-2"
                        />
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-auto border border-blue-200 rounded p-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={img} alt={`صورة ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                        aria-label="حذف الصورة"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الأسعار</label>
                        <div className="grid grid-cols-3 gap-4">
                            {currencies.map(cur => (
                                <div key={cur}>
                                    <label className="block mb-1 font-semibold text-blue-700">{cur}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={prices[cur]}
                                        onChange={e => handlePriceChange(cur, e.target.value)}
                                        className="w-full border border-blue-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الخصم (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">المخزون</label>
                        <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold text-blue-800">الوصف</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-blue-300 rounded px-3 py-2"
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            id="isActive"
                        />
                        <label htmlFor="isActive" className="font-semibold text-blue-800">المنتج مفعل</label>
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
