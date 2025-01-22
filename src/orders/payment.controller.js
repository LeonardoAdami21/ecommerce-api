import { PaymentService } from "./payment.service.js";

const create = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const order = await PaymentService.createCheckoutSession(
      req.body,
      user._id,
    );
    return res.status(201).json({ data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await PaymentService.checkoutSuccess(sessionId);
    return res.status(200).json({ data: session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const PaymentController = { create, checkoutSuccess };
