import mongoose from 'mongoose';

// تعريف مخطط قاعدة البيانات للطلبات
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // المرجعية لنموذج المستخدم
        required: true, // حقل مطلوب
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // المرجعية لنموذج المنتج
            required: true, // حقل مطلوب
        },
        quantity: {
            type: Number,  // عدد المنتجات
            required: true, // حقل مطلوب
            min: 1,  // الحد الأدنى للعدد
        },
    }],
    totalAmount: {
        type: Number,  // المبلغ الإجمالي
        required: true, // حقل مطلوب
    },
    status: {
        type: String,  // حالة الطلب
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],  // القيم المسموح بها للحالة
        default: 'pending', // القيمة الافتراضية هي "معلق"
    },
    paymentMethod: {
        type: String,  // طريقة الدفع
        enum: ['cash', 'credit_card', 'paypal'],  // القيم المسموح بها
        required: true, // حقل مطلوب
    },
}, { timestamps: true });  // إضافة طابع زمني لإنشاء وتحديث السجلات

const Order = mongoose.model('Order', orderSchema);  // إنشاء النموذج بناءً على المخطط
export default Order;
