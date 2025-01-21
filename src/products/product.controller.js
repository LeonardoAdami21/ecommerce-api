import cloudinary from "../config/cloudinary.config.js";
import { ProductService } from "./product.service.js";

const findAll = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    return res.status(200).json({ data: products, message: "Products found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllRecommendedProducts = async (req, res) => {
  try {
    const products = await ProductService.getRecommendedProducts();
    return res.status(200).json({ data: products, message: "Products found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await ProductService.getProductByCategory(category);
    return res.status(200).json({ data: products, message: "Products found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllFeatured = async (req, res) => {
  try {
    const products = await ProductService.getFeaturedProducts();
    return res.status(200).json({ data: products, message: "Products found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, image, price, category } = req.body;
    if (!name || !image || !price || !category) {
      throw new Error("All fields are required");
    }
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await ProductService.createProduct({
      name,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      price,
      category,
    });
    return res
      .status(201)
      .json({ data: product, message: "Product created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.toggleFeatured(id);
    return res.status(200).json({ data: product, message: "Product found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        return { message: "Image deleted from cloudinary" };
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    await ProductService.deleteProductById(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const ProductController = {
  findAll,
  findAllFeatured,
  findAllProductsByCategory,
  findAllRecommendedProducts,
  create,
  toggleFeatured,
  deleteProductById,
};
