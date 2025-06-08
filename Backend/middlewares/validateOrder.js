// middlewares/validateOrder.js

import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const validateOrder = async (req, res, next) => {
    try {
        const { user, products, totalAmount, paymentMethod } = req.body;

        if (!user) {
            return res.status(400).json({ message: 'معرّف المستخدم (user) مطلوب' });
        }

        // التحقق من وجود المستخدم في قاعدة البيانات
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'يجب إدخال منتج واحد على الأقل في الطلب' });
        }

        for (const item of products) {
            if (!item.product || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: 'كل منتج يجب أن يحتوي على معرّف المنتج (product) وكمية لا تقل عن 1'
                });
            }

            // التحقق من وجود المنتج
            const existingProduct = await Product.findById(item.product);
            if (!existingProduct) {
                return res.status(404).json({ message: `المنتج بمعرّف ${item.product} غير موجود` });
            }
        }

        if (typeof totalAmount !== 'number' || totalAmount <= 0) {
            return res.status(400).json({ message: 'المبلغ الإجمالي (totalAmount) يجب أن يكون رقمًا موجبًا' });
        }

        const allowedPayments = ['cash', 'credit_card', 'paypal'];
        if (!allowedPayments.includes(paymentMethod)) {
            return res.status(400).json({ message: 'طريقة الدفع غير صالحة، القيم المسموحة: cash, credit_card, paypal' });
        }

        next(); // إذا كانت جميع التحققات ناجحة، انتقل إلى الخطوة التالية (createOrder)
    } catch (error) {
        console.error('Error in validateOrder middleware:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء التحقق من البيانات' });
    }
};
