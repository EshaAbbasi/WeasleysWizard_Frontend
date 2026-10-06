import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import "../OwnerDashboard/OwnerOverview.css";
import "./CustomerOverview.css";

// ---- placeholder data: replace with your API data ----
const STATS = [
  { label: "Total orders", value: "14", note: "2 on the way" },
  { label: "Total spent", value: "BHD 186", note: "all time" },
  { label: "Favorites", value: "9", note: "3 added this week" },
  { label: "Wishlist deals", value: "2", note: "items on sale" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SPENDING = [20, 35, 15, 50, 30, 45, 25, 60, 40, 55, 80, 65]; // % height
const ACTIVE_MONTH = 10;

const ORDER_STATUS = [
  { label: "Delivered", value: 72 },
  { label: "Shipped", value: 21 },
  { label: "Processing", value: 7 },
];

const RECENT = [
  { item: "Phoenix Wand", date: "2 Oct", status: "Shipped" },
  { item: "House Hoodie", date: "21 Sep", status: "Delivered" },
  { item: "Travel Trunk", date: "5 Sep", status: "Delivered" },
  { item: "Gift Box", date: "18 Aug", status: "Delivered" },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const CustomerOverview = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="ov">
      <h1 className="ov-hello">
        {greeting()}, <em>{user?.username}!</em>
      </h1>

      <div className="ov-stats">
        {STATS.map((s) => (
          <div className="dash-card ov-stat" key={s.label}>
            <span className="ov-stat-label">{s.label}</span>
            <strong>{s.value}</strong>
            <span className="ov-stat-note">{s.note}</span>
          </div>
        ))}
      </div>

      <div className="ov-main">
        <section className="dash-card ov-chart">
          <div className="ov-head">
            <h2>My spending</h2>
            <span className="ov-chip">This year</span>
          </div>
          <p className="ov-big">BHD 186</p>

          <div className="ov-bars">
            {SPENDING.map((h, i) => (
              <div className="ov-col" key={MONTHS[i]}>
                <div
                  className={"ov-bar" + (i === ACTIVE_MONTH ? " on" : "")}
                  style={{ height: `${h}%` }}
                />
                <span>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="ov-side">
          <section className="dash-card">
            <h2 className="ov-h2">Order status</h2>
            {ORDER_STATUS.map((o) => (
              <div className="ov-prog" key={o.label}>
                <div className="ov-prog-row">
                  <span>{o.label}</span>
                  <span>{o.value}%</span>
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
              {RECENT.map((r) => (
                <li key={r.item}>
                  <span className="ov-avatar">{r.item[0]}</span>
                  <div>
                    <strong>{r.item}</strong>
                    <small>{r.date}</small>
                  </div>
                  <span className={"ov-tag " + r.status.toLowerCase()}>
                    {r.status}
                  </span>
                </li>
              ))}
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
