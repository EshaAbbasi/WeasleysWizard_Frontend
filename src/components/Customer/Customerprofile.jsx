import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import profileService from "../../services/profileService";
import "./CustomerProfile.css";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });

  if (!user) return <p className="dash-card">Loading...</p>;

  const startEdit = () => {
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      passwordConf: "",
    });
    setError("");
    setMessage("");
    setEditing(true);
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) return setError("Username is required.");
    if (form.username.trim() !== form.username)
      return setError("Username cannot start or end with spaces.");
    if (form.password && form.password !== form.passwordConf)
      return setError("Passwords do not match.");

    // send only what the user actually changed
    const payload = {};
    if (form.username !== user.username) payload.username = form.username;
    if (form.email !== user.email) payload.email = form.email;
    if (form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const updated = await profileService.updateMe(payload);
      setUser({ ...user, ...updated });
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Could not update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-card cpf">
      <div className="cpf-top">
        <span className="cpf-avatar">{user.username?.[0]?.toUpperCase()}</span>
        <div>
          <h2>My Profile</h2>
          <span className="cpf-role">Customer</span>
        </div>
      </div>

      {message && <p className="cpf-ok">{message}</p>}
      {error && <p className="cpf-error">{error}</p>}

      {!editing ? (
        <>
          <dl className="cpf-info">
            <div>
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>••••••••</dd>
            </div>
          </dl>
          <button className="cpf-btn" onClick={startEdit}>
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <div className="cpf-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="cpf-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="cpf-grid">
            <div className="cpf-field">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Leave empty to keep"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="cpf-field">
              <label htmlFor="passwordConf">Confirm password</label>
              <input
                id="passwordConf"
                name="passwordConf"
                type="password"
                autoComplete="new-password"
                value={form.passwordConf}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="cpf-actions">
            <button className="cpf-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="cpf-btn ghost"
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
