import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import customerService from "../../services/customerService";
import { useCart } from "../../contexts/CartContext";
import { resolveImageUrl } from "../../services/uploadService";
import "./CustomerProducts.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const Favorites = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    setError("");
    try {
      setFavorites(await customerService.getMyFavorites());
    } catch {
      setError("Could not load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favorites:updated", loadFavorites);
    return () => window.removeEventListener("favorites:updated", loadFavorites);
  }, []);

  const removeFavorite = async (productId) => {
    try {
      await customerService.toggleFavorite(productId, false);
      setFavorites((current) =>
        current.filter(
          (favorite) => String(favorite.product_id) !== String(productId),
        ),
      );
      window.dispatchEvent(new Event("favorites:updated"));
    } catch {
      setError("Could not update your favorites. Please try again.");
    }
  };

  const addProductToCart = (product) => {
    const result = addToCart({
      id: product.id,
      name: product.name,
      price_gbp: product.price_gbp,
      image: resolveImageUrl(product.image_urls?.[0]),
      stock: product.stock,
    });
    if (!result.ok) setError(result.message);
    else setError("");
  };

  return (
    <div className="cp">
      <header className="dash-card cp-head">
        <h2>My Favorites</h2>
        <p>Your saved products, ready when you are.</p>
      </header>

      {error && (
        <p className="cp-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="dash-card cp-note">Loading favorites...</p>}
      {!loading && favorites.length === 0 && (
        <p className="dash-card cp-note">You have no saved products yet.</p>
      )}

      <div className="cp-grid">
        {favorites.map((favorite) => {
          const product = favorite.product;
          if (!product) return null;
          return (
            <article
              className="dash-card cp-card"
              key={favorite.id || product.id}
            >
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
                  className="cp-fav on"
                  onClick={() => removeFavorite(product.id)}
                  aria-label={`Remove ${product.name} from favorites`}
                  aria-pressed="true"
                >
                  ♥
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
                className="cp-add"
                onClick={() => addProductToCart(product)}
              >
                Add to Cart
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
