import { useState, useEffect, useRef } from "react";
import productService from "../../services/productService";
import uploadService, { resolveImageUrl } from "../../services/uploadService";
import "./OwnerWorkspace.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const EMPTY_PRODUCT = {
  name: "",
  category: "",
  description: "",
  price_gbp: "",
  stock: 0,
  image_urls: [],
  is_banned_at_hogwarts: false,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getMyProducts();
      setProducts(Array.isArray(data) ? data : data?.items || []);
    } catch {
      setProducts([]);
      setError("Could not load your products.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadService.uploadImage(file));
      }
      setForm((current) => ({
        ...current,
        image_urls: [...current.image_urls, ...urls],
      }));
      setError("");
    } catch {
      setError("Could not upload product images.");
    }
  };

  const removeImage = (url) =>
    setForm((current) => ({
      ...current,
      image_urls: current.image_urls.filter((image) => image !== url),
    }));

  const resetForm = () => {
    setForm(EMPTY_PRODUCT);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await productService.updateProduct(editingId, form);
      } else {
        await productService.createProduct(form);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price_gbp: product.price_gbp,
      stock: product.stock,
      image_urls: product.image_urls || [],
      is_banned_at_hogwarts: product.is_banned_at_hogwarts,
    });
    setEditingId(product.id);
    window.requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete product");
    }
  };

  return (
    <div className="owner-page">
      <header className="owner-page-header">
        <div>
          <span className="owner-eyebrow">Inventory</span>
          <h1>Products</h1>
          <p>Add items to your shop and keep stock details current.</p>
        </div>
        <span className="owner-count">{products.length} products</span>
      </header>

      {error && (
        <p className="owner-error" role="alert">
          {error}
        </p>
      )}

      <section className="owner-page owner-products-section">
        <div className="owner-section-title">
          <h2>My products</h2>
          <span className="owner-eyebrow">{products.length} listed</span>
        </div>
        {loading ? (
          <p className="dash-card owner-empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="dash-card owner-empty">No products listed yet.</p>
        ) : (
          <div className="owner-products-grid">
            {products.map((product) => (
              <article
                className="dash-card owner-product-card"
                key={product.id}
              >
                <div className="owner-product-image">
                  {product.image_urls?.[0] ? (
                    <img
                      src={resolveImageUrl(product.image_urls[0])}
                      alt={product.name}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="owner-product-body">
                  <h3>{product.name}</h3>
                  <div className="owner-product-meta">
                    <span>{product.category}</span>
                    <span>
                      {currency.format(Number(product.price_gbp) || 0)}
                    </span>
                    <span>{product.stock} in stock</span>
                  </div>
                  <div className="owner-product-actions">
                    <button
                      className="owner-secondary-button"
                      type="button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="owner-danger-button"
                      type="button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        ref={editorRef}
        className="dash-card owner-panel owner-product-editor"
      >
        <div className="owner-panel-title">
          <h2>{editingId ? "Edit product" : "Add a product"}</h2>
        </div>
        <form className="owner-form" onSubmit={handleSubmit}>
          <div className="owner-form-grid">
            <label className="owner-field">
              Product name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="owner-field">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="owner-field">
              Price (BHD)
              <input
                name="price_gbp"
                type="number"
                step="0.001"
                min="0"
                value={form.price_gbp}
                onChange={handleChange}
                required
              />
            </label>
            <label className="owner-field">
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
            <label className="owner-field owner-field-wide">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
            </label>
            <label className="owner-toggle">
              <input
                name="is_banned_at_hogwarts"
                type="checkbox"
                checked={form.is_banned_at_hogwarts}
                onChange={handleChange}
              />
              Banned at Hogwarts
            </label>
            <label className="owner-field">
              Product images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {form.image_urls.length > 0 && (
            <div className="owner-image-previews">
              {form.image_urls.map((url) => (
                <div className="owner-image-preview" key={url}>
                  <img src={resolveImageUrl(url)} alt="Product preview" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="owner-product-actions">
            <button className="owner-primary-button" type="submit">
              {editingId ? "Save product" : "Add product"}
            </button>
            {editingId && (
              <button
                className="owner-secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default Products;
