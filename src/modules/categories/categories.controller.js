import slugify from "slugify";
import cloudinary from "../../services/cloudinary.js";
import categoryModel from "../../../DB/model/category.model.js";
export const getCategories = async (req, res) => {
  const Categories = await categoryModel.find();

  return res.status(200).json({ message: "success", Categories });
};

export const specificcategory = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  return res.status(200).json({ message: "success", category });
};

export const createcategory = async (req, res) => {
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    return res.status(409).json({ message: "Category name already exists" });
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
  });
  return res
    .status(200)
    .json({ message: "Category created successfully", aCategory });
};

export const getactivecategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ status: "Active" })
      .select("name image");
    return res.status(200).json({ message: "success", categories });
  } catch (err) {
    return res.json({ err: err.stack });
  }
};

export const updatecategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: `Invalid category id ${req.params.id}` });
    }
    if (req.body.name) {
      if (await categoryModel.findOne({ name: req.body.name }).select("name")) {
        return res
          .status(404)
          .json({ message: `Category ${req.body.name} already exists` });
      }
      category.name = req.body.name;
      category.slug = slugify(req.body.name);
    }
    if (req.body.status) {
      category.status = req.body.status;
    }
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
    await category.save();
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    return res.json({ err: err.stack });
  }
};
