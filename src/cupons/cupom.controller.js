import User from "../users/model/user.model.js";
import { CupomService } from "./cupom.service.js";

const findCupom = async (req, res) => {
  try {
    const cupom = await CupomService.getCupom({ userId: req.user._id });
    return res.status(200).json({ data: cupom || null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const validateCupom = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ userId: req.user._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cupom = await CupomService.validateCupom(code, req.user._id);
    return res
      .status(200)
      .json({
        message: "Cupom is valid",
        code: cupom.code,
        discountPercentage: cupom.discountPercentage,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const CupomController = { findCupom, validateCupom };
