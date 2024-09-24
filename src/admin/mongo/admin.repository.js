import User from "../../models/user.model.js";

const create = async (data) => {
  return await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    facebookId: data.facebookId,
    googleId: data.googleId,
    userType: "admin",
  });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};



export const adminRepository = { create, findByEmail };
