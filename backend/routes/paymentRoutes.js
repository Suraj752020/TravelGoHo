const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/authMiddleware');

// Initialize Razorpay
// NOTE: These should be in your .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

console.log("Razorpay Config:", {
    key_id: process.env.RAZORPAY_KEY_ID,
    hasSecret: !!process.env.RAZORPAY_KEY_SECRET
});


// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount, currency = 'INR', receiptResponse } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise)
            currency,
            receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        };

        // MOCK MODE: If keys are dummy/placeholder, return fake order
        if (process.env.RAZORPAY_KEY_ID?.includes('placeholder') || process.env.RAZORPAY_KEY_ID?.includes('dummy')) {
            console.log("MOCK MODE: Returning fake order");
            return res.json({
                success: true,
                id: `order_mock_${Date.now()}`,
                currency: options.currency,
                amount: options.amount,
                key_id: process.env.RAZORPAY_KEY_ID,
                isMock: true // Flag for frontend
            });
        }

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID,
            isMock: false
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
});

// @route   POST /api/payment/verify
// @desc    Verify payment signature (Optional but recommended)
// @access  Private
const crypto = require('crypto');
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            res.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
});

module.exports = router;
