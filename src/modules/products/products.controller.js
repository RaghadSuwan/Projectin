import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import productModel from "../../../DB/model/product.model.js";
import { pagination } from "../../utils/pagination.js";

export const getProducts = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObject = { ...req.query };
    const execQuery = ['skip', 'limit', 'page', 'sort', 'search', 'fileds'];
    execQuery.map((ele) => {
        delete queryObject[ele];
    })
    queryObject = JSON.stringify(queryObject);
    queryObject = queryObject.replace(/\b(lt|lte|gt|gte|in|nin|neq|eq)\b/g, match => `$${match}`);
    queryObject = JSON.parse(queryObject);
    const mongooseQuery = productModel.find(queryObject).limit(limit).skip(skip)
    if (req.query.search) {
        mongooseQuery.find({
            $or: [
                { name: { $regex: (req.query.search), $options: 'i' } },
                { description: { $regex: (req.query.search), $options: 'i' } }
            ]
        })
    }
    mongooseQuery.select(req.query.fileds?.replaceAll(',', ' '));
    const total = await productModel.estimatedDocumentCount();
    const products = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' '));
    return res.json({ message: "success", count: products.length, total, products });
};
export const getProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.productId)
    return res.json({ message: "Success", product });
};
export const getProductWithCategory = async (req, res, next) => {
    const products = await productModel.find({ categoryId: req.params.categoryId })
    return res.json({ message: "Success", products });
};
export const createProducts = async (req, res, next) => {
    const { name, price, discount, categoryId, subcategoryId } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return next(new Error("Category not found", { cause: 404 }));
    }
    const checkSubCategory = await subcategoryModel.findById(subcategoryId);
    if (!checkSubCategory) {
        return next(new Error("Sub category not found", { cause: 404 }));
    }
    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * (discount || 0) / 100).toFixed(2);
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
        return next(new Error("error while creating product", { cause: 404 }));
    }
    return res.status(200).json({ message: "Succcess", product })
};
