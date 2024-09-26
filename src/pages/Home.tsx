import { useNavigate } from "react-router-dom";
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
    <div className="h-screen flex flex-col">
      <header className="flex justify-between p-4 border-b-[1px] border-gray-400 box-border">
        <h1 className="text-2xl font-bold">
          🍔 <span className="text-gray-500">Burger</span><span className="text-amber-500">Queen</span>
        </h1>
        <p className="self-end">Welcome {session.user?.role}</p>
      </header>
      <main className="grid grid-cols-[15%,85%] h-full">
        <div className="pb-24 flex flex-col justify-between bg-gray-100 font-semibold text-gray-600">
          <div className="pt-4">
            <a className="block bg-white py-3 pl-6" href="#">Menu</a>
            <a className="block bg-gray-100 py-3 pl-6" href="#">Order List</a>
          </div>
          <button data-testid="logoutBtn" onClick={handleLogout}>{"<"} Log out</button>
        </div>
        <div className="p-4 grid grid-cols-[68%,32%] gap-4 h-full overflow-y-auto">
          {!error && <ProductList products={products} onAdd={addProducts} />}
          <TakeOrder productsToAdd={productsToAdd} setProductsToAdd={setProductsToAdd} />
        </div>
      </main>
    </div>
  );
}

export default Home
