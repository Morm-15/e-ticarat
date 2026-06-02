import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'usd',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'paypal', 'stripe'],
        default: 'stripe',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    // حقول Stripe
    stripePaymentIntentId: {
        type: String,
        default: null,
    },
    stripeSessionId: {
        type: String,
        default: null,
    },
    stripeCustomerId: {
        type: String,
        default: null,
    },
    receiptUrl: {
        type: String,
        default: null,
    },
    customerEmail: {
        type: String,
        default: null,
    },
    customerName: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: '',
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
