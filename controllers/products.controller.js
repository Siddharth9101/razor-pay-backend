const Products = require("../models/Product.model.js");
const cloudinary = require("cloudinary").v2;
const connectCloudinary = require("../configs/cloudinary.js");
const ProductModel = require("../models/Product.model.js");
const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    await connectCloudinary();

    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      folder: "ekartProducts",
    });

    await ProductModel.create({
      ...productData,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    res.status(201).json({ message: "Product Added Successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteProduct = async (req, res) => {
  const prodId = req.params.id;
  try {
    const productDoc = await ProductModel.findById(prodId);

    if (!productDoc) {
      return res.status(404).json({ message: "Product not found." });
    }

    await cloudinary.uploader.destroy(productDoc.imagePublicId);

    await ProductModel.findByIdAndDelete(prodId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
};
