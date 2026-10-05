import { useState, useEffect } from "react";
import adminService from "../../services/adminService";

const Shops = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = () => {
    adminService
      .listAllShops()
      .then(setShops)
      .catch(() => setShops([]));
  };

  const handleStatusChange = async (shopId, status) => {
    await adminService.updateShopStatus(shopId, status);
    loadShops();
  };

  return (
    <div>
      <h2>All Shops ({shops.length})</h2>
      {shops.map((shop) => (
        <div key={shop.id}>
          {shop.logo_url && (
            <img src={shop.logo_url} alt={shop.name} width="50" />
          )}
          <strong>{shop.name}</strong> — Status: {shop.status}
          <select
            value={shop.status}
            onChange={(e) => handleStatusChange(shop.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Shops;
