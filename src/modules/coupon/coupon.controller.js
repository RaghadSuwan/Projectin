import couponModel from "../../../DB/model/coupon.model.js";

export const CreateCoupon = async (req, res, next) => {
    const { name } = req.body;
    req.body.expireDate = new Date(req.body.expireDate);
    if (await couponModel.findOne({ name })) {
        return next(new Error("Coupon name already exists", { cause: 409 }));
    }
    const coupon = await couponModel.create(req.body);
    return res.status(200).json({ message: "Success", coupon });
};
export const GetCoupon = async (req, res, next) => {
    const coupons = await couponModel.find({ isDeleted: false });
    return res.status(200).json({ message: "Success", coupons });
};
export const UpdateCoupon = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) {
        return next(new Error(`Invalid coupon id ${req.params.id}`, { cause: 404 }));
    }
    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name }).select("name")) {
            return next(new Error(`Coupon ${req.body.name} already exists`, { cause: 404 }));
        }
        coupon.name = req.body.name;
    }
    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    await coupon.save();
    return res.status(200).json({ message: "Success", coupon });
};
export const SoftDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true },
        { new: true });
    if (!coupon) {
        return next(new Error("Can't delete this coupon", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success" });
};
export const HardDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id, isDeleted: true })
    if (!coupon) {
        return next(new Error("Can't delete this coupon", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success" });
};
export const Restore = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false },
        { new: true });
    if (!coupon) {
        return next(new Error("coupon not found", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success" });
};