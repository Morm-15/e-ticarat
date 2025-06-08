import Order from '../models/order.model.js';

// إنشاء طلب جديد
export const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطلب', error });
    }
};

// جلب جميع الطلبات
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات', error });
    }
};

// جلب طلب واحد عبر المعرف
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.product');
        if (!order) {
            return res.status(404).json({ message: 'الطلب غير موجود' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلب', error });
    }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'الطلب غير موجود' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث الطلب', error });
    }
};

// حذف الطلب
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'الطلب غير موجود' });
        }
        res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب', error });
    }
};
