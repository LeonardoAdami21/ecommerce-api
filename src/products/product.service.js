import { productRepository } from "./mongo/product.repository.js";

const create = async (data) => {
  try {
    const { name, price, quantity, description, stock, imageUrl, category } =
      data;
    if (
      !name ||
      !price ||
      !description ||
      !stock ||
      !imageUrl ||
      !category ||
      !quantity
    ) {
      throw new Error("All fields are required");
    }
    if (quantity < 0) {
      throw new Error("Quantity must be a positive number");
    }
    if (stock < 0) {
      throw new Error("Stock must be a positive number");
    }
    if (price < 0) {
      throw new Error("Price must be a positive number");
    }
    const product = await productRepository.create({
      name,
      price,
      quantity,
      description,
      stock,
      imageUrl,
      category,
    });
    return product;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const findAll = async () => {
  try {
    const products = await productRepository.findAll();
    return products;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const findById = async (id) => {
  try {
    const product = await productRepository.findById(id);
    return product;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const update = async (id, data) => {
  try {
    const { name, price, description, stock, imageUrl, category } = data;
    if (!name || !price || !description || !stock || !imageUrl || !category) {
      throw new Error("All fields are required");
    }
    const product = await productRepository.update(id, {
      name,
      price,
      description,
      stock,
      imageUrl,
      category,
    });
    return product;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const deleteById = async (id) => {
  try {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await productRepository.deleteById(id);
    return { message: "Product deleted successfully" };
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

export const productService = {
  create,
  findAll,
  findById,
  update,
  deleteById,
};
