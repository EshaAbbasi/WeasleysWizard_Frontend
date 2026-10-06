import { useEffect, useState } from "react";
import adminService from "../../services/adminService";

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReview, setDeletingReview] = useState(null);

  const loadReviews = async () => {
    try {
      const products = asList(await adminService.listAllProducts());
      const results = await Promise.allSettled(
        products.map(async (product) => ({
          product,
          reviews: asList(await adminService.listProductReviews(product.id)),
        })),
      );
      const failed = results.some((result) => result.status === "rejected");
      setReviews(
        results
          .filter((result) => result.status === "fulfilled")
          .flatMap(({ value }) =>
            value.reviews.map((review) => ({
              ...review,
              product_name: value.product.name,
            })),
          ),
      );
      if (failed) setError("Some product reviews could not be loaded.");
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
    <div>
      <h1>Reviews ({reviews.length})</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="dash-card">No reviews found.</p>
      ) : (
        <div className="dash-card" style={{ overflowX: "auto" }}>
          <table>
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
                      (review.user_id ? `User #${review.user_id}` : "-")}
                  </td>
                  <td>{review.rating ? `${review.rating}/5` : "-"}</td>
                  <td>{review.comment || "-"}</td>
                  <td>
                    <button
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
