import mongoose from 'mongoose';

// تعريف مخطط قاعدة البيانات للسلة
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // المرجعية لنموذج المستخدم
        required: true,  // حقل مطلوب
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // المرجعية لنموذج المنتج
            required: true,  // حقل مطلوب
        },
        quantity: {
            type: Number,  // عدد المنتجات
            required: true,  // حقل مطلوب
            min: 1,  // الحد الأدنى للعدد
        },
    }],
}, { timestamps: true });  // إضافة طابع زمني لإنشاء وتحديث السجلات

const Cart = mongoose.model('Cart', cartSchema);  // إنشاء النموذج بناءً على المخطط
export default Cart;
