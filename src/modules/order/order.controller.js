
import productModel from "../../../DB/model/product.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
import userModel from "../../../DB/model/user.model.js";
import orderModel from "../../../DB/model/order.model.js";
export const CreateOrder = async (req, res, next) => {
    const { couponName } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        return next(new Error(`Cart is empty`, { cause: 400 }));
    }
    req.body.products = cart.products
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
    let subTotel = 0;
    let finalProudctList = [];
    for (let proudct of req.body.products) {
        const checkProudct = await productModel.findOne({
            _id: proudct.productId,
            stock: { $gte: proudct.quantity }
        })
        if (!checkProudct) {
            return next(new Error(`Product quantity not available`, { cause: 409 }));
        }
        proudct = proudct.toObject();
        proudct.name = checkProudct.name;
        proudct.discount = checkProudct.discount;
        proudct.unitPrice = checkProudct.price;
        proudct.finalprice = proudct.quantity * checkProudct.finalprice;
        subTotel += proudct.finalprice;
        finalProudctList.push(proudct);
    }
    const user = await userModel.findById(req.user._id);
    if (!req.body.address) {
        req.body.address = user.address
    }
    if (!req.body.phone) {
        req.body.phone = user.phone;
    }
    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProudctList,
        finalPrice: subTotel - (subTotel * ((req.body.coupon?.amount || 0))),
        address: req.body.address,
        phoneNumber: req.body.phone,
        couponName: req.body.couponName || '',

    });

    return res.json(order);

}
