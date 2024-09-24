import { userRepository } from "./mongo/user.repository.js";

const findAll = async () => {
  try {
    const users = await userRepository.findAll();
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserById = async (id) => {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (id, data) => {
  try {
    const { name, email } = data;
    const user = await userRepository.update(id, { name, email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const deleteUser = async (id) => {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.deleted(id);
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

export const userService = { findAll, findUserById, updateUser, deleteUser };
