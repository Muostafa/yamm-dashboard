import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, active, decision, items } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const order = await Order.findOne({ id }); // Use findOne since id is a string
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update only provided fields
    if (active !== undefined) order.active = active;
    if (decision !== undefined) order.decision = decision;
    if (items && Array.isArray(items)) {
      order.items = items;
      order.amount = items.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      );
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
}
