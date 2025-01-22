import User from "../users/model/user.model.js";
import Cupom from "./model/cupom.model.js";

const getCupom = async (id) => {
  try {
    const user = await User.findOne({ userId: id });
    if (!user) {
      throw new Error("User not found");
    }
    const cupom = await Cupom.findOne({ userId: user._id, isActive: true });
    if (!cupom) {
      throw new Error("Cupom not found");
    }
    return cupom;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateCupom = async (data, userId) => {
  try {
    const { code } = data;
    const user = await User.findOne({ userId: userId });
    const cupom = await Cupom.findOne({
      code,
      userId: user._id,
      isActive: true,
    });
    if (!cupom) {
      throw new Error("Cupom not found");
    }
    if (cupom.expirationDate < Date.now()) {
      cupom.isActive = false;
      await cupom.save();
      throw new Error("Cupom expired");
    }
    return cupom;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const CupomService = { getCupom, validateCupom };
