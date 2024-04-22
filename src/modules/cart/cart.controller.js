import cartModel from "../../../DB/model/cart.model.js";

export const craeteCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        const naewCart = await cartModel.create({
            userId: req.user._id,
            produsts: { productId, quantity }
        })
        return res.status(201).json({ message: "success", naewCart });
    }
    let matchedProduct = false;
    for (let i = 0; i < cart.produsts.length; i++) {
        if (cart.produsts[i].productId == productId) {
            cart.produsts[i].quantity = quantity;
            matchedProduct = true;
            break;
        }
    }
    if (!matchedProduct) {
        cart.produsts.push({ productId, quantity });
    }
    await cart.save();
    return res.status(201).json({ message: "success", cart });
}

export const removeItem = async (req, res, next) => {
    const { productId } = req.body;
    await cartModel.updateOne({ userId: req.user._id }, {
        $pull: {
            produsts: {
                productId
            }
        }
    })
    return res.status(201).json({ message: "success" });
}

export const clearCart = async (req, res, next) => {
    const clearCart = await cartModel.updateOne({ userId: req.user._id }, { produsts: [] },
    );
    return res.status(201).json({ message: "success" });
}

export const getCart = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    return res.status(201).json({ message: "success", cart });
}