import { Order } from "../models/Order";
import { getSession } from "../services/authService";
import moment from "moment";

interface OrderCardProps {
  order: Order,
  onModify(id: number, status: string): Promise<boolean>,
  onDeleteClick(id: number): void
}

function OrderCard({ order, onModify, onDeleteClick } : OrderCardProps) {
  const session = getSession();
  const products = order.products.map(p => 
    <li key={p.product.id} className="border-b border-solid border-gray-300 pb-2">{p.qty} {p.product.name}</li>
  );
  const formatOrderId = (): string => {
    if (order.id < 10) return `00${order.id}`;
    if (order.id < 100 && order.id >= 10) return `0${order.id}`;
    else return `order.id`;
  };
  const orderId = formatOrderId()
  const orderDate = moment(order.dateEntry).format("MM/DD/YY");
  const orderTime = moment(order.dateEntry).format("h:mm a");
  const dateProcessed = order.dateProcessed
    ? moment(order.dateProcessed).format("h:mm a MM/DD/YY")
    : null;
  const statusColors: Record<string, string> = {
    pending: "text-gray-700",
    ready: "text-amber-700",
    delivered: "text-emerald-700 ",
    canceled: "text-rose-700",
  };

  return (
    <div className="relative border border-gray-200 rounded-xl shadow bg-white flex flex-col gap-4 pb-4">
      <div className="flex justify-between items-start px-6 bg-gray-200 border rounded-t-xl">
        <div className="flex flex-col text-lg font-bold py-2">
          #{orderId}
        <span
          className={`py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}
        >
          {order.status.toUpperCase()}
        </span>
        </div>
        <div className="py-2 pr-2">
          <p className="text-lg font-bold text-gray-800">{orderTime}</p>
          <p className="text-base text-gray-500">{orderDate}</p>
        </div>
      </div>

      <ul className="space-y-1 text-gray-800 text-basee px-6 py-4">{products}</ul>

      <div className="flex flex-col gap-2 mt-auto px-4">
        <div className="text-sm text-gray-500">
          <p>Customer: {order.client}</p>
          {dateProcessed && <p>Updated: {dateProcessed}</p>}
        </div>
        {session.user?.role === "admin" &&
          !["delivered", "canceled"].includes(order.status) && (
            <button
              className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600"
              onClick={() => onModify(order.id, "canceled")}
            >
              Cancel
            </button>
          )}
        {(session.user?.role === "admin" || session.user?.role === "chef") &&
          order.status === "pending" && (
            <button
              className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600"
              onClick={() => onModify(order.id, "ready")}
            >
              <span className="flex justify-center gap-1">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" 
                  xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier"> 
                    <path 
                      d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" strokeWidth="2" 
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                    </path> 
                  </g>
                </svg>
                Ready
              </span>
            </button>
          )}
        {(session.user?.role === "admin" || session.user?.role === "waiter") &&
          order.status === "ready" && (
            <button
              className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600"
              onClick={() => onModify(order.id, "delivered")}
            >
              <span className="flex justify-center gap-1">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" 
                  xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier"> 
                    <path 
                      d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" strokeWidth="2" 
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                    </path> 
                  </g>
                </svg>
                Delivered
              </span>
            </button>
          )}
      </div>
      {session.user?.role === "admin" && (
        <button
          className="absolute -top-2 -right-0 p-2
            text-gray-400 hover:text-gray-700 font-bold"
          onClick={() => onDeleteClick(order.id)}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default OrderCard
