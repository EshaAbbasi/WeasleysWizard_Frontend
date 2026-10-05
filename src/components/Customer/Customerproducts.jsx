import { useState, useEffect } from "react";
import customerService from "../../services/customerService";
import productService from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    customerService
      .listProducts(selectedCategory || undefined)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [selectedCategory]);

  const handleFavorite = async (productId) => {
    await customerService.toggleFavorite(productId, true);
    alert("Added to favorites!");
  };

  return (
    <div>
      <h2>Browse Products</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {products.map((product) => (
        <div key={product.id}>
          {product.image_urls[0] && (
            <img src={product.image_urls[0]} alt={product.name} width="80" />
          )}
          <strong>{product.name}</strong> — {product.category} — £
          {product.price_gbp}
          <button onClick={() => handleFavorite(product.id)}>♡ Favorite</button>
        </div>
      ))}
    </div>
  );
};

export default Products;
