import { required } from 'joi';
import mongoose, { Schema, Types, model } from 'mongoose';
const orderSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: 'User', required: true, },
        produsts: [{
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true, },
            unitPrice: { type: Number, required: true, },
            finalPrice: { type: Number, required: true, },
        }],
        couponId: { type: Types.ObjectId, ref: 'Coupon', required: true },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Cancelled ', 'Confirmed', 'OnWay', 'deliverd'],
        },
        finalPrice: {
            type: Number, required: true,
        },
        reasonRejected: {
            type: String,
        },
        paymentType: {
            type: String,
            default: 'Cash',
            enum: ['Cart', ' Cash'],
        },
        note: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);
const orderModel =
    mongoose.models.Order || model('Order', orderSchema);
export default orderModel;
