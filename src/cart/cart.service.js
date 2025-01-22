import Product from "../products/model/product.model.js";
import User from "../users/model/user.model.js";

const getCartProducts = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    const products = await Product.find({
      _id: {
        $in: userId,
      },
    });
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.id.toString() === product.id,
      );
      return {
        ...product.JSON(),
        quantity: item.quantity,
      };
    });
    if (!products) {
      throw new Error("No products found");
    }
    return { cartItems };
  } catch (error) {
    throw new Error(error.message);
  }
};

const addToCart = async (data, userId) => {
  try {
    const { productId } = data;
    const user = await User.findOne({ userId });
    const existingItem = user.cart.products.find(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.products.push(productId);
    }
    await user.save();
    return user.cartItems;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCartQuantity = async (data, id, userId) => {
  try {
    const { id: productId } = id;
    const { quantity } = data;
    const user = await User.findOne({ userId });
    const existingItem = user.cartItems.products.find(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems.products = user.cartItems.products.filter(
          (item) => item.productId.toString() !== productId.toString(),
        );
        await user.save();
        return user.cartItems;
      }
      existingItem.quantity = quantity;
      await user.save();
      return user.cartItems;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeAllFromCart = async (data, userId) => {
  try {
    const { productId } = data;
    const user = await User.findOne({ userId });
    if (!productId) {
      user.cartItems.products = [];
    } else {
      user.cartItems.products = user.cartItems.products.filter(
        (item) => item.productId.toString() !== productId.toString(),
      );
    }
    await user.save();
    return user.cartItems;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const CartService = {
  getCartProducts,
  addToCart,
  updateCartQuantity,
  removeAllFromCart,
};
