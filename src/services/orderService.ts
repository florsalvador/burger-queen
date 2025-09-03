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

export async function getOrders(): Promise<Order[]> {
  const session = getSession();
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    },
  });
  if (!response.ok) {
    throw new Error("Error getting orders");
  }
  const data = await response.json();
  return data;
}

export async function modifyOrder(id: number, status: string): Promise<Order> {
  const session = getSession();
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    },
    body: JSON.stringify({ "status": status }),
  });
  if (!response.ok) {
    throw new Error("Error modifying order");
  }
  const orderInfo = await response.json();
  return orderInfo;
}

export async function deleteOrder(id: number): Promise<Order> {
  const session = getSession();
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    }
  });
  if (!response.ok) {
    throw new Error("Error deleting order");
  }
  const orderInfo = await response.json();
  return orderInfo;
}
