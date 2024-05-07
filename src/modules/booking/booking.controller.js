import bookingModel from "../../../DB/model/booking.model.js";
import productModel from "../../../DB/model/product.model.js";

export const CreateBooking = async (req, res, next) => {
  const { productId, startDate, endDate } = req.body;
  const isBookAvailable = await productModel.findById(productId);
  if (!isBookAvailable || isBookAvailable.stock <= 0) {
    return res.status(404).json({ message: "Book not found or not available" });
  }
  const booking = await bookingModel.create({
    user_id: req.user._id,
    book_id: productId,
    start_date: startDate,
    end_date: endDate,
    status: "Pending",
  });
  return res
    .status(201)
    .json({ message: "Booking created successfully", booking });
};


export const CancelBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await bookingModel.findOne({ _id: bookingId, user_id: req.user._id });
        if (!booking) {
            return res.status(404).json({ message: "Cannot find booking" });
        }
        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: "Booking at " + booking.status + " status can't be cancelled" });
        }
          booking.status = 'Cancelled';
        booking.return_date = new Date(); ق
        await booking.save();
       for (const item of booking.products) {
            await productModel.findByIdAndUpdate(item.book_id, { $inc: { stock: 1 } });
        }
        return res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        return next(error);
    }
};


export const GetBookings = async (req, res, next) => {
  const bookings = await bookingModel.find({ user_id: req.user._id });
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
