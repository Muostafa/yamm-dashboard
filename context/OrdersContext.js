"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  // Fetch orders with pagination
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            `/api/orders?page=${page}&per_page=${perPage}`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          setOrders(data.orders);
          setTotal(data.total);
          setPage(page);
          resolve();
        } catch (err) {
          console.error(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      }),
      {
        loading: "Loading orders...",
        success: "Orders loaded successfully!",
        error: "Failed to load orders",
      }
    );
  };

  // Update an order
  const updateOrder = async (id, updatedData) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          });
          const updatedOrder = await res.json();
          if (!res.ok) throw new Error(updatedOrder.error);

          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === id ? updatedOrder : order))
          );

          resolve();
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: "Updating order...",
        success: "Order updated successfully!",
        error: "Failed to update order",
      }
    );
  };

  // Add an item to an order
  const addItemToOrder = async (id, newItem) => {
    const order = orders.find((o) => o.id == id);
    if (!order) return toast.error("Order not found");

    const updatedItems = [...order.items, newItem];

    await updateOrder(id, { ...order, items: updatedItems });
  };

  // Delete an item from an order
  const deleteItemFromOrder = async (orderId, itemId) => {
    const order = orders.find((o) => o.id == orderId);
    if (!order) return toast.error("Order not found");

    const updatedItems = order.items.filter((item) => item.id !== itemId);

    await updateOrder(orderId, { ...order, items: updatedItems }),
      {
        loading: "Deleting item...",
        success: "Item deleted successfully!",
        error: "Failed to delete item",
      };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        total,
        page,
        perPage,
        fetchOrders,
        updateOrder,
        addItemToOrder,
        deleteItemFromOrder, // Expose delete function
        loading,
        error,
        setPage,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

// Custom hook to use OrdersContext
export const useOrders = () => useContext(OrdersContext);
