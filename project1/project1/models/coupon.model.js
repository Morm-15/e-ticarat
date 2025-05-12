import mongoose from 'mongoose';

// تعريف مخطط قاعدة البيانات للكوبونات
const couponSchema = new mongoose.Schema({
    code: {
        type: String,  // رمز الكوبون
        required: true,  // حقل مطلوب
        unique: true,  // يجب أن يكون فريدًا
    },
    discountPercentage: {
        type: Number,  // نسبة الخصم
        required: true,  // حقل مطلوب
        min: 1,  // الحد الأدنى لنسبة الخصم
        max: 100,  // الحد الأقصى لنسبة الخصم
    },
    validUntil: {
        type: Date,  // تاريخ انتهاء صلاحية الكوبون
        required: true,  // حقل مطلوب
    },
    isActive: {
        type: Boolean,  // حالة تفعيل الكوبون
        default: true,  // القيمة الافتراضية هي "مفعل"
    },
}, { timestamps: true });  // إضافة طابع زمني لإنشاء وتحديث السجلات

const Coupon = mongoose.model('Coupon', couponSchema);  // إنشاء النموذج بناءً على المخطط
export default Coupon;
