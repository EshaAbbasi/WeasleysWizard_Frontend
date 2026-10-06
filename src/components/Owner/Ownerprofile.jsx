import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import uploadService, { resolveImageUrl } from "../../services/uploadService";
import "./OwnerProfile.css";
import "./OwnerWorkspace.css";
const Profile = () => {
  const [shop, setShop] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", logo_url: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    shopService
      .getMyShop()
      .then((data) => {
        setShop(data);
        setForm({
          name: data.name,
          description: data.description || "",
          logo_url: data.logo_url || "",
        });
      })
      .catch(() => setShop(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadService.uploadImage(file);
    setForm({ ...form, logo_url: url });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newShop = await shopService.createShop(form);
      setShop(newShop);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create shop");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const updated = await shopService.updateMyShop(form);
      setShop(updated);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update shop");
    }
  };

  if (loading)
    return <p className="dash-card owner-empty">Loading shop profile...</p>;

  const formFields = (
    <>
      <div className="pf-field">
        <label>Shop name</label>
        <input
          name="name"
          placeholder="Shop Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="pf-field">
        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          placeholder="Shop Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="pf-field">
        <label>Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {form.logo_url && (
          <img
            className="pf-logo"
            src={resolveImageUrl(form.logo_url)}
            alt="Logo preview"
          />
        )}
      </div>
    </>
  );

  return (
    <div className="owner-page">
      <header className="owner-page-header">
        <div>
          <span className="owner-eyebrow">Your shop</span>
          <h1>Shop profile</h1>
          <p>Manage your shop details and approval status.</p>
        </div>
        {shop && (
          <span className="owner-count">
            {shop.is_authorized ? "Approved" : "Awaiting approval"}
          </span>
        )}
      </header>
      {error && (
        <p className="owner-error" role="alert">
          {error}
        </p>
      )}

      <section className="dash-card pf">
        {!shop && (
          <form onSubmit={handleCreate}>
            <p className="pf-note">
              You don't have a shop yet. Register one to get started.
            </p>
            {formFields}
            <button className="pf-btn" type="submit">
              Submit for Approval
            </button>
          </form>
        )}

        {shop && (
          <>
            <span
              className={"pf-status " + (shop.is_authorized ? "ok" : "wait")}
            >
              {shop.status || (shop.is_authorized ? "Approved" : "Pending")}
            </span>
            <form onSubmit={handleUpdate}>
              {formFields}
              <button className="pf-btn" type="submit">
                Save Changes
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};
export default Profile;
