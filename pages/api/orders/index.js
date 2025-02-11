import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    // Pagination logic
    const { page = 1, per_page = 15 } = req.query;
    const limit = parseInt(per_page);
    const skip = (parseInt(page) - 1) * limit;

    try {
      const orders = await Order.find().skip(skip).limit(limit);
      const total = await Order.countDocuments();

      res
        .status(200)
        .json({ orders, total, page: parseInt(page), per_page: limit });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        id,
        reason,
        store_name,
        store_logo,
        store_url,
        active,
        decision,
        items,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items must be provided" });
      }

      // 🔹 Check if an order with the same ID already exists
      const existingOrder = await Order.findOne({ id });
      if (existingOrder) {
        return res
          .status(400)
          .json({ error: "Order with this ID already exists" });
      }

      // 🔹 Calculate total amount dynamically
      const amount = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      const newOrder = new Order({
        id,
        reason,
        store_name,
        store_logo,
        store_url,
        amount, // Derived from items
        active: active ?? true, // Default to true
        decision: decision ?? null,
        items,
        createdAt: new Date(),
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
