import express from 'express';
import {
    createPaymentIntent,
    createCheckoutSession,
    handleWebhook,
    getAllTransactions,
    getTransactionById,
} from '../controllers/payment.controller.js';

const router = express.Router();

// Webhook يجب أن يكون قبل express.json() لأنه يحتاج raw body
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// مسارات الدفع
router.post('/create-intent', createPaymentIntent);
router.post('/create-session', createCheckoutSession);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);

export default router;
