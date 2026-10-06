import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import { resolveImageUrl } from "../../services/uploadService";
import CategoryBar from "./CategoryBar";
import "./CustomerProducts.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoritePending, setFavoritePending] = useState([]);
  const [justAdded, setJustAdded] = useState(null); // id for the "Added" flash
  const [addError, setAddError] = useState("");

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => {});

    customerService
      .getMyFavorites()
      .then((rows) =>
        setFavorites(
          rows.map((favorite) =>
            String(favorite.product_id ?? favorite.product?.id),
          ),
        ),
      )
      .catch(() => setFavorites([]));
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
    const favoriteId = String(productId);
    const isFavorite = favorites.includes(favoriteId);
    setFavoritePending((current) => [...current, favoriteId]);
    try {
      await customerService.toggleFavorite(productId, !isFavorite);
      setFavorites((current) =>
        isFavorite
          ? current.filter((id) => id !== favoriteId)
          : [...current, favoriteId],
      );
    } catch {
      setAddError("Could not update favorites. Please try again.");
    } finally {
      setFavoritePending((current) =>
        current.filter((id) => id !== favoriteId),
      );
    }
  };

  const handleAdd = (product) => {
    const result = addToCart({
      id: product.id,
      name: product.name,
      price_gbp: product.price_gbp,
      image: resolveImageUrl(product.image_urls?.[0]),
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
          const favoriteId = String(product.id);
          const faved = favorites.includes(favoriteId);
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
                    <img
                      src={resolveImageUrl(product.image_urls[0])}
                      alt={product.name}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </button>
                <button
                  className={"cp-fav" + (faved ? " on" : "")}
                  onClick={() => handleFavorite(product.id)}
                  disabled={favoritePending.includes(favoriteId)}
                  aria-pressed={faved}
                  aria-label={
                    faved ? "Remove from favorites" : "Add to favorites"
                  }
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
              <p className="cp-price">
                {currency.format(Number(product.price_gbp) || 0)}
              </p>

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
