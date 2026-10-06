import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import productService from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      const data = await adminService.listAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError(
        "Could not load products. Check your admin access and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    setDeletingProduct(id);
    setError("");
    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch {
      setError("Could not delete this product.");
    } finally {
      setDeletingProduct(null);
    }
  };

  return (
    <div>
      <h1>Products ({products.length})</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="dash-card">No products found.</p>
      ) : (
        <div className="dash-card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Shop</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.category || "-"}</td>
                  <td>£{product.price_gbp ?? "-"}</td>
                  <td>{product.stock ?? "-"}</td>
                  <td>
                    {product.shop_name ||
                      (product.shop_id ? `Shop #${product.shop_id}` : "-")}
                  </td>
                  <td>
                    <button
                      disabled={deletingProduct === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      {deletingProduct === product.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
