
import productModel from "../../../DB/model/product.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
import userModel from "../../../DB/model/user.model.js";
import orderModel from "../../../DB/model/order.model.js";

export const CreateOrder = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
        return next(new Error("cart is empty"), { cause: 404 })
    }
    req.body.products = cart.products;
    if (req.body.couponName) {
        const coupon = await couponModel.findOne({ name: req.body.couponName });
        if (!coupon) {
            return next(new Error("Coupon not found", { cause: 404 }));
        }
        const cuurentDate = new Date();
        if (coupon.expireDate <= cuurentDate) {
            return next(new Error("Coupon expired", { cause: 400 }));
        }
        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error("Coupon already was used", { cause: 400 }));
        }
        req.body.coupon = coupon;
    }
    let totalPrice = 0;
    let finalProductList = []
    for (let product of req.body.products) {
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } })
        if (!checkProduct) {
            return next(new Error("Product not found"), { cause: 404 })
        }
        product = product.toObject();
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.price;
        product.discount = checkProduct.discount;
        product.finalPrice = product.quantity * checkProduct.finalPrice;
        totalPrice += product.finalPrice;
        finalProductList.push(product)
    }
    const user = await userModel.findById(req.user._id);
    if (!req.body.phone) { req.body.phone = user.phone };
    if (!req.body.address) { req.body.address = user.address; };
    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        finalPrice: totalPrice - (totalPrice * (req.body.couponName?.amount || 0 / 100)),
        phoneNumber: req.body.phone,
        address: req.body.address,
        couponName: req.body.couponName ?? ''
    })
    for (const product of finalProductList) {
        await productModel.findByIdAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } })
    }
    if (req.body.coupon) {
        await couponModel.findByIdAndUpdate({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }
    await cartModel.updateOne({ userId: req.user._id }, { products: [] });
    return res.status(201).json({ message: "success", order })
};
export const CancelOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
        return next(new Error(`Cannot find order`, { cause: 400 }));
    }
    if (order.status != 'pending') {
        return next(new Error(`Order at ${order.status} status can't be cancelled`, { cause: 400 }));
    }
    req.body.status = 'cancelled';
    req.body.updatedBy = req.user._id;
    const newOrder = await orderModel.findByIdAndUpdate(orderId, req.body, { new: true })
    for (const product of order.products) {
        await productModel.findByIdAndUpdate({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }
    if (order.couponName) {
        const coupon = await couponModel.findOne({ name: order.couponName });
        if (coupon) {
            await couponModel.findByIdAndUpdate(coupon._id, { $pull: { usedBy: req.user._id } });
        }
    }
    return res.status(200).json({ 'message': 'success', order: newOrder });
};
export const GetOrders = async (req, res, next) => {
    const orders = await orderModel.find({ userId: req.user._id });
    if (!orders) {
        return next(new Error('error while getting orders'));
    }
    return res.status(200).json({ message: "success", orders })
};
export const ChangeOrderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
        return next(new Error('Invalid order', { cause: 404 }));
    }
    if (order.status == 'delivered' || order.status == 'cancelled') {
        return next(new Error("can't cancel this order"));
    }
    const newOrder = await orderModel.findByIdAndUpdate(orderId, { status: req.body.status }, { new: true });
    return res.status(200).json({ message: "success", order: newOrder });
};