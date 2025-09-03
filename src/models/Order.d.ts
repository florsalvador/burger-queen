import Product from "./Product";

export type Order = {
  id: number;
  userId: number;
  client: string;
  products: { qty: number, product: Product }[];
  status: string;
  dateEntry: Date;
  dateProcessed: Date | null;
}

export type NewOrder = {
  userId: number | null;
  client: string;
  products: { qty: number, product: Product }[];
  status: string;
  dateEntry: Date;
}
