import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import "./OwnerWorkspace.css";

const SalesOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    shopService
      .getMyShopStats()
      .then((data) => setStats(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setError("Could not load sales data."))
      .finally(() => setLoading(false));
  }, []);

  const maxUnits = Math.max(
    ...stats.map((item) => Number(item.units_sold) || 0),
    1,
  );
  const totalUnits = stats.reduce(
    (total, item) => total + (Number(item.units_sold) || 0),
    0,
  );

  return (
    <div className="owner-page">
      <header className="owner-page-header">
        <div>
          <span className="owner-eyebrow">Performance</span>
          <h1>Sales overview</h1>
          <p>Units sold across your products.</p>
        </div>
        <span className="owner-count">{totalUnits} units sold</span>
      </header>

      {error && (
        <p className="owner-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card owner-empty">Loading sales data...</p>
      ) : stats.length === 0 ? (
        <p className="dash-card owner-empty">No sales yet.</p>
      ) : (
        <section className="dash-card owner-panel owner-sales-list">
          <div className="owner-section-title">
            <h2>Units by product</h2>
            <span className="owner-eyebrow">{stats.length} products</span>
          </div>
          {stats.map((item) => {
            const units = Number(item.units_sold) || 0;
            return (
              <div
                className="owner-sale-row"
                key={item.product_id || item.name}
              >
                <span>{item.name || `Product #${item.product_id}`}</span>
                <strong>{units}</strong>
                <div
                  className="owner-sale-track"
                  aria-label={`${units} units sold`}
                >
                  <span style={{ width: `${(units / maxUnits) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default SalesOverview;
