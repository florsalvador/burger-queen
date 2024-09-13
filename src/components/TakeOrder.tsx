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
    <div>
      <h2>New Order</h2>
      <label>Customer:
        <input type="text" value={client} onChange={e => setClient(e.target.value)} />
      </label>
      {alert && <div>New order successfully sent</div>}
      {productsTotal}
      <p>Total: ${total}</p>
      <button onClick={handleCreateOrder} disabled={!client.trim() || total==0 ? true : false}>Send to kitchen</button>
    </div>
  );
}

export default TakeOrder
