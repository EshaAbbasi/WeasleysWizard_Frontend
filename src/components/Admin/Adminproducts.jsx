import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import productService from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    adminService
      .listAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  };

  const handleDelete = async (id) => {
    await productService.deleteProduct(id);
    loadProducts();
  };

  return (
    <div>
      <h2>All Products ({products.length})</h2>
      {products.map((product) => (
        <div key={product.id}>
          <strong>{product.name}</strong> — {product.category} — £
          {product.price_gbp} — Shop #{product.shop_id}
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Products;
