import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../services/authService";
import { getProducts } from "../services/productService";
import Product from "../models/Product";
import ProductList from "../components/ProductList";
import TakeOrder from "../components/TakeOrder";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [productsToAdd, setProductsToAdd] = useState<{ qty: number, product: Product }[]>([]);
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setSpinner(true);
      setError(false);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError(true);
        clearSession();
        navigate("/login");
      } finally {
        setSpinner(false);
      }
    }
    fetchProducts();
  }, [navigate]);

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
    <div className="h-svh flex flex-col">
      <Header role={session.user?.role ?? null} />
      <main className="flex flex-1 overflow-hidden bg-gray-800 text-slate-300">
        <Sidebar activePage="home" onClickLogout={handleLogout} />
        <div className="flex-1 grid grid-cols-[2fr,1fr] overflow-y-auto">
          {spinner ? (
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
            <p className="col-span-full text-red-600">
              There was an error loading the products.
            </p>
          ) : products.length === 0 ? (
            <p className="col-span-full">There are no products to show at the moment</p>
          ) : (
            <>
              <ProductList products={products} onAdd={addProducts} />
              <TakeOrder productsToAdd={productsToAdd} setProductsToAdd={setProductsToAdd} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home
