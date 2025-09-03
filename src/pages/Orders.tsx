import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../services/authService";
import { getOrders, modifyOrder, deleteOrder } from "../services/orderService";
import { Order } from "../models/Order";
import OrderCard from "../components/OrderCard";
import ConfirmModal from "../components/ConfirmModal";
import MessageModal from "../components/MessageModal";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "history">("orders");
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };
  const session = getSession();

  useEffect(() => {
    const fetchOrders = async () => {
      setSpinner(true);
      setError(false);
      setErrorApi(false);
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorApi(true);
        clearSession();
        navigate("/login");
      } finally {
        setSpinner(false);
      }
    }
    fetchOrders();
  }, [navigate]);

  const handleModify = async (id: number, status: string): Promise<boolean> => {
    setLoading(true);
    try {
      await modifyOrder(id, status);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      return true;
    } catch (error) {
      console.error(error);
      setErrorApi(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteOrder(id);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      return true;
    } catch (error) {
      console.error(error);
      setErrorApi(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const handleDeleteClick = (id: number) => {
    setOrderToDelete(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (orderToDelete !== null) {
      await handleDelete(orderToDelete);
      setOrderToDelete(null);
    }
    setConfirmOpen(false);
  };

  const ordersNotDelivered = (role: string | null) => {
    let list: Order[] = [];
    if (role === "chef") {
      list = orders.filter(x => x.status === "pending");
    } else if (role === "waiter") {
      list = orders.filter(x => x.status === "ready");
    } else list = orders.filter(x => x.status !== "delivered" && x.status !== "canceled");
    return list.map(o => <OrderCard key={o.id} order={o} onModify={handleModify} onDeleteClick={handleDeleteClick} />);
  };
  const userRole = session.user?.role ?? null;
  const ordersList = ordersNotDelivered(userRole);
  const ordersHistory = orders.map(o => <OrderCard key={o.id} order={o} onModify={handleModify} onDeleteClick={handleDeleteClick} />);

  return (
    <div className="h-svh flex flex-col">
      <header 
        className="
          flex justify-between p-4 sticky top-0 z-20
          border-b-[1px] border-gray-400 box-border bg-white"
      >
        <h1 className="text-2xl font-bold">
          🍔 <span className="text-gray-500">Burger</span><span className="text-amber-500">Queen</span>
        </h1>
        <p className="self-end">Welcome {session.user?.role}</p>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[15%] flex flex-col bg-gray-100 font-semibold text-gray-600 relative">
          <div className="pt-4">
            <Link to="/" className="block bg-gray-100 py-3 pl-6">Menu</Link>
            <Link to="/orders" className="block bg-white py-3 pl-6">Order List</Link>
          </div>
          <button 
            className="absolute bottom-8 left-1/2 -translate-x-1/2" 
            data-testid="logoutBtn" onClick={handleLogout}
          >
            {"<"} Log out
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-semibold ${
                activeTab === "orders"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-500"
              }`}>
              Orders
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 font-semibold ml-4 ${
                activeTab === "history"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-500"
              }`}>
              History
            </button>
          </div>
          {spinner ? (
            <div className="flex justify-center items-center col-span-full">
              <div
                className="
                  animate-spin 
                  inline-block 
                  w-8 h-8 
                  border-4 
                  border-current 
                  border-t-transparent 
                  text-blue-500 
                  rounded-full
                "
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : activeTab === "orders" ? (
            <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
              {!error && ordersList.length > 0
                ? ordersList
                : <p>There are no pending orders at the moment</p>
              }
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
              {!error && ordersHistory.length > 0
                ? ordersHistory
                : <p>There are no orders in the history at the moment</p>
              }
            </div>
          )}
        </div>
      </main>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Order"
        message="Are you sure you want to delete this order?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
      <MessageModal isOpen={loading} title="Loading...">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-150" />
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-300" />
        </div>
      </MessageModal>
      <MessageModal
        isOpen={errorApi}
        title="Error"
        onClose={() => setErrorApi(false)}
      >
        <p className="text-gray-600">Something went wrong. Please try again.</p>
      </MessageModal>
    </div>
  );
}

export default Orders
