import Product from "./Product";

export type Order = {
  id: number;
  userId: number;
  client: string;
  products: { qty: number, product: Product }[];
  status: string;
  dataEntry: Date;
  dateProcessed: Date | null;
}

export type NewOrder = {
  client: string;
  products: { qty: number, product: Product }[];
  status: string;
  dataEntry: Date;
}
