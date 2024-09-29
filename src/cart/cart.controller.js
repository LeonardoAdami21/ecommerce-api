import Cart from "../models/cart.model.js";
import { cartService } from "./cart.service.js";

const findAll = async (req, res) => {
  try {
    const carts = await cartService.findAll();
    return res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { products } = req.body;
    const user = await cartService.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
        totalPrice: 0,
      });
    }
    for (const product of products) {
      const { productId, quantity } = product;
      const existingProduct = await cartService.findProductById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      const productQuantity = Number(quantity);
      if (productQuantity <= 0) {
        return res
          .status(400)
          .json({ error: "Quantity must be a positive number" });
      }
      if (existingProduct.stock < productQuantity) {
        return res
          .status(400)
          .json({ error: "Insufficient stock for this product" });
      }
      existingProduct.stock -= productQuantity;
      await existingProduct.save();
      const index = cart.items.findIndex((item) => item.product === productId);
      const productPrice = Number(existingProduct.price);
      if (isNaN(productPrice) || isNaN(productQuantity)) {
        return res.status(400).json({ error: "Invalid product data" });
      }
      if (index !== -1) {
        cart.items[index].quantity += productQuantity;
      } else {
        cart.items.push({
          productId,
          quantity: productQuantity,
        });
      }
      const cartTotalPrice = Number(productPrice * productQuantity);
      if (isNaN(cart.totalPrice)) {
        cart.totalPrice = 0;
      }
      cart.totalPrice += cartTotalPrice;
    }

    await cartService.addProductToCart(cart, req.user._id);
    return res.status(201).json({
      message: "Products added to cart successfully.",
      cart: {
        items: cart.items,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleted = async (req, res) => {
  try {
    const user = await cartService.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.cart.items = [];
    user.cart.totalPrice = 0;
    await user.save();
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cartController = { findAll, addProductToCart, deleted };
