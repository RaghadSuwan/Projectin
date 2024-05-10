import mongoose, { Schema, Types, model } from "mongoose";

const bookingSchema = new Schema(
    {
        user_id: { type: Types.ObjectId, ref: "User", required: true },
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        start_date: { type: Date, required: true, required: true},
        end_date: { type: Date, required: true ,required: true},
        return_date: { type: Date },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Confirmed", "Cancelled","Returned","delivered"],
        },
    },
    {
        timestamps: true,
    }
);

const bookingModel = mongoose.models.Booking || model("Booking", bookingSchema);
export default bookingModel;
