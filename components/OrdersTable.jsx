"use client";
import { useOrders } from "@/context/OrdersContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";

export default function OrdersTable() {
  const {
    orders,
    page,
    total,
    perPage,
    fetchOrders,
    updateOrder,
    loading,
    error,
    setPage,
  } = useOrders();
  const router = useRouter();

  const toggleActive = (order) =>
    updateOrder(order.id, { active: !order.active });

  const handleDecision = (order, decision) =>
    updateOrder(order.id, { decision });

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchOrders(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * perPage < total) {
      setPage(page + 1);
      fetchOrders(page + 1);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "reason", label: "Reason" },
    {
      key: "store",
      label: "Store",
      render: (_, order) => (
        <a
          href={order.store_url}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {order.store_name}
        </a>
      ),
    },
    { key: "amount", label: "Amount", render: (amount) => `$${amount}` },
    { key: "items", label: "Items", render: (_, order) => order.items.length },
    {
      key: "decision",
      label: "Decision",
      render: (_, order) => (
        <select
          value={order.decision || ""}
          onChange={(e) => handleDecision(order, e.target.value)}
          className="border p-1"
          disabled={loading}
        >
          <option value="not yet">Not yet</option>
          <option value="reject">Reject</option>
          <option value="accept">Accept</option>
          <option value="escalate">Escalate</option>
        </select>
      ),
    },
    {
      key: "active",
      label: "Active",
      render: (_, order) => (
        <Switch
          checked={order.active}
          onCheckedChange={() => toggleActive(order)}
          disabled={loading}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, order) => (
        <Button
          onClick={() => router.push(`/orders/${order.id}`)}
          disabled={loading}
        >
          View {order.items.length} {order.items.length > 1 ? "Items" : "Item"}
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Refund Orders</h2>

      <DataTable columns={columns} data={orders} />

      {loading && <p className="text-blue-500">Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={page === 1 || loading}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={page * perPage >= total || loading}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
