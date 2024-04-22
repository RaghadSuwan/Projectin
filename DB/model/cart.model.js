import mongoose, { Schema, Types, model } from 'mongoose';
const cartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        produsts: [{
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true, },
        }],
    },
    {
        timestamps: true,
    }
);


const cartModel =
    mongoose.models.Cart || model('Cart', cartSchema);
export default cartModel;
