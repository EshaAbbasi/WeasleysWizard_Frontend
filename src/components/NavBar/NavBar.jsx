import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import "./NavBar.css";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Weasleys' Wizard Wheezes
      </Link>

      <ul className="navbar-links">
        {user ? (
          <>
            <li className="navbar-greeting">Hello, {user.username}</li>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
