import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import productService from "../../services/productService";
import "./AdminPages.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

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
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Platform management</span>
          <h1>Products</h1>
        </div>
        <span className="admin-count">{products.length} products</span>
      </header>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card admin-state">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="dash-card admin-state">No products found.</p>
      ) : (
        <div className="dash-card admin-table-wrap">
          <table className="admin-table">
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
                  <td>{currency.format(Number(product.price_gbp) || 0)}</td>
                  <td>{product.stock ?? "-"}</td>
                  <td>
                    {product.shop_name ||
                      (product.shop_id ? `Shop #${product.shop_id}` : "-")}
                  </td>
                  <td>
                    <button
                      className="admin-button danger"
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
