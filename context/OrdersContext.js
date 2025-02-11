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
          setError(err.message);
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

  // Update an order (active status, decision)
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

          // Update state immediately
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
