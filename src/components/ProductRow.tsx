import { useState, useEffect } from "react";
import Product from "../models/Product";

interface ProductRowProps {
  qty: number,
  product: Product,
  subtotal(qty: number, id: number): void;
  removeProduct(id: number): void;
}

function ProductRow({ qty, product, subtotal, removeProduct } : ProductRowProps) {
  const [ quantity, setQuantity ] = useState<number>(qty);
  useEffect(() => {
    setQuantity(qty);
  }, [qty]);
  const handleUpdate = (newQty: number) => {
    setQuantity(newQty);
    subtotal(newQty, product.id);
  };

  return (
    <div className="relative grid grid-cols-[20%,80%] gap-2 bg-white border rounded-md p-3 text-sm leading-tight my-2">
      <img src={product.image} alt={product.name} />
      <div>
        <p className="font-semibold">{product.name}</p>
        <div className="flex justify-between mt-2">
          <div className="flex gap-2 items-center">
            <button className="py-1 px-2 bg-slate-200 disabled:bg-slate-50 disabled:text-gray-400" onClick={() => handleUpdate(quantity === 1 ? 1 : quantity - 1)} disabled={quantity > 1 ? false : true}>-</button>
            {quantity}
            <button className="py-1 px-2 bg-slate-200" onClick={() => handleUpdate(quantity + 1)}>+</button>
          </div>
          <span className="self-end pr-3 text-lg font-semibold text-rose-500">${product.price * quantity}</span>
        </div>
      </div>
      <button className="absolute top-0 right-0 py-1 px-2 text-slate-400" onClick={() => removeProduct(product.id)}>x</button>
    </div>
  );
}

export default ProductRow
