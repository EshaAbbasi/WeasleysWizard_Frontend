import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
import uploadService, { resolveImageUrl } from "../../services/uploadService";
import "./CustomerProducts.css";

const asList = (data) =>
  Array.isArray(data) ? data : data?.items || data?.reviews || [];
const asReviews = (data) =>
  asList(data).filter(
    (review) => review.is_favorite !== true && review.is_favorite !== 1,
  );
const reviewAuthor = (review) =>
  review?.username ||
  review?.user_name ||
  review?.user?.username ||
  review?.user?.name ||
  review?.author?.username ||
  review?.author?.name ||
  review?.customer?.username ||
  "";
const addReviewAuthors = (reviews, knownReviews) => {
  const knownById = new Map(
    knownReviews.map((review) => [String(review.id), review]),
  );
  return reviews.map((review) => {
    const known = knownById.get(String(review.id));
    return {
      ...known,
      ...review,
      username: reviewAuthor(review) || reviewAuthor(known),
    };
  });
};
const currentUserId = (user) => user?.id ?? user?.user_id;
const reviewUserId = (review) => review?.user_id ?? review?.customer_id;
const reviewImage = (review) =>
  review?.image_url || review?.image_urls?.[0] || "";
const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const CustomerProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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
      setReviews(
        addReviewAuthors(asReviews(reviewData), asReviews(productData.reviews)),
      );
    } catch {
      setError("Could not load this product. It may no longer be available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [productId]);

  useEffect(() => {
    let mounted = true;
    const refreshReviews = () => {
      customerService
        .getProductReviews(productId)
        .then((data) => {
          if (mounted) {
            setReviews((current) => addReviewAuthors(asReviews(data), current));
          }
        })
        .catch(() => {});
    };
    const interval = window.setInterval(refreshReviews, 15000);
    window.addEventListener("reviews:updated", refreshReviews);
    window.addEventListener("focus", refreshReviews);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("reviews:updated", refreshReviews);
      window.removeEventListener("focus", refreshReviews);
    };
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
    setComment(ownReview?.comment || "");
    setImageFile(null);
    setNotice("");
    setError("");
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setFormOpen(false);
    setRating(0);
    setComment("");
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
    if (!comment.trim()) {
      setError("Write a review before submitting.");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = imageFile
        ? await uploadService.uploadImage(imageFile)
        : reviewImage(editingReview);
      const payload = { rating, comment: comment.trim() };
      if (imageUrl) payload.image_urls = [imageUrl];
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
      window.dispatchEvent(new Event("reviews:updated"));
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
      image: resolveImageUrl(product.image_urls?.[0]),
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
                <img src={resolveImageUrl(activeImage)} alt={product.name} />
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
                  <img src={resolveImageUrl(image)} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="cp-detail-copy">
            <span className="cp-cat">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="cp-price">
              {currency.format(Number(product.price_gbp) || 0)}
            </p>
            <p className="cp-description">
              {product.description || "No description provided."}
            </p>
            <div className="cp-seller">
              {logo ? (
                <img src={resolveImageUrl(logo)} alt={`${shopName} logo`} />
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
            <label className="cp-review-comment">
              Your review
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share what you think about this product"
                required
                rows={4}
              />
            </label>
            <label className="cp-image-upload">
              Review image (optional)
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
              />
            </label>
            {editingReview && reviewImage(editingReview) && !imageFile && (
              <img
                className="cp-review-image-preview"
                src={resolveImageUrl(reviewImage(editingReview))}
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
                  {reviewAuthor(review) ||
                    (String(reviewUserId(review)) ===
                    String(currentUserId(user))
                      ? user?.username || user?.name || "You"
                      : "Customer")}
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
              {review.comment && <p>{review.comment}</p>}
              {reviewImage(review) && (
                <img
                  className="cp-review-image"
                  src={resolveImageUrl(reviewImage(review))}
                  alt={`Review from ${review.username || review.user_name || review.user?.username || "customer"}`}
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
