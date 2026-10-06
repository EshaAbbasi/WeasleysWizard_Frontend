import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import Logo from "../Logo/Logo";
import "./NavBar.css";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const role = user?.role?.toLowerCase() || "guest";

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className={`navbar role-${role}`}>
      <Link to="/" className="navbar-logo">
        <Logo />
        <span className="navbar-title">Weasleys' Wizard Wheezes</span>
      </Link>

      <ul className="navbar-links">
        {user ? (
          <>
            <li className="navbar-greeting">Hello, {user.username}</li>
            <li>
              <Link to="/" className="nav-btn outline" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sign-up" className="nav-btn primary">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/sign-in" className="nav-btn outline">
                Sign In
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
