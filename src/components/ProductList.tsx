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
      <h2 className="text-lg font-bold text-gray-700 pb-2">Select category</h2>
      <div className={styles.filter}>
        <input type="radio" name="filter" id="all" value="all" onChange={(e) => setType(e.target.value)} defaultChecked />
        <label htmlFor="all">All</label>
        <input type="radio" name="filter" id="breakfast" value="breakfast" onChange={(e) => setType(e.target.value)} />
        <label htmlFor="breakfast">Breakfast</label>
        <input type="radio" name="filter" id="lunch" value="lunch" onChange={(e) => setType(e.target.value)} />
        <label htmlFor="lunch">Lunch</label>
      </div>
      <h2 className="text-lg font-bold text-gray-700 pb-2">Select items</h2>
      <div className="grid grid-cols-3 gap-[0.6rem] xl:grid-cols-4">
        {productList}
      </div>
    </div>
  );
}

export default ProductList
