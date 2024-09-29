import { productService } from "./product.service.js";

const create = async (req, res) => {
  try {
    const { name, price, quantity, description, stock, imageUrl, category } =
      req.body;
    if (
      !name ||
      !price ||
      !description ||
      !stock ||
      !imageUrl ||
      !category ||
      !quantity
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (quantity < 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }
    if (stock < 0) {
      return res.status(400).json({ error: "Stock must be a positive number" });
    }
    if (price < 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    const product = await productService.create({
      name,
      price,
      description,  
      quantity,
      stock,
      imageUrl,
      category,
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    const products = await productService.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await productService.update(req.params.id, req.body);
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await productService.deleteProduct(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const productController = {
  create,
  findAll,
  findProductById,
  updateProduct,
  deleteProduct,
};
