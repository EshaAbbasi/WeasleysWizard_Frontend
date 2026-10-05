import { useState, useEffect } from "react";
import productService from "../../services/productService";
import uploadService from "../../services/uploadService";

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

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
    loadProducts();
  }, []);

  const loadProducts = () => {
    productService
      .getMyProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (const file of files) {
      urls.push(await uploadService.uploadImage(file));
    }
    setForm({ ...form, image_urls: [...form.image_urls, ...urls] });
  };

  const removeImage = (url) =>
    setForm({ ...form, image_urls: form.image_urls.filter((u) => u !== url) });

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
  };

  const handleDelete = async (id) => {
    await productService.deleteProduct(id);
    loadProducts();
  };

  return (
    <div>
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price_gbp"
          type="number"
          step="0.01"
          placeholder="Price (GBP)"
          value={form.price_gbp}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <label>
          <input
            name="is_banned_at_hogwarts"
            type="checkbox"
            checked={form.is_banned_at_hogwarts}
            onChange={handleChange}
          />
          Banned at Hogwarts
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <div>
          {form.image_urls.map((url) => (
            <span key={url}>
              <img src={url} alt="Product" width="60" />
              <button type="button" onClick={() => removeImage(url)}>
                Remove
              </button>
            </span>
          ))}
        </div>

        <button type="submit">
          {editingId ? "Save Changes" : "Add Product"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>My Products ({products.length})</h2>
      {products.map((product) => (
        <div key={product.id}>
          <strong>{product.name}</strong> — {product.category} — £
          {product.price_gbp} — Stock: {product.stock}
          <button onClick={() => handleEdit(product)}>Edit</button>
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Products;
