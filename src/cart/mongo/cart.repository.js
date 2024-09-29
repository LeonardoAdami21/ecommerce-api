import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";

const create = async (data, userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await Cart.findOneAndUpdate(
    { user: user._id },
    { $push: { items: data, totalPrice: data.totalPrice } },
    { upsert: true, new: true },
  );
};

const findAll = async () => {
  return await Cart.find({
    user: { $ne: null },
    items: { $ne: [] },
  });
};

const update = async (id, data) => {
  return await Cart.findByIdAndUpdate(id, data, { new: true });
};

const findProductById = async (productId) => {
  const product = await Product.findById({
    _id: productId,
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const findUserById = async (userId) => {
  const user = await User.findById({ _id: userId }).populate(
    "cart.items.product",
  );
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const deleteById = async (id) => {
  return await Cart.findByIdAndDelete(id);
};

export const cartRepository = {
  create,
  findProductById,
  findUserById,
  findAll,
  update,
  deleteById,
};
