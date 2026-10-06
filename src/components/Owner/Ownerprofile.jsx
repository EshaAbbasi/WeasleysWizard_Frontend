import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import uploadService from "../../services/uploadService";
import "./OwnerProfile.css";
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

  if (loading) return <p className="dash-card">Loading...</p>;

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
          <img className="pf-logo" src={form.logo_url} alt="Logo preview" />
        )}
      </div>
    </>
  );

  return (
    <div className="dash-card pf">
      <h2>Shop Profile</h2>
      {error && <p className="pf-error">{error}</p>}

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
          <span className={"pf-status " + (shop.is_authorized ? "ok" : "wait")}>
            {shop.status}{" "}
            {shop.is_authorized ? "· Approved" : "· Awaiting admin approval"}
          </span>
          <form onSubmit={handleUpdate}>
            {formFields}
            <button className="pf-btn" type="submit">
              Save Changes
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default Profile;
