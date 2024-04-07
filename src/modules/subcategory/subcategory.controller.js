import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import slugify from "slugify";
import cloudinary from "../../services/cloudinary.js";

export const CreateSubCategory = async (req, res) => {
    const { name, categoryId } = req.body;
    if (await subcategoryModel.findOne({ name })) {
        return res.status(409).json({ message: `Sub Category ${name} already exists` });
    }
    try {
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
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
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const GetSubCategories = async (req, res) => {
    const categoryId = req.params.id;

    const category = await categoryModel.findById(categoryId)

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = await subcategoryModel.find({ categoryId }).populate({path:'categoryId'});
    return res.status(200).json({ message: "Success", subCategory });

}