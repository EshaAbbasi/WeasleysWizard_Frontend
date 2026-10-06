import { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import "./DashboardLayout.css";

const DashboardLayout = ({ links }) => {
  const { logout } = useContext(UserContext);

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
          <button className="dash-logout" onClick={logout}>
            Log Out
          </button>
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
