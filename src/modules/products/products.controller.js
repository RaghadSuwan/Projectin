import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import productModel from "../../../DB/model/product.model.js";
import { pagination } from "../../utils/pagination.js";

export const GetProducts = async (req, res, next) => {
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
    const products = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' ')).populate("reviews");
    return res.json({ message: "success", count: products.length, total, products });
};
export const GetProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.productId).populate("reviews");
    return res.json({ message: "Success", product });
};
export const GetProductWithCategory = async (req, res, next) => {
    const products = await productModel.find({ categoryId: req.params.categoryId })
    return res.json({ message: "Success", products });
};
export const CreateProducts = async (req, res, next) => {
    const { name, price, discount, author, categoryId, subcategoryId } = req.body;
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
    req.body.author = author;
    const product = await productModel.create(req.body);
    if (!product) {
        return next(new Error("error while creating product", { cause: 404 }));
    }
    return res.status(200).json({ message: "Succcess", product })
};
export const UpdateProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(new Error("Invalid product id!", { cause: 404 }));
    }
    if (req.body.name) {
        product.name = req.body.name;
        product.slug = slugify(req.body.name);
    }
    if (req.body.price) {
        product.price = req.body.price;
    }
    if (req.body.discount) {
        product.discount = req.body.discount;
        product.finalPrice = req.body.price - (req.body.price * (req.body.discount || 0) / 100).toFixed(2);
    }
    if (req.body.categoryId) {
        const checkCategory = await categoryModel.findById(req.body.categoryId);
        if (!checkCategory) {
            return next(new Error("Category not found", { cause: 404 }));
        }
        product.categoryId = req.body.categoryId;
    }
    if (req.body.subcategoryId) {
        const checkSubCategory = await subcategoryModel.findById(req.body.subcategoryId);
        if (!checkSubCategory) {
            return next(new Error("Sub category not found", { cause: 404 }));
        }
        product.subcategoryId = req.body.subcategoryId;
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.APP_NAME}/Products/${product.name}/mainImage`,
            }
        );
        if (product.mainImage && product.mainImage.public_id) {
            await cloudinary.uploader.destroy(product.mainImage.public_id);
        }
        product.mainImage = { secure_url, public_id };
    }
    product.updatedBy = req.user._id;
    await product.save();
    return res.status(200).json({ message: "Product updated successfully" });
};
