import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/products/ProductCard.jsx';
import ProductDetailModal from '../../components/products/ProductDetailModal.jsx';
import ProductEditModal from '../../components/products/ProductEditModal.jsx';
import ProductDeleteModal from '../../components/products/ProductDeleteModal.jsx';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleView = (product) => {
        setSelectedProduct(product);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await axios.delete(`http://localhost:5000/api/products/${selectedProduct._id}`);
            setProducts(prev => prev.filter(p => p._id !== selectedProduct._id));
            closeDeleteModal();
        } catch (error) {
            console.error("خطأ أثناء حذف المنتج:", error);
            alert("حدث خطأ أثناء الحذف.");
        }
    };

    const handleSaveEdit = async (updatedProduct) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${updatedProduct._id}`, updatedProduct);
            setProducts((prev) =>
                prev.map((prod) => (prod._id === updatedProduct._id ? updatedProduct : prod))
            );
            closeEditModal();
        } catch (error) {
            console.error('خطأ أثناء تحديث المنتج:', error);
            alert('حدث خطأ أثناء حفظ التعديلات.');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            const prods = response.data?.products || [];
            setProducts(prods);
        } catch (error) {
            console.error("خطأ في جلب المنتجات:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">جاري تحميل المنتجات...</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">المنتجات</h2>
            {(!Array.isArray(products) || products.length === 0) ? (
                <p>لا توجد منتجات لعرضها</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}

            {isDetailModalOpen && selectedProduct && (
                <ProductDetailModal product={selectedProduct} onClose={closeDetailModal} />
            )}

            {isEditModalOpen && selectedProduct && (
                <ProductEditModal
                    product={selectedProduct}
                    onClose={closeEditModal}
                    onSave={handleSaveEdit}
                />
            )}

            {isDeleteModalOpen && selectedProduct && (
                <ProductDeleteModal
                    product={selectedProduct}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default ProductList;
