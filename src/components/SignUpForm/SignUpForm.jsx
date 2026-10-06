import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router";

import { signUp } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import WelcomeLetter from "../WelcomeLetter/WelcomeLetter";
import { startMusic, stopMusic } from "../../utils/welcomeMusic";
import "../AuthForm/AuthForm.css";

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
    role: "user",
  });

  const { username, email, password, passwordConf, role } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!username.trim()) return setMessage("Username is required.");
    if (username.trim() !== username)
      return setMessage("Username cannot start or end with spaces.");
    if (password !== passwordConf) return setMessage("Passwords do not match.");

    startMusic(); // starts right on click
    try {
      const newUser = await signUp({ username, email, password, role });
      const path =
        role === "owner" ? "/owner-dashboard" : "/customer-dashboard";
      setWelcome({ user: newUser, path });
    } catch (error) {
      stopMusic();
      setMessage(error.message);
    }
  };

  const handleWelcomeDone = () => {
    stopMusic(); // music stops as the user enters the dashboard
    setUser(welcome.user);
    navigate(welcome.path);
  };

  const isFormInvalid = () =>
    !(username && email && password && password === passwordConf && role);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p className="auth-message">{message}</p>
        <form onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="auth-field">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="confirm">Confirm Password:</label>
              <input
                type="password"
                id="confirm"
                name="passwordConf"
                value={passwordConf}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field full">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>

          <p className="auth-switch">
            Already have an account? <Link to="/sign-in">Login</Link>
          </p>

          <div className="auth-actions">
            <button
              type="submit"
              className="auth-btn primary"
              disabled={isFormInvalid()}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="auth-btn secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {welcome && (
        <WelcomeLetter
          username={welcome.user.username || username}
          onDone={handleWelcomeDone}
        />
      )}
    </main>
  );
};

export default SignUpForm;
