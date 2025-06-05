import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// إعداد التخزين
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + Date.now() + ext);
    },
});

// فلتر الملفات
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

const upload = multer({ storage, fileFilter });

// إنشاء منتج جديد مع صور
router.post('/', upload.array('images', 5), createProduct);

// جلب جميع المنتجات
router.get('/', getAllProducts);

// جلب منتج حسب ID
router.get('/:id', getProductById);

// تعديل منتج مع صور جديدة
router.put('/:id', upload.array('images', 5), updateProduct);

// حذف منتج
router.delete('/:id', deleteProduct);

export default router;
