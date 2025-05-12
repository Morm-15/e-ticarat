import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// إنشاء منتج جديد
router.post('/', createProduct); // POST /api/products

// جلب جميع المنتجات
router.get('/', getAllProducts); // GET /api/products

// جلب منتج واحد حسب الـ ID
router.get('/:id', getProductById); // GET /api/products/:id

// تعديل منتج
router.put('/:id', updateProduct); // PUT /api/products/:id

// حذف منتج
router.delete('/:id', deleteProduct); // DELETE /api/products/:id

export default router;
