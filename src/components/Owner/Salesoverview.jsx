import { useState, useEffect } from "react";
import shopService from "../../services/shopService";

const SalesOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopService
      .getMyShopStats()
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (stats.length === 0) return <p>No sales yet.</p>;

  const maxUnits = Math.max(...stats.map((s) => s.units_sold));

  return (
    <div>
      <h2>Sales Overview — Units Sold per Product</h2>
      {stats.map((item) => (
        <div key={item.name} style={{ marginBottom: "10px" }}>
          <span>
            {item.name} ({item.units_sold})
          </span>
          <div style={{ background: "#eee", width: "100%", height: "16px" }}>
            <div
              style={{
                background: "#b8860b",
                width: `${(item.units_sold / maxUnits) * 100}%`,
                height: "100%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesOverview;
