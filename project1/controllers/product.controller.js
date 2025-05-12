// controllers/product.controller.js

import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// Geçerli kategoriler
const allowedCategories = ['giyim', 'ayakkabı', 'aksesuar'];
const allowedSubcategories = ['tişört', 'pantolon', 'bot', 'çanta'];
const allowedTypes = ['erkek', 'kadın', 'çocuk', 'unisex'];

// Yeni ürün oluşturma
export const createProduct = async (req, res) => {
    try {
        const { category, subcategory, productType } = req.body;

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ message: '❌ Geçersiz kategori' });
        }
        if (subcategory && !allowedSubcategories.includes(subcategory)) {
            return res.status(400).json({ message: '❌ Geçersiz alt kategori' });
        }
        if (!allowedTypes.includes(productType)) {
            return res.status(400).json({ message: '❌ Geçersiz ürün türü' });
        }

        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: '✅ Ürün başarıyla oluşturuldu',
            product: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün oluşturulurken bir hata oluştu',
            error: error.message
        });
    }
};

// Tüm ürünleri getirme
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: '✅ Ürünler başarıyla getirildi',
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürünleri getirirken bir hata oluştu',
            error: error.message
        });
    }
};

// ID'ye göre tek bir ürün getirme
export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı' });
        }

        res.status(200).json({
            message: '✅ Ürün başarıyla getirildi',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün getirilirken bir hata oluştu',
            error: error.message
        });
    }
};

// Ürün güncelleme
export const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const { category, subcategory, productType } = req.body;

        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({ message: '❌ Geçersiz kategori' });
        }
        if (subcategory && !allowedSubcategories.includes(subcategory)) {
            return res.status(400).json({ message: '❌ Geçersiz alt kategori' });
        }
        if (productType && !allowedTypes.includes(productType)) {
            return res.status(400).json({ message: '❌ Geçersiz ürün türü' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı' });
        }

        res.status(200).json({
            message: '✅ Ürün başarıyla güncellendi',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün güncellenirken bir hata oluştu',
            error: error.message
        });
    }
};

// Ürün silme
export const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı veya daha önce silindi' });
        }

        res.status(200).json({
            message: '✅ Ürün başarıyla silindi',
            product: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün silinirken bir hata oluştu',
            error: error.message
        });
    }
};
