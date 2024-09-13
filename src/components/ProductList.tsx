import ProductCard from "./ProductCard";
import Product from "../models/Product";
import styles from "../styles/ProductList.module.css";

interface ProductListProps {
  products: Product[],
  onAdd(qty: number, product: Product): void,
}

function ProductList({ products, onAdd } : ProductListProps) {
  const productList = products.map(product =>
    <ProductCard key={product.id} product={product} onAdd={onAdd} />
  )

  return (
    <div className={styles.productList}>
      {productList}
    </div>
  );
}

export default ProductList
