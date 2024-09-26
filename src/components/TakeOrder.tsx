import { useState, useEffect } from "react";
import { createOrder } from "../services/orderService";
import { NewOrder } from "../models/Order";
import Product from "../models/Product";
import ProductRow from "./ProductRow";

interface TakeOrderProps {
  productsToAdd: { qty: number, product: Product }[],
  setProductsToAdd(products: { qty: number, product: Product }[]): void;
}

function TakeOrder({ productsToAdd, setProductsToAdd } : TakeOrderProps) {
  const [ client, setClient ] = useState<string>("");
  const [ total, setTotal ] = useState<number>(0);
  const [ alert, setAlert ] = useState(false);
  const order: NewOrder = {
    client: client,
    products: productsToAdd,
    status: "pending",
    dataEntry: new Date(),
  }
  useEffect(() => {
    const newTotal = productsToAdd.reduce((acc, curr) => acc + curr.qty * curr.product.price, 0);
    setTotal(newTotal);
    console.log("Updated total:", newTotal);
  }, [productsToAdd]);

  const handleCreateOrder = () => {
    createOrder(order)
      .then(response => {
        console.log("Order created successfully:", response);
        setProductsToAdd([]);
        setClient("");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateSubtotal = (qty: number, id: number) => {
    const updatedProducts = productsToAdd.map((p) =>
      p.product.id === id ? { ...p, qty } : p
    );
    setProductsToAdd(updatedProducts);
    console.log("Updated productsToAdd with new qty:", updatedProducts);
  };

  const removeProduct = (id: number) => {
    const updatedProducts = productsToAdd.filter((p) => p.product.id !== id);
    setProductsToAdd(updatedProducts);
    console.log("Removed product with id:", id);
  };

  const productsTotal = productsToAdd.map(p =>
    <ProductRow
      key={p.product.id}
      qty={p.qty}
      product={p.product}
      subtotal={updateSubtotal}
      removeProduct={removeProduct}
    />
  );

  return (
    <div className="p-4 bg-gray-100 mr-4">
      <h2 className="text-xl font-bold text-gray-700 pb-2">New Order</h2>
      {productsTotal}
      {!alert && 
      <>
        <div className="flex justify-between font-semibold text-lg border-y border-dashed border-gray-600 py-1 my-5">
          <span>Total:</span><span>${total}</span>
        </div>
        <div>
          <input className="w-full border rounded placeholder:italic p-1 mb-4" type="text" id="customer" value={client} placeholder="Customer's name" onChange={e => setClient(e.target.value)} />
        </div>
      </>}
      {alert && 
      <div className="pt-4 pb-5 mb-3 text-center bg-amber-100">
        <p className="text-xl font-bold text-green-600">✓</p>
        New order sent
      </div>}
      <button className="bg-rose-500 text-white p-2 w-full border rounded-lg disabled:bg-rose-400" onClick={handleCreateOrder} disabled={!client.trim() || total==0 ? true : false}>Send to kitchen</button>
    </div>
  );
}

export default TakeOrder
