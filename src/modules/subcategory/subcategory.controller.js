import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";

export const CreateSubCategory = async (req, res, next) => {
    const { name, categoryId } = req.body;
    if (await subcategoryModel.findOne({ name })) {
        return next(new Error(`Sub Category ${name} already exists`, { cause: 409 }));
    }
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.APP_NAME}/Sub Ctegory`,
        }
    );
    const subCategory = await subcategoryModel.create({
        name,
        slug: slugify(name),
        categoryId,
        image: { secure_url, public_id },
    });
    return res.status(200).json({ message: "Sub Category created successfully", subCategory });

}

export const GetSubCategories = async (req, res, next) => {
    const categoryId = req.params.id;

    const category = await categoryModel.findById(categoryId)

    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }

    const subCategory = await subcategoryModel.find({ categoryId }).populate({ path: 'categoryId' });
    return res.status(200).json({ message: "Success", subCategory });

}