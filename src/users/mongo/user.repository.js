import User from "../../models/user.model.js";

const findAll = async () => {
    return await User.find();
};

const findById = async (id) => {
  return await User.findById(id);
};

const update = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const deleted = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const userRepository = {findAll, findById, update, deleted };
