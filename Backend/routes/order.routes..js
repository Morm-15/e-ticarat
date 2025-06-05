import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';  // تأكد من أن فقط الإدمن يمكنه حذف الطلبات أو تحديث الحالة

const router = express.Router();

// مسار لإنشاء طلب جديد
router.post('/', protect, createOrder);

// مسار للحصول على كل الطلبات (فقط للإدمن)
router.get('/', protect, admin, getOrders);

// مسار للحصول على طلب معين بواسطة الـ ID
router.get('/:id', protect, getOrderById);

// مسار لتحديث حالة الطلب (فقط للإدمن)
router.put('/:id/status', protect, admin, updateOrderStatus);

// مسار لحذف طلب (فقط للإدمن)
router.delete('/:id', protect, admin, deleteOrder);

export default router;
