// import { useState } from "react";
import { Order } from "../models/Order";
import { getSession } from "../services/authService";
import moment from "moment";

interface OrderCardProps {
  order: Order,
  onModify(id: number, status: string): void,
}

function OrderCard({ order, onModify } : OrderCardProps) {
  // const [ quantity, setQuantity ] = useState<number>(1)
  // const startTime = order.dataEntry.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const session = getSession();
  const products = order.products.map(p => 
    <li key={p.product.id}>{p.qty} {p.product.name}</li>
  );
  const orderId = (): string => {
    if (order.id < 10) return `00${order.id}`;
    if (order.id < 100 && order.id >= 10) return `0${order.id}`;
    else return `order.id`;
  };
  const orderDate = moment(order.dataEntry).format("MMM Do YY");
  const orderTime = moment(order.dataEntry).format("h:mm a");
  // const currentDate = new Date(); // insertar dateProcessed cuando el pedido esta como ready

  return (
    <div>
      <p>{orderId()} {orderDate} at {orderTime} {order.status}</p>
      <ul>{products}</ul>
      <p>Customer: {order.client}</p>
      {(session.user?.role === "admin" && order.status !== "delivered" && order.status !== "canceled") && 
        <button 
          className="bg-rose-500 text-white p-2 w-full border rounded-lg"
          onClick={() => onModify(order.id, "canceled")}>
            Cancel</button>}
      {((session.user?.role === "admin" || session.user?.role === "chef") && order.status === "pending") && 
        <button 
          className="bg-amber-500 text-white p-2 w-full border rounded-lg"
          onClick={() => onModify(order.id, "ready")}>
            Ready</button>}
      {((session.user?.role === "admin" || session.user?.role === "waiter") && order.status === "ready") && 
        <button 
          className="bg-emerald-500 text-white p-2 w-full border rounded-lg"
          onClick={() => onModify(order.id, "delivered")}>
            Delivered</button>}
    </div>
  );
}

export default OrderCard
