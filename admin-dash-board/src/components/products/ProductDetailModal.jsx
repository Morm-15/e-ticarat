import React from 'react';

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;  // حماية في حالة عدم وجود المنتج

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-blue-100/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-xl w-full relative shadow-2xl border border-blue-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 text-3xl font-bold transition-colors duration-300"
                    onClick={onClose}
                    aria-label="إغلاق النافذة"
                >
                    &#10005;
                </button>

                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-72 object-cover rounded-xl mb-6 shadow-md border border-blue-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-72 flex items-center justify-center bg-gray-200 rounded-xl mb-6">
                        <p className="text-gray-500">لا توجد صورة متاحة</p>
                    </div>
                )}

                <h3 className="text-3xl font-extrabold mb-4 text-blue-900">{product.name}</h3>
                <p className="mb-6 text-blue-700 leading-relaxed">{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>

                <div className="space-y-3 text-blue-800 font-medium">
                    <p><span className="font-semibold text-blue-900">السعر (TRY):</span> {product.prices?.TL?.toFixed(2) || '0.00'} ₺</p>
                    <p><span className="font-semibold text-blue-900">التصنيف:</span> {product.category} - {product.subcategory || '-'}</p>
                    <p><span className="font-semibold text-blue-900">النوع:</span> {product.productType}</p>
                    <p><span className="font-semibold text-blue-900">الألوان:</span> {product.colors && product.colors.length > 0 ? product.colors.join(', ') : '-'}</p>
                    <p><span className="font-semibold text-blue-900">المقاسات:</span> {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : '-'}</p>
                    <p><span className="font-semibold text-blue-900">المخزون:</span> {product.stock}</p>
                    <p><span className="font-semibold text-blue-900">التقييم:</span> {product.rating?.toFixed(1) || '0'} / 5</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
