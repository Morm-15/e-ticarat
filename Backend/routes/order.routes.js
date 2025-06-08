import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from '../controllers/order.controller.js';

import { validateOrder } from '../middlewares/validateOrder.js'; // ← استيراد middleware

const router = express.Router();

// ✅ إنشاء طلب جديد مع التحقق من صحة البيانات
router.post('/', validateOrder, createOrder);

// 🟢 جلب جميع الطلبات
router.get('/', getAllOrders);

// 🔍 جلب طلب محدد بالمعرف
router.get('/:id', getOrderById);

// 🛠️ تحديث حالة الطلب
router.put('/:id', updateOrderStatus);

// ❌ حذف الطلب
router.delete('/:id', deleteOrder);

export default router;
