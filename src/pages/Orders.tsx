import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../services/authService";
import { getOrders, modifyOrder } from "../services/orderService";
import { Order } from "../models/Order";
import OrderCard from "../components/OrderCard";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };
  const session = getSession();

  useEffect(() => {
    getOrders()
    .then(data => setOrders(data))
    .catch(error => {
      console.error(error);
      setError(true);
    })
  }, []);

  const ordersNotDelivered = orders.filter(x => x.status !== "delivered" && x.status !== "canceled").
    map(o => <OrderCard key={o.id} order={o} onModify={modifyOrder} />);
  const ordersHistory = orders.map(o => <OrderCard key={o.id} order={o} onModify={modifyOrder} />);

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between p-4 border-b-[1px] border-gray-400 box-border">
        <h1 className="text-2xl font-bold">
          🍔 <span className="text-gray-500">Burger</span><span className="text-amber-500">Queen</span>
        </h1>
        <p className="self-end">Welcome {session.user?.role}</p>
      </header>
      <main className="grid grid-cols-[15%,85%] h-full">
        <div className="pb-24 flex flex-col justify-between bg-gray-100 font-semibold text-gray-600">
          <div className="pt-4">
            <a className="block bg-white py-3 pl-6" href="/">Menu</a>
            <a className="block bg-gray-100 py-3 pl-6" href="#">Order List</a>
          </div>
          <button data-testid="logoutBtn" onClick={handleLogout}>{"<"} Log out</button>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          <h2>Orders</h2>
          {!error && ordersNotDelivered}
          <h2>History</h2>
          {!error && ordersHistory}
        </div>
      </main>
    </div>
  );
}

export default Orders
