import { CartService } from "./cart.service.js";

const getCartProducts = async (req, res) => {
    try {
        const user = req.user;
        const cart = await CartService.getCartProducts(user._id);
        return res.status(200).json({ data: cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    const cart = await CartService.createCart(user._id, productId);
    return res.status(201).json({ data: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId, quantity } = req.body;
    const cart = await CartService.updateCart(user._id, productId, quantity);
    return res.status(200).json({ data: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    const cart = await CartService.removeAllFromCart(user._id, productId);
    return res.status(200).json({ data: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const CartController = {getCartProducts, createCart, updateCart, removeFromCart };
