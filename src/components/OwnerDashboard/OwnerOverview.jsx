import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./OwnerOverview.css";

// ---- placeholder data: replace with your API data ----
const STATS = [
  { label: "Total revenue", value: "BHD 4,820", note: "this month" },
  { label: "Orders", value: "126", note: "34 pending" },
  { label: "Products", value: "48", note: "6 low in stock" },
  { label: "Customers", value: "312", note: "+18 this week" },
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
const SALES = [32, 48, 40, 62, 55, 78, 100, 70, 58, 66, 82, 74]; // % height
const ACTIVE_MONTH = 6;

const ORDER_STATUS = [
  { label: "Delivered", value: 68 },
  { label: "Shipped", value: 20 },
  { label: "Pending", value: 12 },
];

const RECENT = [
  { name: "Hermione G.", item: "Phoenix Wand", status: "Shipped" },
  { name: "Ron W.", item: "House Hoodie", status: "Pending" },
  { name: "Luna L.", item: "Travel Trunk", status: "Delivered" },
  { name: "Neville L.", item: "Gift Box", status: "Delivered" },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const OwnerOverview = () => {
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
            <h2>Sales</h2>
            <span className="ov-chip">This year</span>
          </div>
          <p className="ov-big">BHD 4,820</p>

          <div className="ov-bars">
            {SALES.map((h, i) => (
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
                <li key={r.name}>
                  <span className="ov-avatar">{r.name[0]}</span>
                  <div>
                    <strong>{r.name}</strong>
                    <small>{r.item}</small>
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
    </div>
  );
};

export default OwnerOverview;
