import React from 'react';

const ProductDeleteModal = ({ product, onClose, onConfirm }) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-xl border border-red-200 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-red-700 mb-4">تأكيد حذف المنتج</h2>
                <p className="mb-6">
                    هل أنت متأكد أنك تريد حذف المنتج: <strong>{product.name}</strong>؟
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDeleteModal;
