import { useState } from "react";
import Product from "../models/Product";
import styles from "../styles/ProductCard.module.css";

interface ProductCardProps {
  product: Product,
  onAdd(qty: number, product: Product): void,
}

function ProductCard({ product, onAdd } : ProductCardProps) {
  const [ quantity, setQuantity ] = useState<number>(1)
  return (
    <div className={styles.card}>
      <img className={styles.img} src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button onClick={() => setQuantity(quantity == 1 ? 1 : quantity-1)} disabled={quantity > 1 ? false : true}>-</button>
      {quantity}
      <button onClick={() => setQuantity(quantity+1)}>+</button>
      <button onClick={() => {onAdd(quantity, product); setQuantity(1)}}>Add</button>
    </div>
  );
}

export default ProductCard
