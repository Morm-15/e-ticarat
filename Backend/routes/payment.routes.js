import express from 'express';
import {
    createPaymentIntent,
    createCheckoutSession,
    handleWebhook,
    getAllTransactions,
    getTransactionById,
} from '../controllers/payment.controller.js';

const router = express.Router();

// مسارات الدفع
router.post('/create-intent', createPaymentIntent);
router.post('/create-session', createCheckoutSession);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);

export default router;
