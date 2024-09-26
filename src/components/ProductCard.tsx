import { useState } from "react";
import Product from "../models/Product";

interface ProductCardProps {
  product: Product,
  onAdd(qty: number, product: Product): void,
}

function ProductCard({ product, onAdd } : ProductCardProps) {
  const [ quantity, setQuantity ] = useState<number>(1)
  return (
    <div className="border border-gray-300 rounded-lg shadow text-center flex flex-col justify-between">
      <img className="px-9 pt-5 pb-3" src={product.image} alt={product.name} />
      <div className="px-3 pb-5">
        <h3 className="font-semibold leading-tight">{product.name}</h3>
        <p className="font-semibold">${product.price}</p>
        <div className="w-full mt-4 flex flex-wrap justify-center items-center gap-[8px] text-sm">
          <button className="bg-slate-200 px-2 py-[0.35rem] border rounded-lg active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-500" onClick={() => setQuantity(quantity == 1 ? 1 : quantity-1)} disabled={quantity > 1 ? false : true}>-</button>
          {quantity}
          <button className="bg-slate-200 px-2 py-[0.35rem] border rounded-lg active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-500" onClick={() => setQuantity(quantity+1)}>+</button>
          <button className="bg-amber-500 text-white px-2 py-[0.35rem] border rounded-lg active:bg-amber-600" onClick={() => {onAdd(quantity, product); setQuantity(1)}}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard
