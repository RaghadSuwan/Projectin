
import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
export const CreateOrder = async (req, res, next) => {
    const { couponName } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        return next(new Error(`Cart is empty`, { cause: 400 }));
    }
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName });
        if (!coupon) {
            return next(new Error(`Coupon not found`, { cause: 404 }));
        }
        const currentDate = new Date();
        if (coupon.expireDate <= currentDate) {
            return next(new Error(`This coupon has expired`, { cause: 400 }));
        }
        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error(`This coupon has already been used`, { cause: 409 }));
        }
        req.body.coupon = coupon;
    }
    return res.json("ok");

}
