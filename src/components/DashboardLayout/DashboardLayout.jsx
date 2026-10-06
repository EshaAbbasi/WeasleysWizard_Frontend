import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import customerService from "../../services/customerService";
import { resolveImageUrl } from "../../services/uploadService";
import "./DashboardLayout.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const DashboardLayout = ({ links, showCart = false }) => {
  const { logout } = useContext(UserContext);
  const { items, count, setQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price_gbp) || 0) * item.qty,
    0,
  );

  useEffect(() => {
    if (!cartOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // user is empty now, so "/" shows the landing page
  };

  const handleCheckout = async () => {
    setCheckoutBusy(true);
    setCheckoutError("");
    setCheckoutNotice("");
    try {
      await customerService.checkout({
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        payment_method: "Card",
      });
      clearCart();
      setCheckoutNotice("Order confirmed. Payment method: Card.");
      window.dispatchEvent(new Event("orders:updated"));
    } catch (error) {
      setCheckoutError(
        error.response?.data?.detail ||
          "Could not confirm your order. Your cart has been kept.",
      );
    } finally {
      setCheckoutBusy(false);
    }
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
              <button
                className="dash-cart"
                aria-label={`Cart, ${count} items`}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen(true)}
              >
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
      {cartOpen && (
        <div
          className="cart-backdrop"
          onClick={() => setCartOpen(false)}
          role="presentation"
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="cart-drawer-head">
              <div>
                <h2 id="cart-title">Your Cart</h2>
                <span>
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                className="cart-close"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCartOpen(false);
                }}
                aria-label="Close cart"
              >
                ×
              </button>
            </header>
            {checkoutNotice && (
              <div className="cart-checkout-notice" role="status">
                <span>{checkoutNotice}</span>
                <Link
                  to="/customer-dashboard/orders"
                  onClick={() => setCheckoutNotice("")}
                >
                  View orders
                </Link>
              </div>
            )}
            {items.length === 0 ? (
              <p className="cart-empty">Your cart is empty.</p>
            ) : (
              <>
                <ul className="cart-lines">
                  {items.map((item) => (
                    <li className="cart-line" key={item.id}>
                      {item.image && (
                        <img src={resolveImageUrl(item.image)} alt="" />
                      )}
                      <div className="cart-line-info">
                        <strong>{item.name}</strong>
                        <span>
                          {currency.format(Number(item.price_gbp) || 0)}
                        </span>
                        <div className="cart-quantity">
                          <button
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => setQty(item.id, item.qty - 1)}
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            aria-label={`Increase ${item.name} quantity`}
                            disabled={item.qty >= item.stock}
                            onClick={() => setQty(item.id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="cart-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <footer className="cart-drawer-foot">
                  {checkoutError && (
                    <p className="cp-error" role="alert">
                      {checkoutError}
                    </p>
                  )}
                  <div>
                    <strong>Subtotal</strong>
                    <strong>{currency.format(total)}</strong>
                  </div>
                  <p className="cart-payment-note">Payment method: Card</p>
                  <button
                    className="cart-continue"
                    disabled={checkoutBusy || items.length === 0}
                    onClick={handleCheckout}
                  >
                    {checkoutBusy ? "Confirming..." : "Confirm order"}
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
