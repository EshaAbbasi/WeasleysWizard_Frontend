import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import "./AdminPages.css";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingShop, setUpdatingShop] = useState(null);

  const loadShops = async () => {
    try {
      const data = await adminService.listAllShops();
      setShops(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load shops. Check your admin access and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  const handleAuthorizationChange = async (shopId, isAuthorized) => {
    setUpdatingShop(shopId);
    setError("");
    try {
      await adminService.updateShopAuthorization(shopId, isAuthorized);
      await loadShops();
    } catch {
      setError("Could not update this shop's approval status.");
    } finally {
      setUpdatingShop(null);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Platform management</span>
          <h1>Shops</h1>
        </div>
        <span className="admin-count">{shops.length} shops</span>
      </header>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card admin-state">Loading shops...</p>
      ) : shops.length === 0 ? (
        <p className="dash-card admin-state">No shops found.</p>
      ) : (
        <div className="dash-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => {
                const approved =
                  shop.is_authorized ?? shop.status === "approved";
                const owner =
                  shop.owner?.username ||
                  shop.owner?.name ||
                  shop.owner_username ||
                  shop.owner_name ||
                  "Owner name unavailable";
                const status =
                  shop.status === "suspended"
                    ? "Suspended"
                    : approved
                      ? "Approved"
                      : "Pending";
                return (
                  <tr key={shop.id}>
                    <td>
                      {shop.logo_url && (
                        <img src={shop.logo_url} alt="" width="40" />
                      )}{" "}
                      <strong>{shop.name}</strong>
                    </td>
                    <td>{owner}</td>
                    <td>
                      <span className={`admin-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={approved ? "approved" : "not-approved"}
                        disabled={updatingShop === shop.id}
                        aria-label={`Approval for ${shop.name}`}
                        onChange={(event) =>
                          handleAuthorizationChange(
                            shop.id,
                            event.target.value === "approved",
                          )
                        }
                      >
                        <option value="approved">Approved</option>
                        <option value="not-approved">Not approved</option>
                      </select>
                      {updatingShop === shop.id && (
                        <span className="admin-updating">Updating...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Shops;
