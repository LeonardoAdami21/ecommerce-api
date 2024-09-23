import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  googleId: { type: String },
  facebookId: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  userType: { type: String, enum: ["user", "admin"], default: "user" },
  cart: {
    items: [
      [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    ],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
