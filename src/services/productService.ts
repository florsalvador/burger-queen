import Product from "../models/Product";
import { API_URL } from "../settings";
import { getSession } from "./authService";

export async function getProducts(): Promise<Product[]> {
  const session = getSession();
  const response = await fetch(`${API_URL}/products`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    },
  });
  if (!response.ok) {
    throw new Error("Error getting products");
  }
  const data = await response.json();
  const products: Product[] = data.map((product: Product) => ({
    ...product,
    dateEntry: new Date(product.dateEntry),
  }));
  return products;
}
