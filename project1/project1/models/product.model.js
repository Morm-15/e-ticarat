import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['giyim', 'ayakkabı', 'aksesuar'],
            required: [true, 'Kategori alanı zorunludur'],
        },
        subcategory: {
            type: String,
            enum: ['tişört', 'pantolon', 'bot', 'çanta'],
        },
        productType: {
            type: String,
            enum: ['erkek', 'kadın', 'çocuk', 'unisex'],
            required: [true, 'Ürün tipi gereklidir'],
        },
        colors: {
            type: [String],
            default: [],
        },
        sizes: {
            type: [String],
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            default: [],
        },
        images: {
            type: [String],
            required: [true, 'At least one product image is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'TL'],
            default: 'TL',
        },
        discount: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
