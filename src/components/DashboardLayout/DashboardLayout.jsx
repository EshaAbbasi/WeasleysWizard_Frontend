import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import "./DashboardLayout.css";

const DashboardLayout = ({ links, showCart = false }) => {
  const { logout } = useContext(UserContext);
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // user is empty now, so "/" shows the landing page
  };

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <header className="dash-top">
          <nav className="dash-pill" aria-label="Dashboard">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  "dash-link" + (isActive ? " active" : "")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="dash-actions">
            {showCart && (
              <button className="dash-cart" aria-label={`Cart, ${count} items`}>
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                {count > 0 && <span className="dash-cart-badge">{count}</span>}
              </button>
            )}
            <button className="dash-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
