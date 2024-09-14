import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Product from "../models/Product";
import styles from "../styles/ProductList.module.css";

interface ProductListProps {
  products: Product[],
  onAdd(qty: number, product: Product): void,
}

function ProductList({ products, onAdd } : ProductListProps) {
  const [ type, setType ] = useState<string>("all");
  const [ filteredProducts, setFilteredProducts ] = useState<Product[]>(products);

  useEffect(() => {
    if (type == "breakfast") {
      const breakfastList = products.filter(p => p.type=="Breakfast" || p.name.includes("coffee") || p.name=="Milk");
      setFilteredProducts(breakfastList);
    } else if (type == "lunch") {
      const lunchList = products.filter(p => !(p.type=="Breakfast" || p.name.includes("coffee") || p.name=="Milk"));
      setFilteredProducts(lunchList);
    } else setFilteredProducts(products);
  }, [products, type]);

  const productList = filteredProducts.map(product =>
    <ProductCard key={product.id} product={product} onAdd={onAdd} />
  )

  return (
    <div>
      <div>
        <label>
          <input type="radio" name="filter" value="all" onChange={(e) => setType(e.target.value)} defaultChecked />
          All
        </label>
        <label>
          <input type="radio" name="filter" value="breakfast" onChange={(e) => setType(e.target.value)} />
          Breakfast
        </label>
        <label>
          <input type="radio" name="filter" value="lunch" onChange={(e) => setType(e.target.value)} />
          Lunch
        </label>
      </div>
      <div className={styles.productList}>
        {productList}
      </div>
    </div>
  );
}

export default ProductList
