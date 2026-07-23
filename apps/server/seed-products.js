/**
 * Seed Script - يضيف 20 منتج إلكتروني تجريبي إلى MongoDB باستخدام Mongoose
 * الاستخدام: node seed-products.js
 */

require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mostafaradwanyos_db_user:Fom1eaQ4DOpTpcK0@users.i5o1asj.mongodb.net/ecommerce?appName=Users';

const products = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Smartphones',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    ],
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and ProCamera system with 5x optical zoom.',
    reviews: [],
    rating: 4.8,
    numReviews: 124,
    price: 1199,
    countInStock: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    category: 'Smartphones',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    ],
    description: 'Samsung\'s flagship with built-in S Pen, 200MP camera, and Galaxy AI features for next-level productivity.',
    reviews: [],
    rating: 4.7,
    numReviews: 98,
    price: 1299,
    countInStock: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Laptops',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    ],
    description: 'The most powerful MacBook Pro ever with M3 Pro chip, Liquid Retina XDR display, and up to 22 hours battery life.',
    reviews: [],
    rating: 4.9,
    numReviews: 87,
    price: 1999,
    countInStock: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    ],
    description: 'Industry-leading noise canceling headphones with 30-hour battery, multipoint connection, and crystal clear hands-free calling.',
    reviews: [],
    rating: 4.8,
    numReviews: 256,
    price: 349,
    countInStock: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'iPad Pro 12.9" M2',
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Tablets',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800',
    ],
    description: 'The ultimate iPad with M2 chip, Liquid Retina XDR display with ProMotion, and Apple Pencil hover support.',
    reviews: [],
    rating: 4.7,
    numReviews: 112,
    price: 1099,
    countInStock: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Dell XPS 15 OLED',
    brand: 'Dell',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
    category: 'Laptops',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800',
    ],
    description: 'Dell\'s premium laptop with stunning OLED display, Intel Core i9, NVIDIA RTX 4070, and premium build quality.',
    reviews: [],
    rating: 4.6,
    numReviews: 74,
    price: 2299,
    countInStock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=800',
    ],
    description: 'Rebuilt from the ground up with H2 chip, Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
    reviews: [],
    rating: 4.8,
    numReviews: 389,
    price: 249,
    countInStock: 80,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Samsung 4K QLED TV 65"',
    brand: 'Samsung',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    category: 'TVs',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    description: 'Quantum HDR 32X, Real Game Enhancer+, Smart TV with Alexa built-in. Experience the ultimate 4K picture quality.',
    reviews: [],
    rating: 4.6,
    numReviews: 143,
    price: 1499,
    countInStock: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Wearables',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
      'https://images.unsplash.com/photo-1523475496153-3566cd00bdb7?w=800',
    ],
    description: 'The most rugged and capable Apple Watch for athletes and adventurers. Titanium case, dual-frequency GPS, and 60-hour battery.',
    reviews: [],
    rating: 4.9,
    numReviews: 67,
    price: 799,
    countInStock: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'NVIDIA RTX 4090 GPU',
    brand: 'NVIDIA',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    category: 'Components',
    images: [
      'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    description: 'The world\'s most powerful GPU for gaming and creative work. 24GB GDDR6X, DLSS 3, and Ada Lovelace architecture.',
    reviews: [],
    rating: 4.9,
    numReviews: 203,
    price: 1599,
    countInStock: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'LG C3 OLED 55" TV',
    brand: 'LG',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg',
    category: 'TVs',
    images: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
    ],
    description: 'Award-winning OLED with α9 AI Processor Gen6, Dolby Vision IQ, Dolby Atmos. Perfect blacks for cinematic experience.',
    reviews: [],
    rating: 4.8,
    numReviews: 178,
    price: 1299,
    countInStock: 22,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Logitech_logo_2015.svg',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
      'https://images.unsplash.com/photo-1615750173898-d9b01f6f8b5b?w=800',
    ],
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling, Quiet Clicks, 8K DPI, and ergonomic design for all-day comfort.',
    reviews: [],
    rating: 4.7,
    numReviews: 512,
    price: 99,
    countInStock: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Samsung 990 Pro 2TB SSD',
    brand: 'Samsung',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    category: 'Storage',
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
      'https://images.unsplash.com/photo-1600348759200-5b94d62f4c5e?w=800',
    ],
    description: 'Next-generation PCIe 4.0 NVMe SSD with 7,450 MB/s read speed and enhanced thermal control for peak performance.',
    reviews: [],
    rating: 4.8,
    numReviews: 334,
    price: 179,
    countInStock: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'DJI Mini 4 Pro Drone',
    brand: 'DJI',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/DJI_logo.svg',
    category: 'Cameras',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
    ],
    description: 'Under 249g drone with 4K/60fps Omnidirectional Obstacle Sensing, 34-min flight time, and 20km video transmission.',
    reviews: [],
    rating: 4.7,
    numReviews: 89,
    price: 759,
    countInStock: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Bose QuietComfort Ultra',
    brand: 'Bose',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Bose_wordmark.svg',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    description: 'World-class ANC, Bose Immersive Audio, CustomTune technology. The most comfortable headphones with up to 24-hour battery.',
    reviews: [],
    rating: 4.7,
    numReviews: 167,
    price: 429,
    countInStock: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Microsoft Surface Pro 9',
    brand: 'Microsoft',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    category: 'Tablets',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    ],
    description: 'The most powerful Surface yet with Intel Core i7, 16GB RAM, and stunning 13" PixelSense Flow display at 120Hz.',
    reviews: [],
    rating: 4.5,
    numReviews: 93,
    price: 1599,
    countInStock: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Canon_wordmark.svg',
    category: 'Cameras',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    ],
    description: 'High-speed mirrorless camera with 40fps burst, 6K RAW video, and Dual Pixel CMOS AF II for professional photography.',
    reviews: [],
    rating: 4.8,
    numReviews: 56,
    price: 2499,
    countInStock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Razer Blade 16 Gaming Laptop',
    brand: 'Razer',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Razer_logo.svg',
    category: 'Laptops',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
    ],
    description: 'World\'s first dual-mode Mini-LED display laptop with RTX 4090, Intel Core i9, and premium CNC aluminum chassis.',
    reviews: [],
    rating: 4.6,
    numReviews: 41,
    price: 3999,
    countInStock: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    category: 'Smartphones',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
    ],
    description: 'The best of Google AI in a phone. Tensor G3 chip, 50MP triple camera system with Magic Eraser, 7 years of updates.',
    reviews: [],
    rating: 4.6,
    numReviews: 118,
    price: 999,
    countInStock: 38,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'PlayStation 5 Console',
    brand: 'Sony',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
    category: 'Gaming',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=800',
    ],
    description: 'Next-gen gaming with ultra-high speed SSD, haptic feedback DualSense controller, 4K gaming at 120fps, and ray tracing.',
    reviews: [],
    rating: 4.9,
    numReviews: 891,
    price: 499,
    countInStock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // حذف المنتجات القديمة
    const deleted = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} old products`);

    // إضافة المنتجات الجديدة
    const result = await collection.insertMany(products);
    console.log(`🚀 Successfully seeded ${result.insertedCount} products!`);

    console.log('\n📦 Products added:');
    products.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - $${p.price} (${p.category})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Connection closed');
  }
}

seedProducts();
