import OrdersTable from "@/components/OrdersTable";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Toaster position="top-right" />
      <OrdersTable />
    </div>
  );
}
