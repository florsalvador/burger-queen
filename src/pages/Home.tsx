import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../services/authService";
import { getProducts } from "../services/productService";
import Product from "../models/Product";
import ProductList from "../components/ProductList";
import TakeOrder from "../components/TakeOrder";
import "../styles/Home.css";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [productsToAdd, setProductsToAdd] = useState<{ qty: number, product: Product }[]>([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  useEffect(() => {
    getProducts()
    .then(data => setProducts(data))
    .catch(error => {
      console.error(error);
      setError(true);
    })
  }, []);

  const session = getSession();

  const addProducts = (qty: number, product: Product) => {
    setProductsToAdd(prevProducts => {
      const existingProduct = prevProducts.find(p => p.product.id === product.id);
      if (existingProduct) {
        const updatedProducts = prevProducts.map(p => 
          p.product.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
        console.log("Updated existing product:", updatedProducts);
        return updatedProducts;
      } else {
        const newProducts = [...prevProducts, { qty, product }];
        console.log("Added new product:", newProducts);
        return newProducts;
      }
    });
  };

  return (
    <>
      <header>
        <h1>BurgerQueen</h1>
        <p>Welcome {session.user?.role}</p>
      </header>
      <main>
        <div>
          <a href="#">Menu</a>
          <a href="#">Order List</a>
          <button data-testid="logoutBtn" onClick={handleLogout}>Logout</button>
        </div>
        {!error && <ProductList products={products} onAdd={addProducts} />}
        <TakeOrder productsToAdd={productsToAdd} setProductsToAdd={setProductsToAdd} />
      </main>
    </>
  );
}

export default Home
