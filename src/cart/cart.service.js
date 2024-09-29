import Cart from "../models/cart.model.js";
import { cartRepository } from "./mongo/cart.repository.js";

const findAll = async () => {
  try {
    const carts = await cartRepository.findAll();
    return carts;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const addProductToCart = async (data, userId) => {
  try {
    const { products } = data;
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let cart = user.cart;
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
        totalPrice: 0,
      });
    }
    const newCart = await cartRepository.create(
      { ...cart, products },
      user._id,
    );
    return newCart;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const findUserById = async (userId) => {
  try {
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const findProductById = async (productId) => {
  try {
    const product = await cartRepository.findProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const update = async (id, data, userId) => {
  try {
    const { products } = data;
    let cart = await cartRepository.findUserById(userId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart = await cartRepository.update(id, {
      products: [...cart.products, ...products],
    });

    return cart;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const remove = async (id, userId) => {
  try {
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      throw new Error("Cart not found");
    }
    user.cart.items = [];
    user.cart.totalPrice = 0;
    await user.save();
    return { message: "Cart removed successfully" };
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

export const cartService = {
  findAll,
  addProductToCart,
  findUserById,
  findProductById,
  update,
  remove,
};
