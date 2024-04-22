import couponModel from "../../../DB/model/coupon.model.js";

export const CreateCoupon = async (req, res, next) => {
    const { name, amount } = req.body;
    if (await couponModel.findOne({ name })) {
        return res.status(409).json({ message: "Coupon name already exists" });
    }
    const coupon = await couponModel.create(req.body);
    return res.status(200).json({ message: "Success", coupon });
}
export const GetCoupon = async (req, res, next) => {
    const coupons = await couponModel.find({ isDeleted: false });
    return res.status(200).json({ message: "Success", coupons });
}
export const UpdateCoupon = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) {
        return res
            .status(404)
            .json({ message: `Invalid coupon id ${req.params.id}` });
    }
    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name }).select("name")) {
            return res
                .status(404)
                .json({ message: `Coupon ${req.body.name} already exists` });
        }
        coupon.name = req.body.name;
    }
    if (req.body.amount) {

        coupon.amount = req.body.amount;
    }
    await coupon.save();
    return res.status(200).json({ message: "Success", coupon });

}
export const SoftDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true },
        { new: true });
    if (!coupon) {
        return res.status(200).json({ message: "Can't delete this coupon" });


    }
    return res.status(200).json({ message: "Success" });
}
export const HardDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id, isDeleted: true })
    if (!coupon) {
        return res.status(200).json({ message: "Can't delete this coupon" });
    }
    return res.status(200).json({ message: "Success" });
}
export const Restore = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false },
        { new: true });
    if (!coupon) {
        return res.status(200).json({ message: "Can't restore this coupon" });


    }
    return res.status(200).json({ message: "Success" });
}