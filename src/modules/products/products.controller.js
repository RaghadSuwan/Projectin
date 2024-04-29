import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import productModel from "../../../DB/model/product.model.js";

export const getProducts = (req, res, next) => {
    return res.json({ message: "Products .." });
}
export const getProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.productId)

    return res.json({ message: "Success" ,product});
}
export const getProductWithCategory = async (req, res, next) => {
    const products = await productModel.find({ categoryId: req.params.categoryId })
    return res.json({ message: "Success", products });
}
export const createProducts = async (req, res, next) => {
    const { name, price, discount, categoryId, subcategoryId } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return res.status(404).json({ message: "Category not found" })
    }
    const checkSubCategory = await subcategoryModel.findById(subcategoryId);
    if (!checkSubCategory) {
        return res.status(404).json({ message: "Sub category not found" })
    }
    req.body.slug = slugify(name);
    req.body.finalprice = price - (price * (discount || 0) / 100).toFixed(2);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
        folder: `${process.env.APP_NAME}/Products/${req.body.name}/mainImage`,
    });
    req.body.mainImage = { secure_url, public_id };
    req.body.subImages = [];
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
            folder: `${process.env.APP_NAME}/Products/${req.body.name}/subImages`,
        });
        req.body.subImages.push({ secure_url, public_id });
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const product = await productModel.create(req.body);
    if (!product) {
        return res.status(404).json({ message: "error while creating product" })
    }
    return res.status(200).json({ message: "Succcess", product })

}
