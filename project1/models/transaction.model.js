import mongoose from 'mongoose';

// تعريف مخطط قاعدة البيانات للمعاملات
const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',  // المرجعية لنموذج الطلب
        required: true,  // حقل مطلوب
    },
    amount: {
        type: Number,  // المبلغ المدفوع
        required: true,  // حقل مطلوب
    },
    paymentMethod: {
        type: String,  // طريقة الدفع
        enum: ['cash', 'credit_card', 'paypal'],  // القيم المسموح بها
        required: true,  // حقل مطلوب
    },
    status: {
        type: String,  // حالة المعاملة
        enum: ['pending', 'completed', 'failed'],  // القيم المسموح بها
        required: true,  // حقل مطلوب
    },
}, { timestamps: true });  // إضافة طابع زمني لإنشاء وتحديث السجلات

const Transaction = mongoose.model('Transaction', transactionSchema);  // إنشاء النموذج بناءً على المخطط
export default Transaction;
