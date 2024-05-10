import productModel from "../../../DB/model/product.model.js";
import bookingModel from "../../../DB/model/booking.model.js";

export const CreateBooking = async (req, res, next) => {
    const { productId, startDate, endDate } = req.body;
    const product = await productModel.findById(productId);
    if (!product || product.stock <= 0) {
        return res.status(404).json({ message: "Product not found or not available" });
    }
    const booking = await bookingModel.create({
        user_id: req.user._id,
        productId,
        start_date: startDate,
        end_date: endDate,
        status: "Pending",
    });
    return res.status(201).json({ message: "Booking created successfully", booking });
};
export const GetBookings = async (req, res, next) => {
    const bookings = await bookingModel.find({ user_id: req.user._id });
    if (bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
    }
    return res.status(200).json({ message: "Success", bookings });
};

export const ReturnBooking = async (req, res, next) => {
    const { bookingId } = req.body;
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "Returned";
    booking.return_date = new Date();
    await booking.save();
    return res.status(200).json({ message: "Booking returned successfully" });
};

export const CancelBooking = async (req, res, next) => {
  const { bookingId } = req.params; // Corrected to use bookingId
  try {
      const booking = await bookingModel.findOneAndUpdate(
          { _id: bookingId, user_id: req.user._id },
          { status: "Cancelled", return_date: new Date() },
          { new: true }
      );

      if (!booking) {
          return res.status(404).json({ message: "Cannot find booking" });
      }

      const product = await productModel.findById(booking.productId);
      if (product) {
          product.stock += 1;
          await product.save();
      }

      return res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
      return next(error);
  }
};
