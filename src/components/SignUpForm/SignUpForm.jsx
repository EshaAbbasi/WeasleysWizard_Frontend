// SignUpForm.jsx

import { useContext, useState } from "react";
import { useNavigate } from "react-router";

// Services
import { signUp } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

const SignUpForm = (props) => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
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

    if (!username.trim()) {
      setMessage("Username is required.");
      return;
    }

    if (username.trim() !== username) {
      setMessage("Username cannot start or end with spaces.");
      return;
    }

    if (password !== passwordConf) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        username,
        email,
        password,
        role,
      };

      const newUser = await signUp(payload);
      setUser(newUser);
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const isFormInvalid = () => {
    return !(
      username &&
      email &&
      password &&
      password === passwordConf &&
      role
    );
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" value={role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
