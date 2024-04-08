import couponModel from "../../../DB/model/coupon.model.js";

export const CreateCoupon = async (req, res) => {
    const { name, amount } = req.body;
    if (await couponModel.findOne({ name })) {
        return res.status(409).json({ message: "Coupon name already exists" });
    }
    const coupon = await couponModel.create(req.body);
    return res.status(200).json({ message: "Success", coupon });
}
export const GetCoupon = async (req, res) => {
    const coupons = await couponModel.find({});
    return res.status(200).json({ message: "Success", coupons });
}
export const UpdateCoupon = async (req, res) => {
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