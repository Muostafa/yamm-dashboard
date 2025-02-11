import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    // Fetch single order
    try {
      const order = await Order.findOne({ id });
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  } else if (req.method === "PUT") {
    // Update order (decision, active status, or items)
    try {
      const { active, decision, items } = req.body;

      let order = await Order.findOne({ id });
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (active !== undefined) order.active = active;
      if (decision) order.decision = decision;
      if (items) {
        order.items = items;
        order.amount = order.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }

      await order.save();
      res.status(200).json(order);
    } catch (error) {
      console.log("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  } else if (req.method === "DELETE") {
    // Delete order
    try {
      const deletedOrder = await Order.findOneAndDelete({ id });
      if (!deletedOrder)
        return res.status(404).json({ error: "Order not found" });
      res.status(200).json({ message: "Order deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
