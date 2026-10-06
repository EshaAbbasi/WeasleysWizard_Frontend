import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import CategoryBar from "./CategoryBar";
import "./CustomerProducts.css";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // ids favorited this session
  const [justAdded, setJustAdded] = useState(null); // id for the "Added" flash
  const [addError, setAddError] = useState("");

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    customerService
      .listProducts(selectedCategory === "All" ? undefined : selectedCategory)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleFavorite = async (productId) => {
    try {
      await customerService.toggleFavorite(productId, true);
      setFavorites((prev) => [...prev, productId]);
    } catch {
      /* ignore */
    }
  };

  const handleAdd = (product) => {
    const result = addToCart({
      id: product.id,
      name: product.name,
      price_gbp: product.price_gbp,
      image: product.image_urls?.[0] || "",
      stock: product.stock,
    });
    if (!result.ok) {
      setAddError(result.message);
      return;
    }
    setAddError("");
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1200);
  };

  return (
    <div className="cp">
      <div className="dash-card cp-head">
        <h2>Browse Products</h2>
        <p>Find something magical for your collection.</p>
        <CategoryBar
          categories={categories}
          active={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {loading && <p className="dash-card cp-note">Loading products...</p>}
      {addError && (
        <p className="cp-error" role="alert">
          {addError}
        </p>
      )}

      {!loading && products.length === 0 && (
        <p className="dash-card cp-note">No products in this category yet.</p>
      )}

      <div className="cp-grid">
        {products.map((product) => {
          const faved = favorites.includes(product.id);
          return (
            <article className="dash-card cp-card" key={product.id}>
              <div className="cp-img">
                <button
                  className="cp-img-open"
                  onClick={() =>
                    navigate(`/customer-dashboard/products/${product.id}`)
                  }
                  aria-label={`View ${product.name} details`}
                >
                  {product.image_urls?.[0] ? (
                    <img src={product.image_urls[0]} alt={product.name} />
                  ) : (
                    <span>No image</span>
                  )}
                </button>
                <button
                  className={"cp-fav" + (faved ? " on" : "")}
                  onClick={() => handleFavorite(product.id)}
                  aria-label="Add to favorites"
                >
                  {faved ? "♥" : "♡"}
                </button>
              </div>

              <span className="cp-cat">{product.category}</span>
              <h3>
                <button
                  className="cp-name"
                  onClick={() =>
                    navigate(`/customer-dashboard/products/${product.id}`)
                  }
                >
                  {product.name}
                </button>
              </h3>
              <p className="cp-price">£{product.price_gbp}</p>

              <button
                className={"cp-add" + (justAdded === product.id ? " done" : "")}
                onClick={() => handleAdd(product)}
              >
                {justAdded === product.id ? "Added ✓" : "Add to Cart"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
