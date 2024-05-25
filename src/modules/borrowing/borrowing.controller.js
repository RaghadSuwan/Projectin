import productModel from "../../../DB/model/product.model.js";
import borrowingModel from "../../../DB/model/borrowing.model.js";

export const Createborrowing = async (req, res, next) => {
    const { productId, startDate } = req.body;
    // حساب endDate بإضافة 30 يومًا إلى startDate
    const start = new Date(startDate);
    const cuurentDate = new Date();
    if (start <= cuurentDate) {
        return next(new Error("Start date must be in the future", { cause: 400 }));
    }
    const end = new Date(start);
    end.setDate(start.getDate() + 30);
    const product = await productModel.findById(productId);
    if (!product || product.stock <= 0) {
        return res
            .status(404)
            .json({ message: "Product not found or not available" });
    }
    const borrowing = await borrowingModel.create({
        user_id: req.user._id,
        productId,
        start_date: start,
        end_date: end,
        status: "Pending",
    });
    return res
        .status(201)
        .json({ message: "borrowing created successfully", borrowing });
};
export const Getborrowings = async (req, res, next) => {
    const borrowings = await borrowingModel.find({ user_id: req.user._id });
    if (borrowings.length === 0) {
        return res
            .status(404)
            .json({ message: "No borrowings found for this user" });
    }
    return res.status(200).json({ message: "Success", borrowings });
};
export const Returnborrowing = async (req, res, next) => {
    const { borrowingId } = req.params;
    const borrowing = await borrowingModel.findById(borrowingId);
    if (!borrowing) {
        return res.status(404).json({ message: "borrowing not found" });
    }
    borrowing.status = "Returned";
    borrowing.return_date = new Date();
    await borrowing.save();
    return res.status(200).json({ message: "borrowing returned successfully" });
};
export const Cancelborrowing = async (req, res, next) => {
    const { borrowingId } = req.params;
    try {
        const borrowing = await borrowingModel.findOneAndUpdate(
            {
                _id: borrowingId,
                user_id: req.user._id,
                status: { $ne: "Cancelled" },
                status: { $ne: "Returned" },
            },
            { status: "Cancelled", return_date: new Date() },
            { new: true }
        );
        if (!borrowing) {
            return res
                .status(404)
                .json({ message: "Cannot find borrowing or already processed" });
        }
        const product = await productModel.findById(borrowing.productId);
        if (product) {
            product.stock += 1;
            await product.save();
        }
        return res
            .status(200)
            .json({ message: "Borrowing cancelled successfully", borrowing });
    } catch (error) {
        return next(error);
    }
};
