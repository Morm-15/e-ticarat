import mongoose from 'mongoose';
import Product from '../models/product.model.js';

// قوائم السماح (عدل حسب حاجتك)
const allowedCategories = ['giyim', 'ayakkabı', 'aksesuar'];
const allowedSubcategories = ['tişört', 'pantolon', 'bot', 'çanta'];
const allowedTypes = ['erkek', 'kadın', 'çocuk', 'unisex'];

// إنشاء منتج جديد
export const createProduct = async (req, res) => {
    try {
        const { category, subcategory, productType, prices, sizes } = req.body;

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ message: '❌ Geçersiz kategori' });
        }
        if (subcategory && !allowedSubcategories.includes(subcategory)) {
            return res.status(400).json({ message: '❌ Geçersiz alt kategori' });
        }
        if (!allowedTypes.includes(productType)) {
            return res.status(400).json({ message: '❌ Geçersiz ürün türü' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: '❌ En az bir ürün resmi gereklidir' });
        }

        let sizesArray = [];
        if (sizes) {
            if (typeof sizes === 'string') {
                sizesArray = sizes.split(',').map(s => s.trim());
            } else if (Array.isArray(sizes)) {
                sizesArray = sizes;
            } else {
                return res.status(400).json({ message: '❌ Geçersiz beden formatı' });
            }
        }

        const images = req.files.map((file) => file.filename);

        let pricesObj = { USD: 0, EUR: 0, TL: 0 };
        if (prices) {
            try {
                pricesObj = JSON.parse(prices);
            } catch {
                return res.status(400).json({ message: '❌ Geçersiz fiyat formatı' });
            }
        }

        const newProduct = new Product({
            ...req.body,
            images,
            prices: pricesObj,
            sizes: sizesArray,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: '✅ Ürün başarıyla oluşturuldu',
            product: savedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün oluşturulurken bir hata oluştu',
            error: error.message,
        });
    }
};

// جلب جميع المنتجات
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürünler alınırken hata oluştu',
            error: error.message,
        });
    }
};

// جلب منتج واحد حسب الـ ID
export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün getirilirken hata oluştu',
            error: error.message,
        });
    }
};

// تعديل منتج مع إمكانية رفع صور جديدة
export const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const { category, subcategory, productType, prices, sizes } = req.body;

        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({ message: '❌ Geçersiz kategori' });
        }
        if (subcategory && !allowedSubcategories.includes(subcategory)) {
            return res.status(400).json({ message: '❌ Geçersiz alt kategori' });
        }
        if (productType && !allowedTypes.includes(productType)) {
            return res.status(400).json({ message: '❌ Geçersiz ürün türü' });
        }

        const updateData = { ...req.body };

        if (prices) {
            try {
                updateData.prices = JSON.parse(prices);
            } catch {
                return res.status(400).json({ message: '❌ Geçersiz fiyat formatı' });
            }
        }

        if (sizes) {
            if (typeof sizes === 'string') {
                updateData.sizes = sizes.split(',').map(s => s.trim());
            } else if (Array.isArray(sizes)) {
                updateData.sizes = sizes;
            } else {
                return res.status(400).json({ message: '❌ Geçersiz beden formatı' });
            }
        }

        if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => file.filename);
            updateData.images = images;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı' });
        }

        res.status(200).json({
            message: '✅ Ürün başarıyla güncellendi',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün güncellenirken bir hata oluştu',
            error: error.message,
        });
    }
};

// حذف منتج
export const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: '❌ Geçersiz ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: '❌ Ürün bulunamadı' });
        }

        res.status(200).json({
            message: '✅ Ürün başarıyla silindi',
            product: deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Ürün silinirken bir hata oluştu',
            error: error.message,
        });
    }
};
