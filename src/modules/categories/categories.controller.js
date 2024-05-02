import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import { pagination } from "../../utils/pagination.js";
import productModel from "../../../DB/model/product.model.js";

export const GetCategories = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const Categories = await categoryModel.find()
    .skip(skip)
    .limit(limit)
    .populate('subcategory');
  return res.status(200).json({ message: "success", count: Categories.length, Categories });
};
export const Specificcategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", category });
};
export const Createcategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    return next(new Error("Category name already exists", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/Categories`,
    }
  );
  const aCategory = await categoryModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id
  });
  return res
    .status(200)
    .json({ message: "Category created successfully", aCategory });
};
export const Getactivecategories = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const categories = await categoryModel
    .find({ status: "Active" })
    .skip(skip)
    .limit(limit)
    .select("name image");
  return res.status(200).json({ message: "success", count: categories.length, categories });
};
export const Updatecategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(new Error(`Invalid category id ${req.params.id}`, { cause: 404 }));
  }
  if (await categoryModel.findOne({ name: req.body.name, _id: { $ne: category._id } }).select("name")) {
    return next(new Error(`Category ${req.body.name} already exists`, { cause: 404 }));
  }
  category.name = req.body.name;
  category.slug = slugify(req.body.name);
  category.status = req.body.status;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/Categories`,
      }
    );
    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }
    category.image = { secure_url, public_id };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "Category updated successfully" });
};
export const DeleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return next(new Error(`Category not found`, { cause: 404 }));
  }
  await subcategoryModel.deleteMany({ categoryId });
  await productModel.deleteMany({ categoryId });
  return res.status(200).json({ message: "success" });
};