import { useState, useEffect } from "react";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import CategoryBar from "./CategoryBar";
import "./CustomerProducts.css";

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // ids favorited this session
  const [justAdded, setJustAdded] = useState(null); // id for the "Added" flash
  const [addError, setAddError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const handleOpenDetails = async (product) => {
    setSelectedProduct(product);
    setActiveImage(product.image_urls?.[0] || "");
    setReviews([]);
    setDetailsLoading(true);
    const [productResult, reviewsResult] = await Promise.allSettled([
      productService.getProduct(product.id),
      customerService.getProductReviews(product.id),
    ]);
    const details =
      productResult.status === "fulfilled" ? productResult.value : product;
    setSelectedProduct(details);
    setActiveImage((current) => current || details.image_urls?.[0] || "");
    if (reviewsResult.status === "fulfilled") {
      const data = reviewsResult.value;
      setReviews(Array.isArray(data) ? data : data?.items || []);
    }
    setDetailsLoading(false);
  };

  useEffect(() => {
    if (!selectedProduct) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedProduct]);

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
                  onClick={() => handleOpenDetails(product)}
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
                  onClick={() => handleOpenDetails(product)}
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

      {selectedProduct && (
        <div
          className="cp-modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="cp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cp-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="cp-modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ×
            </button>
            <div className="cp-detail-grid">
              <div>
                <div className="cp-detail-image">
                  {activeImage ? (
                    <img src={activeImage} alt={selectedProduct.name} />
                  ) : (
                    <span>No image available</span>
                  )}
                </div>
                <div className="cp-thumbnails" aria-label="Product images">
                  {(selectedProduct.image_urls || []).map((image, index) => (
                    <button
                      className={activeImage === image ? "active" : ""}
                      key={`${image}-${index}`}
                      onClick={() => setActiveImage(image)}
                      aria-label={`Show product image ${index + 1}`}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="cp-detail-copy">
                <span className="cp-cat">{selectedProduct.category}</span>
                <h2 id="cp-detail-title">{selectedProduct.name}</h2>
                <p className="cp-price">£{selectedProduct.price_gbp}</p>
                <p className="cp-description">
                  {selectedProduct.description || "No description provided."}
                </p>
                <SellerDetails product={selectedProduct} />
                <button
                  className="cp-add"
                  onClick={() => handleAdd(selectedProduct)}
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <section className="cp-reviews" aria-labelledby="cp-reviews-title">
              <h3 id="cp-reviews-title">Customer Reviews ({reviews.length})</h3>
              {detailsLoading ? (
                <p>Loading product details and reviews...</p>
              ) : reviews.length ? (
                reviews.map((review) => (
                  <article className="cp-review" key={review.id}>
                    <div className="cp-review-heading">
                      <strong>
                        {review.username || review.user_name || "Customer"}
                      </strong>
                      <span aria-label={`${review.rating || 0} out of 5 stars`}>
                        {"★".repeat(
                          Math.max(0, Math.min(5, Number(review.rating) || 0)),
                        )}
                        {"☆".repeat(
                          5 -
                            Math.max(
                              0,
                              Math.min(5, Number(review.rating) || 0),
                            ),
                        )}
                      </span>
                    </div>
                    <p>{review.comment || "No written comment."}</p>
                  </article>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </section>
          </section>
        </div>
      )}
    </div>
  );
};

const SellerDetails = ({ product }) => {
  const shop = product.shop || product.owner?.shop || {};
  const owner = product.owner || shop.owner || {};
  const shopName = shop.name || product.shop_name || "Seller";
  const ownerName =
    owner.username ||
    owner.name ||
    product.owner_name ||
    product.owner_username;
  const logo = shop.logo_url || product.shop_logo_url || product.logo_url || "";

  return (
    <div className="cp-seller">
      {logo ? (
        <img src={logo} alt={`${shopName} logo`} />
      ) : (
        <span className="cp-seller-placeholder" aria-hidden="true">
          {shopName.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div>
        <strong>{shopName}</strong>
        <span>{ownerName ? `Owner: ${ownerName}` : "Product seller"}</span>
      </div>
    </div>
  );
};

export default Products;
