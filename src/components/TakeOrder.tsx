import { useState, useEffect } from "react";
import { createOrder } from "../services/orderService";
import { NewOrder } from "../models/Order";
import Product from "../models/Product";
import ProductRow from "./ProductRow";
import { getSession } from "../services/authService";

interface TakeOrderProps {
  productsToAdd: { qty: number, product: Product }[],
  setProductsToAdd(products: { qty: number, product: Product }[]): void;
}

function TakeOrder({ productsToAdd, setProductsToAdd } : TakeOrderProps) {
  const [ client, setClient ] = useState<string>("");
  const [ total, setTotal ] = useState<number>(0);
  const [ alert, setAlert ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const session = getSession();
  const userId = session.user?.id ?? null;
  const order: NewOrder = {
    userId: userId,
    client: client,
    products: productsToAdd,
    status: "pending",
    dateEntry: new Date(),
  };
  useEffect(() => {
    const newTotal = productsToAdd.reduce((acc, curr) => acc + curr.qty * curr.product.price, 0);
    setTotal(newTotal);
    console.log("Updated total:", newTotal);
  }, [productsToAdd]);

  const handleCreateOrder = () => {
    setLoading(true);
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
        setError(true);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      })
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
    <div className="p-4 bg-gray-100">
      <h2 className="text-base font-bold text-gray-700 pb-2">New Order</h2>
      {productsTotal}
      {loading ? (
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
      ) : error ? (
        <div className="bg-rose-100 text-sm text-rose-700 py-3 px-4 rounded mb-3 text-center mt-3">
          <p>Something went wrong</p>
          <p>Please try again.</p>
          <button 
            className="bg-rose-500 hover:bg-rose-600 text-white p-1 border rounded-lg mt-2 px-3" 
            onClick={() => setError(false)}
          >
              Ok
          </button>
        </div>
      ) : alert ? (
        <div className="pt-4 pb-5 mb-3 text-center bg-amber-100">
          <p className="text-xl font-bold text-green-600">✓</p>
          New order sent
        </div>
      ) : (
        <>
          <div className="flex justify-between font-semibold text-base border-y border-dashed border-gray-600 py-1 my-5">
            <span>Total:</span><span>${total}</span>
          </div>
          <div>
            <input 
              className="w-full border rounded placeholder:italic p-1 mb-4" 
              type="text" id="customer" value={client} placeholder="*Customer's name" 
              onChange={e => setClient(e.target.value)} 
            />
          </div>
          <button 
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 w-full border rounded-lg disabled:text-gray-500 disabled:bg-gray-200" 
            onClick={handleCreateOrder} disabled={!client.trim() || total==0 ? true : false}
          >
            Send to kitchen
          </button>
        </>
      )}
    </div>
  );
}

export default TakeOrder
