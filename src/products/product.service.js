import redisClient from "../config/redis.config.js";
import Product from "./model/product.model.js";

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProduct = async (data) => {
  try {
    const { name, image, price, category } = data;
    if (!name || !image || !price || !category) {
      throw new Error("All fields are required");
    }
    const product = await Product.create(data);
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await redisClient.get("featured_products");
    if (featuredProducts) {
      return JSON.parse(featuredProducts);
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      throw new Error("No featured products found");
    }
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts),
    );
    return featuredProducts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductByCategory = async (category) => {
  try {
    const products = await Product.find({ category });
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRecommendedProducts = async () => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          size: 3,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateFeaturedProducts = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const toggleFeatured = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.isFeatured = !product.isFeatured;
    await updateFeaturedProducts();
    await product.save();
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await Product.findByIdAndDelete(id);
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ProductService = {
  getAllProducts,
  getFeaturedProducts,
  getProductByCategory,
  getRecommendedProducts,
  getProductById,
  createProduct,
  toggleFeatured,
  deleteProductById,
};
