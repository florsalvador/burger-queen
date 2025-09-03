import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../services/authService";
import { getProducts } from "../services/productService";
import Product from "../models/Product";
import ProductList from "../components/ProductList";
import TakeOrder from "../components/TakeOrder";

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
      <header 
        className="
          flex justify-between p-4 sticky top-0 z-20
          border-b-[1px] border-gray-400 box-border bg-white"
      >
        <h1 className="text-2xl font-bold">
          🍔 <span className="text-gray-500">Burger</span><span className="text-amber-500">Queen</span>
        </h1>
        <p className="self-end">Welcome {session.user?.role}</p>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[15%] flex flex-col bg-gray-100 font-semibold text-gray-600 relative">
          <div className="pt-4">
            <Link to="/" className="block bg-white py-3 pl-6">Menu</Link>
            <Link to="/orders" className="block bg-gray-100 py-3 pl-6">Order List</Link>
          </div>
          <button 
            className="absolute bottom-8 left-1/2 -translate-x-1/2" 
            data-testid="logoutBtn" onClick={handleLogout}
          >
            {"<"} Log out
          </button>
        </div>
        <div className="flex-1 p-4 grid grid-cols-[2fr,1fr] gap-4 overflow-y-auto">
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
