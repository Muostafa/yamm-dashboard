"use client";
import { useOrders } from "@/context/OrdersContext";
import { Switch } from "@/components/ui/switch";

export default function OrdersTable() {
  const {
    orders,
    total,
    page,
    perPage,
    fetchOrders,
    updateOrder,
    loading,
    error,
    setPage,
  } = useOrders();

  // Handle Active Status Toggle
  const toggleActive = (order) => {
    updateOrder(order.id, { active: !order.active });
  };

  // Handle Decision Change
  const handleDecision = (order, decision) => {
    updateOrder(order.id, { decision });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Refund Orders</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Store</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Decision</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, id) => (
            <tr key={id} className="border">
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.reason}</td>
              <td className="border p-2 gap-2">
                <a
                  href={order.store_url}
                  className="text-blue-500"
                  target="_blank"
                >
                  {order.store_name}
                </a>
              </td>
              <td className="border p-2">${order.amount}</td>
              <td className="border p-2">{order.items.length}</td>
              <td className="border p-2">
                <select
                  value={order.decision || ""}
                  onChange={(e) => handleDecision(order, e.target.value)}
                  className="border p-1"
                >
                  <option value="not yet">Not yet</option>
                  <option value="reject">Reject</option>
                  <option value="accept">Accept</option>
                  <option value="escalate">Escalate</option>
                </select>
              </td>
              <td className="border p-2">
                <Switch
                  checked={order.active}
                  onCheckedChange={() => toggleActive(order)}
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => (window.location.href = `/orders/${order.id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => fetchOrders(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 border disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <button
          onClick={() => fetchOrders(page + 1)}
          disabled={page * perPage >= total}
          className="px-4 py-2 border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
