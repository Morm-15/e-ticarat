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

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the .env file');
    process.exit(1);
}

const app = express();

// إعداد التخزين للصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

// إعداد CORS للسماح للفرونت إند
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// إعدادات الحماية
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));
app.use(express.json());

// توفير الوصول لملفات الصور
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
}, express.static(path.join(path.resolve(), 'uploads')));

// مسار رئيسي للاختبار
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API!' });
});

// رفع الصور بشكل منفصل إن لزم
app.post('/upload', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(201).json({ message: 'Files uploaded successfully', files: filePaths });
});

// المسارات
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders',orderRoutes );

// تشغيل السيرفر
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('DB connection error:', error);
        process.exit(1);
    }
};

startServer();
