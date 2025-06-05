import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

// التحقق من وجود رابط الاتصال بقاعدة البيانات
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the .env file");
  process.exit(1);
}

// إعداد المسارات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد تطبيق Express
const app = express();

// إعداد تخزين الصور باستخدام multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// إعداد CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// إعدادات الحماية
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan("dev"));
app.use(express.json());

// توفير الملفات الثابتة (الصور)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// مسار اختبار
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API!" });
});

// مسار رفع الصور
app.post("/upload", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
  res
    .status(201)
    .json({ message: "Files uploaded successfully", files: filePaths });
});

// مسارات المنتجات والمستخدمين
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// تشغيل السيرفر بعد الاتصال بقاعدة البيانات
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

startServer();
