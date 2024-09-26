import { Order, NewOrder } from "../models/Order";
import { API_URL } from "../settings";
import { getSession } from "./authService";

export async function createOrder(newOrder: NewOrder): Promise<Order> {
  const session = getSession();
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    },
    body: JSON.stringify(newOrder),
  });
  if (!response.ok) {
    throw new Error("Error creating order");
  }
  const orderInfo = await response.json();
  return orderInfo;
}
