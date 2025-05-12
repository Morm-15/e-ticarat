import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js'; // استيراد الاتصال من ملف db.js
import productRoutes from './routes/product.routes.js'; // استيراد مسارات المنتجات
import userRoutes from './routes/user.routes.js'; // استيراد مسارات المستخدمين

// تحميل متغيرات البيئة
dotenv.config();

// التحقق من متغيرات البيئة الأساسية
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the .env file');
    process.exit(1); // إنهاء التطبيق إذا كانت المتغيرات البيئية غير موجودة
}

if (!process.env.PORT) {
    console.warn('PORT is not defined in the .env file, using default value 5000');
}

// إنشاء تطبيق Express
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// مسار تجريبي
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API!' });
});

// مسارات المنتجات
app.use('/api/products', productRoutes); // ربط مسار المنتجات

// مسارات المستخدمين
app.use('/api/users', userRoutes); // ربط مسار المستخدمين

// بدء الخادم بعد التأكد من الاتصال بقاعدة البيانات
const startServer = async () => {
    try {
        await connectDB(); // محاولة الاتصال بقاعدة البيانات
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // إنهاء التطبيق في حال فشل الاتصال
    }
};

startServer();
