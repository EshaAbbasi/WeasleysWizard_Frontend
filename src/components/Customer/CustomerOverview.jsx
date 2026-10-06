import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import customerService from "../../services/customerService";
import "../OwnerDashboard/OwnerOverview.css";
import "./CustomerOverview.css";

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);
const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});
const STATUS_GROUPS = ["Delivered", "In transit", "Processing"];

const getStatusGroup = (status = "") => {
  const value = String(status || "").toLowerCase();
  if (value.includes("deliver")) return "Delivered";
  if (value.includes("transit") || value.includes("ship")) return "In transit";
  return "Processing";
};

const getOrderDate = (order) =>
  order.created_at ||
  order.createdAt ||
  order.created_on ||
  order.order_date ||
  order.ordered_at ||
  order.date;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const CustomerOverview = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const [orderData, favoriteData] = await Promise.all([
          customerService.getMyOrders(),
          customerService.getMyFavorites(),
        ]);
        if (mounted) {
          setOrders(asList(orderData));
          setFavorites(asList(favoriteData));
          setError("");
        }
      } catch {
        if (mounted) setError("Could not refresh your account activity.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener("orders:updated", refresh);
    window.addEventListener("favorites:updated", refresh);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("orders:updated", refresh);
      window.removeEventListener("favorites:updated", refresh);
    };
  }, []);

  const totalSpent = orders.reduce(
    (total, order) => total + (Number(order.total_gbp) || 0),
    0,
  );
  const inProgress = orders.filter(
    (order) => getStatusGroup(order.status) !== "Delivered",
  ).length;
  const stats = [
    {
      label: "Total orders",
      value: orders.length,
      note: `${inProgress} in progress`,
    },
    {
      label: "Total spent",
      value: currency.format(totalSpent),
      note: "all time",
    },
    { label: "Favorites", value: favorites.length, note: "saved products" },
    {
      label: "Delivered",
      value: orders.filter(
        (order) => getStatusGroup(order.status) === "Delivered",
      ).length,
      note: "completed orders",
    },
  ];
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
  const datedOrders = orders.map((order) => ({
    order,
    date: new Date(getOrderDate(order) || ""),
  }));
  const hasCompleteDates =
    orders.length > 0 &&
    datedOrders.every(({ date }) => !Number.isNaN(date.getTime()));
  if (hasCompleteDates) {
    datedOrders.forEach(({ order, date }) => {
      const month = months.find(
        (item) =>
          item.year === date.getFullYear() && item.month === date.getMonth(),
      );
      if (month) {
        month.total += Number(order.total_gbp) || 0;
      }
    });
  }
  const orderSpending = [...orders]
    .sort((left, right) => Number(left.id) - Number(right.id))
    .slice(-12)
    .map((order) => ({
      label: `#${order.id}`,
      total: Number(order.total_gbp) || 0,
    }));
  const chartData = hasCompleteDates
    ? months.map((month) => ({ label: month.label, total: month.total }))
    : orderSpending;
  const maxSpend = Math.max(...chartData.map((item) => item.total), 1);
  const statuses = STATUS_GROUPS.map((label) => {
    const count = orders.filter(
      (order) => getStatusGroup(order.status) === label,
    ).length;
    return {
      label,
      count,
      value: orders.length ? Math.round((count / orders.length) * 100) : 0,
    };
  });
  const recentOrders = [...orders]
    .sort(
      (left, right) =>
        (new Date(getOrderDate(right) || 0).getTime() || Number(right.id)) -
        (new Date(getOrderDate(left) || 0).getTime() || Number(left.id)),
    )
    .slice(0, 4);

  return (
    <div className="ov">
      <h1 className="ov-hello">
        {greeting()}, <em>{user?.username}!</em>
      </h1>

      {error && (
        <p className="cp-error" role="alert">
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
            <h2>My spending</h2>
            <span className="ov-chip">
              {hasCompleteDates ? "Last 12 months" : "By order"}
            </span>
          </div>
          <p className="ov-big">
            {loading ? "..." : currency.format(totalSpent)}
          </p>

          <div className="ov-bars">
            {chartData.map((item, index) => (
              <div className="ov-col" key={`${item.label}-${index}`}>
                <div
                  className={
                    "ov-bar" + (index === chartData.length - 1 ? " on" : "")
                  }
                  style={{
                    height: `${Math.max((item.total / maxSpend) * 100, item.total ? 8 : 0)}%`,
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
                    {o.count} ({o.value}%)
                  </span>
                </div>
                <div className="ov-track">
                  <div style={{ width: `${o.value}%` }} />
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
                      (order.items?.[0]?.product?.name ||
                        order.items?.[0]?.product_name ||
                        order.items?.[0]?.name ||
                        `#${order.id}`)[0]
                    }
                  </span>
                  <div>
                    <strong>
                      {order.items?.[0]?.product?.name ||
                        order.items?.[0]?.product_name ||
                        order.items?.[0]?.name ||
                        `Order #${order.id}`}
                    </strong>
                    <small>
                      {getOrderDate(order)
                        ? new Date(getOrderDate(order)).toLocaleDateString(
                            "en-GB",
                          )
                        : `Order #${order.id} · ${currency.format(Number(order.total_gbp) || 0)}`}
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

      <section className="dash-card cu-shop">
        <div>
          <h2>Looking for something magical?</h2>
          <p>Browse wands, trunks, house apparel and gifts.</p>
        </div>
        <Link to="/customer-dashboard/products" className="cu-btn">
          Browse Products »
        </Link>
      </section>
    </div>
  );
};

export default CustomerOverview;
