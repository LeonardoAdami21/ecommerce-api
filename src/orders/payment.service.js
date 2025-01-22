import { stripe } from "../config/stripe.config.js";
import Cupom from "../cupons/model/cupom.model.js";
import { clientUrl } from "../env/envoriment.js";
import User from "../users/model/user.model.js";
import Order from "./model/order.model.js";

const createCheckoutSession = async (data, user) => {
  try {
    const user = await User.findOne({ userId: user._id });
    const { products, cuponCode } = data;
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Invalid or empty products array");
    }
    let totalAmount = 0;
    const lineItens = products.map((product) => {
      const amout = Math.round(product.price * 100);
      totalAmount += amout * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
        },
        unit_amount: amout,
      };
    });
    let cupon = null;
    if (cuponCode) {
      cupon = await Cupom.findOne({
        code: cuponCode,
        userId: user._id,
        isActive: true,
      });
      if (cupon) {
        totalAmount -= Math.round(
          (totalAmount * cupon.discountPercentage) / 100,
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      line_items: lineItens,
      mode: "payment",
      success_url: `${clientUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/purchase-cancel`,
      customer_email: user.email,
      discounts: cupon
        ? [
            {
              coupon: await createStripeCupon(cupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: user._id.toString(),
        cuponCode: cuponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });
    if (totalAmount >= 20000) {
      await createNewCupon(user._id);
    }
    return {
      id: session.id,
      totalAmount: totalAmount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const createStripeCupon = async (discountPercentage) => {
  try {
    const cupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });
    return cupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createNewCupon = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }
    const newCupon = await Cupom({
      code: "GIFT" + math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: user._id,
    });
    await newCupon.save();
    return newCupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkoutSuccess = async (data) => {
  try {
    const { sessionId } = data;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.cuponCode) {
        await Cupom.findOneAndUpdate(
          {
            code: session.metadata.cuponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          },
        );
      }
      const products = JSON.parse(session.metadata.products);
      const newOrder = await Order({
        userId: session.metadata.userId,
        products: products.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });
      await newOrder.save();
      return {
        success: true,
        message: "Payment successfully",
        orderId: newOrder._id,
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const PaymentService = {
  createCheckoutSession,
  createNewCupon,
  checkoutSuccess,
};
