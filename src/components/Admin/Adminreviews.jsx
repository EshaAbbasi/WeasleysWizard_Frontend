import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import "./AdminPages.css";

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReview, setDeletingReview] = useState(null);

  const loadReviews = async () => {
    try {
      const [reviewsResult, productsResult] = await Promise.allSettled([
        adminService.listAllReviews(),
        adminService.listAllProducts(),
      ]);
      const products =
        productsResult.status === "fulfilled"
          ? asList(productsResult.value)
          : [];
      let rows;
      if (reviewsResult.status === "fulfilled") {
        rows = asList(reviewsResult.value);
      } else {
        const results = await Promise.allSettled(
          products.map(async (product) => ({
            product,
            reviews: asList(await adminService.listProductReviews(product.id)),
          })),
        );
        rows = results
          .filter((result) => result.status === "fulfilled")
          .flatMap(({ value }) =>
            value.reviews.map((review) => ({
              ...review,
              product_name: value.product.name,
            })),
          );
        if (results.some((result) => result.status === "rejected")) {
          setError("Some product reviews could not be loaded.");
        }
      }
      const productNames = new Map(
        products.map((product) => [String(product.id), product.name]),
      );
      setReviews(
        rows.map((review) => ({
          ...review,
          product_name:
            review.product_name ||
            review.product?.name ||
            productNames.get(String(review.product_id)),
        })),
      );
    } catch {
      setError(
        "Could not load reviews. Check your admin access and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    setDeletingReview(reviewId);
    try {
      await adminService.deleteReview(reviewId);
      setReviews((current) =>
        current.filter((review) => review.id !== reviewId),
      );
    } catch {
      setError("Could not delete this review.");
    } finally {
      setDeletingReview(null);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Platform management</span>
          <h1>Reviews</h1>
        </div>
        <span className="admin-count">{reviews.length} reviews</span>
      </header>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card admin-state">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="dash-card admin-state">No reviews found.</p>
      ) : (
        <div className="dash-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    {review.product_name || `Product #${review.product_id}`}
                  </td>
                  <td>
                    {review.username ||
                      review.user_name ||
                      review.user?.username ||
                      review.author?.username ||
                      review.customer?.username ||
                      "Customer name unavailable"}
                  </td>
                  <td>{review.rating ? `${review.rating}/5` : "-"}</td>
                  <td>{review.comment || "-"}</td>
                  <td>
                    <button
                      className="admin-button danger"
                      disabled={deletingReview === review.id}
                      onClick={() => handleDelete(review.id)}
                    >
                      {deletingReview === review.id ? "Deleting..." : "Delete"}
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

export default AdminReviews;
