import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { signIn } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import WelcomeLetter from "../WelcomeLetter/WelcomeLetter";
import { startMusic, stopMusic } from "../../utils/welcomeMusic";
import "../AuthForm/AuthForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    startMusic(); // starts right on click (browsers require a user click)
    try {
      const signedInUser = await signIn(formData);
      const role = signedInUser.role?.toLowerCase();
      const path =
        role === "admin"
          ? "/admin-dashboard"
          : role === "owner"
            ? "/owner-dashboard"
            : "/customer-dashboard";

      setWelcome({ user: signedInUser, path });
    } catch (err) {
      stopMusic();
      setMessage(err.message);
    }
  };

  const handleWelcomeDone = () => {
    stopMusic(); // music stops as the user enters the dashboard
    setUser(welcome.user);
    navigate(welcome.path);
  };

  return (
    <main className="auth-page">
      <div className="auth-card narrow">
        <h1>Sign In</h1>
        <p className="auth-message">{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="auth-field full">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                autoComplete="off"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field full">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                autoComplete="off"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-btn primary">
              Sign In
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
          username={welcome.user.username || formData.username}
          onDone={handleWelcomeDone}
        />
      )}
    </main>
  );
};

export default SignInForm;
