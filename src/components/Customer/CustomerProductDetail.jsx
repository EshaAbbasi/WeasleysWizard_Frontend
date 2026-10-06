import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
import uploadService from "../../services/uploadService";
import "./CustomerProducts.css";

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);
const currentUserId = (user) => user?.id ?? user?.user_id;
const reviewUserId = (review) => review?.user_id ?? review?.customer_id;
const reviewImage = (review) =>
  review?.image_url || review?.image_urls?.[0] || "";

const CustomerProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [rating, setRating] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPage = async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, reviewData] = await Promise.all([
        productService.getProduct(productId),
        customerService.getProductReviews(productId),
      ]);
      setProduct(productData);
      setActiveImage(productData.image_urls?.[0] || "");
      setReviews(asList(reviewData));
    } catch {
      setError("Could not load this product. It may no longer be available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [productId]);

  const ownReview = reviews.find(
    (review) =>
      currentUserId(user) != null &&
      String(reviewUserId(review)) === String(currentUserId(user)),
  );

  const startEditing = () => {
    setEditingReview(ownReview || null);
    setFormOpen(true);
    setRating(Number(ownReview?.rating) || 0);
    setImageFile(null);
    setNotice("");
    setError("");
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setFormOpen(false);
    setRating(0);
    setImageFile(null);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!rating) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }
    if (!imageFile && !reviewImage(editingReview)) {
      setError("Upload an image to submit your review.");
      return;
    }

    setSaving(true);
    try {
      const imageUrl = imageFile
        ? await uploadService.uploadImage(imageFile)
        : reviewImage(editingReview);
      const payload = { rating, image_url: imageUrl };
      if (editingReview) {
        await customerService.updateReview(editingReview.id, payload);
        setNotice("Your review has been updated.");
      } else {
        await customerService.createReview({
          ...payload,
          product_id: product.id,
        });
        setNotice("Your review has been added.");
      }
      cancelEditing();
      await loadPage();
    } catch (submitError) {
      setError(
        submitError.response?.data?.detail || "Could not save your review.",
      );
    } finally {
      setSaving(false);
    }
  };

  const addProductToCart = () => {
    if (!product) return;
    const result = addToCart({
      id: product.id,
      name: product.name,
      price_gbp: product.price_gbp,
      image: product.image_urls?.[0] || "",
      stock: product.stock,
    });
    if (!result.ok) setError(result.message);
    else setNotice("Added to cart.");
  };

  if (loading) return <p className="dash-card cp-note">Loading product...</p>;
  if (!product) {
    return (
      <div className="cp">
        <p className="cp-error" role="alert">
          {error}
        </p>
        <Link className="cp-back" to="/customer-dashboard/products">
          Back to products
        </Link>
      </div>
    );
  }

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
    <div className="cp cp-detail-page">
      <button className="cp-back" onClick={() => navigate(-1)}>
        ← Back to products
      </button>
      {error && (
        <p className="cp-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="cp-notice" role="status">
          {notice}
        </p>
      )}

      <section className="dash-card cp-product-page">
        <div className="cp-detail-grid">
          <div>
            <div className="cp-detail-image">
              {activeImage ? (
                <img src={activeImage} alt={product.name} />
              ) : (
                <span>No image available</span>
              )}
            </div>
            <div className="cp-thumbnails" aria-label="Product images">
              {(product.image_urls || []).map((image, index) => (
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
            <span className="cp-cat">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="cp-price">£{product.price_gbp}</p>
            <p className="cp-description">
              {product.description || "No description provided."}
            </p>
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
                <span>
                  {ownerName ? `Owner: ${ownerName}` : "Product seller"}
                </span>
              </div>
            </div>
            <button className="cp-add" onClick={addProductToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <section
        className="dash-card cp-reviews"
        aria-labelledby="cp-reviews-title"
      >
        <div className="cp-reviews-title-row">
          <h2 id="cp-reviews-title">Customer Reviews ({reviews.length})</h2>
          {!formOpen && (
            <button className="cp-review-edit" onClick={startEditing}>
              {ownReview ? "Edit your review" : "Write a review"}
            </button>
          )}
        </div>

        {formOpen ? (
          <form className="cp-review-form" onSubmit={submitReview}>
            <fieldset>
              <legend>Your rating</legend>
              <div className="cp-rating-picker">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={value <= rating ? "selected" : ""}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                  >
                    ★
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="cp-image-upload">
              Review image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                required={!reviewImage(editingReview)}
              />
            </label>
            {editingReview && reviewImage(editingReview) && !imageFile && (
              <img
                className="cp-review-image-preview"
                src={reviewImage(editingReview)}
                alt="Current review"
              />
            )}
            {imageFile && (
              <span className="cp-file-name">{imageFile.name}</span>
            )}
            <div className="cp-review-form-actions">
              <button className="cp-add" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingReview
                    ? "Save changes"
                    : "Submit review"}
              </button>
              <button
                className="cp-cancel"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
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
                    5 - Math.max(0, Math.min(5, Number(review.rating) || 0)),
                  )}
                </span>
              </div>
              {reviewImage(review) && (
                <img
                  className="cp-review-image"
                  src={reviewImage(review)}
                  alt={`Review from ${review.username || review.user_name || "customer"}`}
                />
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default CustomerProductDetail;
