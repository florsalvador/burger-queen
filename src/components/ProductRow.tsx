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
    <div>
      {/* <img className={styles.img} src={product.image} alt={product.name} /> */}
      <div>
        <p>{product.name}</p>
        <p>{product.price * quantity}</p>
      </div>
      <div>
        <button onClick={() => handleUpdate(quantity === 1 ? 1 : quantity - 1)} disabled={quantity > 1 ? false : true}>-</button>
        {quantity}
        <button onClick={() => handleUpdate(quantity + 1)}>+</button>
        <button onClick={() => removeProduct(product.id)}>Remove</button>
      </div>
    </div>
  );
}

export default ProductRow
