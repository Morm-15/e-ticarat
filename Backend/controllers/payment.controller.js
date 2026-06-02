import Stripe from 'stripe';
import Transaction from '../models/transaction.model.js';

// تهيئة Stripe بشكل lazy بعد dotenv.config()
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// إنشاء Payment Intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd', description, customerName, customerEmail } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'المبلغ غير صحيح' });
        }

        const paymentIntent = await getStripe().paymentIntents.create({
            amount: Math.round(amount * 100), // تحويل إلى سنتات
            currency,
            description: description || 'Admin Store Payment',
            metadata: { customerName, customerEmail },
        });

        // حفظ المعاملة في قاعدة البيانات
        const transaction = new Transaction({
            amount,
            currency,
            status: 'pending',
            paymentMethod: 'stripe',
            stripePaymentIntentId: paymentIntent.id,
            customerName,
            customerEmail,
            description,
        });
        await transaction.save();

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            transactionId: transaction._id,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Payment Intent Error:', error);
        res.status(500).json({ message: 'خطأ في إنشاء الدفع', error: error.message });
    }
};

// إنشاء Checkout Session
export const createCheckoutSession = async (req, res) => {
    try {
        const { items, customerEmail, customerName, successUrl, cancelUrl } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'لا توجد منتجات' });
        }

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description || '',
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail,
            success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata: { customerName, customerEmail },
        });

        // حفظ المعاملة
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const transaction = new Transaction({
            amount: totalAmount,
            currency: 'usd',
            status: 'pending',
            paymentMethod: 'stripe',
            stripeSessionId: session.id,
            customerEmail,
            customerName,
            description: `Checkout - ${items.length} items`,
        });
        await transaction.save();

        res.status(200).json({
            sessionId: session.id,
            sessionUrl: session.url,
            transactionId: transaction._id,
        });
    } catch (error) {
        console.error('Checkout Session Error:', error);
        res.status(500).json({ message: 'خطأ في إنشاء جلسة الدفع', error: error.message });
    }
};

// استقبال Webhook من Stripe
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = getStripe().webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature error:', err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const intent = event.data.object;
                await Transaction.findOneAndUpdate(
                    { stripePaymentIntentId: intent.id },
                    {
                        status: 'completed',
                        receiptUrl: intent.charges?.data?.[0]?.receipt_url || null,
                    }
                );
                console.log('✅ Payment succeeded:', intent.id);
                break;
            }
            case 'payment_intent.payment_failed': {
                const intent = event.data.object;
                await Transaction.findOneAndUpdate(
                    { stripePaymentIntentId: intent.id },
                    { status: 'failed' }
                );
                console.log('❌ Payment failed:', intent.id);
                break;
            }
            case 'checkout.session.completed': {
                const session = event.data.object;
                await Transaction.findOneAndUpdate(
                    { stripeSessionId: session.id },
                    {
                        status: 'completed',
                        stripeCustomerId: session.customer || null,
                    }
                );
                console.log('✅ Checkout session completed:', session.id);
                break;
            }
            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};

// جلب جميع المعاملات
export const getAllTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find()
                .populate('order')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Transaction.countDocuments(),
        ]);

        // إحصائيات
        const stats = await Transaction.aggregate([
            { $group: {
                _id: '$status',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
            }},
        ]);

        const totalRevenue = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        res.status(200).json({
            transactions,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            stats,
            totalRevenue: totalRevenue[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في جلب المعاملات', error: error.message });
    }
};

// جلب معاملة واحدة
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('order');
        if (!transaction) {
            return res.status(404).json({ message: 'المعاملة غير موجودة' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في جلب المعاملة', error: error.message });
    }
};
