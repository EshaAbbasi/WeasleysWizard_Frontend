import { useState, useEffect } from "react";
import adminService from "../../services/adminService";

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
    <div>
      <h1>Shops ({shops.length})</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading shops...</p>
      ) : shops.length === 0 ? (
        <p className="dash-card">No shops found.</p>
      ) : (
        <div className="dash-card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Shop</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => {
                const approved =
                  shop.is_authorized ?? shop.status === "approved";
                const owner =
                  shop.owner?.username ||
                  shop.owner_username ||
                  shop.owner_name ||
                  (shop.owner_id ? `Owner #${shop.owner_id}` : "Not provided");
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
                    <td>{status}</td>
                    <td>
                      <button
                        disabled={updatingShop === shop.id}
                        onClick={() =>
                          handleAuthorizationChange(shop.id, !approved)
                        }
                      >
                        {updatingShop === shop.id
                          ? "Updating..."
                          : approved
                            ? "Suspend"
                            : "Approve"}
                      </button>
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
