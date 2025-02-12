"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders, updateOrder } = useOrders();
  const [order, setOrder] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });

  useEffect(() => {
    const foundOrder = orders.find((o) => o.id == id);
    if (foundOrder) setOrder(foundOrder);
  }, [id, orders]);

  if (!order)
    return <p className="text-center text-gray-500">Loading order...</p>;

  const columns = [
    { key: "name", label: "Item Name" },
    { key: "quantity", label: "Quantity" },
    { key: "price", label: "Price", render: (price) => `$${price.toFixed(2)}` },
  ];

  const handleAddItem = async () => {
    if (!newItem.name || newItem.price <= 0 || newItem.quantity <= 0) {
      toast.error("All fields must be filled correctly.");
      return;
    }

    const updatedItems = [
      ...order.items,
      {
        id: `I${Date.now()}`,
        ...newItem,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity, 10),
      },
    ];

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      setOrder((prev) => ({ ...prev, items: updatedItems }));
      updateOrder(id, { items: updatedItems });
      setNewItem({ name: "", price: 0, quantity: 1 });
      toast.success("Item added successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Store:</strong> {order.store_name}
          </p>
          <p>
            <strong>Amount:</strong> ${order.amount.toFixed(2)}
          </p>
          <p>
            <strong>Decision:</strong> {order.decision || "Not yet decided"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <DataTable columns={columns} data={order.items} />
      </div>

      <div className="border p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Add New Item</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            min="1"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                quantity: parseInt(e.target.value, 10) || 1,
              })
            }
          />
          <Input
            type="number"
            placeholder="Price"
            min="0"
            step="0.01"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <Button onClick={handleAddItem} className="bg-blue-500 text-white mt-4">
          Add Item
        </Button>
      </div>
    </div>
  );
}
