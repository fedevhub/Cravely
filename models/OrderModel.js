const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
        type: String,
        unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentProof: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['Waiting Payment', 'Payment Verification', 'Confirmed', 'In Production', 'Ready for Delivery', 'Delivered', 'Completed', 'Rejected'],
            default: 'Waiting Payment',
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        customerNote: {
            type: String,
            default: null,
        },
        paymentMethod: {
            type: String,
            enum: ['Transfer', 'QRIS', 'COD'],
            required: true,
        },
        createdAt: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);