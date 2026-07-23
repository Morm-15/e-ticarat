import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { handleWebhook } from './controllers/payment.controller.js';

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the .env file');
    process.exit(1);
}

const app = express();

// ✅ إعداد التخزين للصور - استخدم /tmp في production (Render ephemeral FS)
const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

// ✅ إعداد CORS - لا يمكن الجمع بين origin:'*' و credentials:true
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean); // إزالة القيم الفارغة

app.use(cors({
    origin: (origin, callback) => {
        // السماح للطلبات بدون origin (مثل Postman أو curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// ✅ إعدادات الحماية
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ✅ Webhook الخاص بـ Stripe يجب أن يكون هنا قبل express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ توفير الوصول لملفات الصور بشكل صحيح
app.use('/uploads', (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    next();
}, express.static(path.join(path.resolve(), uploadsDir)));

// ✅ مسار رئيسي للاختبار
app.get('/', (req, res) => {
    res.status(200).json({ message: '✅ API is running!', env: process.env.NODE_ENV });
});

// ✅ رفع الصور
app.post('/upload', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(201).json({ message: 'Files uploaded successfully', files: filePaths });
});

// ✅ المسارات
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ معالج 404
app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// ✅ معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// ✅ تشغيل السيرفر
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        });
    } catch (error) {
        console.error('DB connection error:', error);
        process.exit(1);
    }
};

startServer();
