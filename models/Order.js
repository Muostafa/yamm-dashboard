import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  reason: { type: String },
  store_name: { type: String },
  store_logo: { type: String },
  store_url: { type: String },
  amount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  decision: {
    type: String,
    enum: ["reject", "accept", "escalate", null],
    default: null,
  },
  items: {
    type: [
      {
        name: String,
        id: String,
        price: Number,
        quantity: Number,
      },
    ],
    default: [], // Ensures it doesn't default to undefined
  },
});

// Middleware to calculate amount from items before saving
OrderSchema.pre("save", function (next) {
  this.amount = this.items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
