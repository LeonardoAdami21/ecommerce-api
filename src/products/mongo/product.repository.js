import Product from "../../models/product.model.js";

const create = async (data) => {
  return await Product.create(data);
};

const findAll = async () => {
  return await Product.find({});
};

const findById = async (id) => {
  return await Product.findById(id);
};

const update = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const productRepository = {
  create,
  findAll,
  findById,
  update,
  deleteById,
};
