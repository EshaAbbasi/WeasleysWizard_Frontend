import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import shopService from "../../services/shopService";
import productService from "../../services/productService";
import "./OwnerOverview.css";

const asList = (data) =>
  Array.isArray(data) ? data : data?.items || data?.orders || [];
const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});
const getOrderDate = (order) =>
  order.created_at ||
  order.createdAt ||
  order.created_on ||
  order.order_date ||
  order.ordered_at ||
  order.date;
const getOrderRevenue = (order) => {
  const items = order.items || [];
  if (!items.length) return Number(order.total_gbp) || 0;
  const itemRevenue = items.reduce(
    (total, item) =>
      total +
      (Number(item.price_at_purchase ?? item.price_gbp) || 0) *
        (Number(item.quantity) || 0),
    0,
  );
  return itemRevenue || Number(order.total_gbp) || 0;
};
const getStatusGroup = (status = "") => {
  const value = String(status).toLowerCase();
  if (value.includes("deliver")) return "Delivered";
  if (value.includes("transit") || value.includes("ship")) return "In transit";
  return "Processing";
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const OwnerOverview = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      const [orderResult, productResult] = await Promise.allSettled([
        shopService.getMyShopOrders(),
        productService.getMyProducts(),
      ]);
      if (!mounted) return;
      if (orderResult.status === "fulfilled") {
        setOrders(asList(orderResult.value));
      } else {
        setError("Could not load sales activity.");
      }
      if (productResult.status === "fulfilled") {
        setProducts(asList(productResult.value));
      }
      setLoading(false);
    };
    refresh();
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener("owner-orders:updated", refresh);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("owner-orders:updated", refresh);
    };
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + getOrderRevenue(order),
    0,
  );
  const pendingOrders = orders.filter(
    (order) => getStatusGroup(order.status) !== "Delivered",
  ).length;
  const lowStock = products.filter(
    (product) => Number(product.stock) <= 5,
  ).length;
  const stats = [
    {
      label: "Total sales",
      value: currency.format(totalRevenue),
      note: "from your orders",
    },
    {
      label: "Orders",
      value: orders.length,
      note: `${pendingOrders} in progress`,
    },
    {
      label: "Products",
      value: products.length,
      note: `${lowStock} low in stock`,
    },
    {
      label: "Units sold",
      value: orders.reduce(
        (count, order) =>
          count +
          (order.items || []).reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0,
          ),
        0,
      ),
      note: "across all orders",
    },
  ];

  const datedOrders = orders.map((order) => ({
    order,
    date: new Date(getOrderDate(order) || ""),
  }));
  const hasDates =
    orders.length > 0 &&
    datedOrders.every(({ date }) => !Number.isNaN(date.getTime()));
  let chartData;
  if (hasDates) {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
      return {
        label: date.toLocaleDateString("en-GB", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
        total: 0,
      };
    });
    datedOrders.forEach(({ order, date }) => {
      const month = months.find(
        (item) =>
          item.year === date.getFullYear() && item.month === date.getMonth(),
      );
      if (month) month.total += getOrderRevenue(order);
    });
    chartData = months.map((month) => ({
      label: month.label,
      total: month.total,
    }));
  } else {
    chartData = [...orders]
      .sort((left, right) => Number(left.id) - Number(right.id))
      .slice(-12)
      .map((order, index) => ({
        label: `Order ${Math.max(1, orders.length - Math.min(orders.length, 12) + index + 1)}`,
        total: getOrderRevenue(order),
      }));
  }
  const maxSales = Math.max(...chartData.map((item) => item.total), 1);
  const statuses = ["Delivered", "In transit", "Processing"].map((label) => {
    const count = orders.filter(
      (order) => getStatusGroup(order.status) === label,
    ).length;
    return {
      label,
      count,
      percentage: orders.length ? Math.round((count / orders.length) * 100) : 0,
    };
  });
  const recentOrders = [...orders]
    .sort((left, right) => {
      const leftDate = new Date(getOrderDate(left) || 0).getTime();
      const rightDate = new Date(getOrderDate(right) || 0).getTime();
      return rightDate - leftDate || Number(right.id) - Number(left.id);
    })
    .slice(0, 4);

  return (
    <div className="ov">
      <h1 className="ov-hello">
        {greeting()}, <em>{user?.username}!</em>
      </h1>
      {error && (
        <p className="owner-error" role="alert">
          {error}
        </p>
      )}

      <div className="ov-stats">
        {stats.map((s) => (
          <div className="dash-card ov-stat" key={s.label}>
            <span className="ov-stat-label">{s.label}</span>
            <strong>{loading ? "..." : s.value}</strong>
            <span className="ov-stat-note">{s.note}</span>
          </div>
        ))}
      </div>

      <div className="ov-main">
        <section className="dash-card ov-chart">
          <div className="ov-head">
            <h2>Sales</h2>
            <span className="ov-chip">
              {hasDates ? "Last 12 months" : "By order"}
            </span>
          </div>
          <p className="ov-big">
            {loading ? "..." : currency.format(totalRevenue)}
          </p>

          <div className="ov-bars">
            {chartData.map((item, index) => (
              <div className="ov-col" key={`${item.label}-${index}`}>
                <div
                  className={
                    "ov-bar" + (index === chartData.length - 1 ? " on" : "")
                  }
                  style={{
                    height: `${Math.max((item.total / maxSales) * 100, item.total ? 8 : 0)}%`,
                  }}
                  title={`${item.label}: ${currency.format(item.total)}`}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="ov-side">
          <section className="dash-card">
            <h2 className="ov-h2">Order status</h2>
            {statuses.map((o) => (
              <div className="ov-prog" key={o.label}>
                <div className="ov-prog-row">
                  <span>{o.label}</span>
                  <span>
                    {o.count} ({o.percentage}%)
                  </span>
                </div>
                <div className="ov-track">
                  <div style={{ width: `${o.percentage}%` }} />
                </div>
              </div>
            ))}
          </section>

          <section className="dash-card">
            <h2 className="ov-h2">Recent orders</h2>
            <ul className="ov-recent">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <span className="ov-avatar">
                    {
                      (order.customer?.username ||
                        order.customer_name ||
                        `#${order.id}`)[0]
                    }
                  </span>
                  <div>
                    <strong>
                      {order.customer?.username ||
                        order.customer_name ||
                        `Order #${order.id}`}
                    </strong>
                    <small>
                      {(order.items || [])
                        .map(
                          (item) =>
                            item.product?.name ||
                            item.product_name ||
                            `Product ${item.product_id}`,
                        )
                        .join(", ") || "Order"}
                    </small>
                  </div>
                  <span
                    className={
                      "ov-tag " +
                      getStatusGroup(order.status)
                        .toLowerCase()
                        .replace(" ", "-")
                    }
                  >
                    {order.status || "Processing"}
                  </span>
                </li>
              ))}
              {!loading && recentOrders.length === 0 && <li>No orders yet.</li>}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OwnerOverview;
