"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
export default function ItemsTables() {
  const { id } = useParams();
  const router = useRouter();
  const { orders, addItemToOrder, deleteItemFromOrder } = useOrders();
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
    {
      key: "actions",
      label: "Actions",
      render: (_, item) => (
        <Button
          onClick={() => deleteItemFromOrder(order.id, item.id)}
          className="bg-red-500 text-white"
        >
          Delete
        </Button>
      ),
    },
  ];
  const handleAddItem = async () => {
    if (!newItem.name || newItem.price <= 0 || newItem.quantity <= 0) {
      toast.error("All fields must be filled correctly.");
      return;
    }
    await addItemToOrder(order.id, {
      id: `I${Date.now()}`,
      ...newItem,
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity, 10),
    });
    setNewItem({ name: "", price: "", quantity: "" });
  };
  return (
    <div className="p-4 space-y-6">
      <Button
        onClick={() => router.push("/")}
        className="bg-gray-500 text-white"
      >
        ← Back to Orders
      </Button>
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
            placeholder="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                quantity: e.target.value ? parseInt(e.target.value, 10) : "",
              })
            }
          />
          <Input
            placeholder="Price"
            type="number"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                price: e.target.value ? parseFloat(e.target.value) : "",
              })
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
