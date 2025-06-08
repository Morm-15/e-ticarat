// import React hooks
import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

// React Query imports
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ProductCard from "../../components/products/ProductCard.jsx";
import ProductDetailModal from "../../components/products/ProductDetailModal.jsx";
import ProductEditModal from "../../components/products/ProductEditModal.jsx";
import ProductDeleteModal from "../../components/products/ProductDeleteModal.jsx";

const ProductList = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // ✅ استخدام React Query لجلب المنتجات
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5000/api/products");
            return res.data;
        }
    });

    // ✅ حذف منتج باستخدام useMutation
    const deleteMutation = useMutation({
        mutationFn: (productId) =>
            axios.delete(`http://localhost:5000/api/products/${productId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            closeDeleteModal();
        },
        onError: (error) => {
            console.error(t("error.deletingProduct"), error);
            alert(t("error.deletingProductAlert"));
        },
    });

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

    const confirmDelete = () => {
        if (selectedProduct) {
            deleteMutation.mutate(selectedProduct._id);
        }
    };

    // ✅ تعديل منتج
    const editMutation = useMutation({
        mutationFn: ({ _id, formData }) =>
            axios.put(`http://localhost:5000/api/products/${_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            closeEditModal();
        },
        onError: (error) => {
            console.error(t("error.updatingProduct"), error);
            alert(t("error.updatingProductAlert"));
        },
    });

    const handleSaveEdit = ({ _id, formData }) => {
        editMutation.mutate({ _id, formData });
    };

    if (isLoading) {
        return <p className="text-center mt-10">{t("loading.products")}</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">{t("title.products")}</h2>
            {!Array.isArray(products) || products.length === 0 ? (
                <p>{t("message.no_products")}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
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
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={closeDetailModal}
                />
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
