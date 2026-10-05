import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import uploadService from "../../services/uploadService";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Shop Profile</h2>
      {error && <p>{error}</p>}

      {!shop && (
        <form onSubmit={handleCreate}>
          <p>You don't have a shop yet. Register one to get started.</p>
          <input
            name="name"
            placeholder="Shop Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Shop Description"
            value={form.description}
            onChange={handleChange}
          />
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
          {form.logo_url && (
            <img src={form.logo_url} alt="Logo preview" width="80" />
          )}
          <button type="submit">Submit for Approval</button>
        </form>
      )}

      {shop && (
        <>
          <p>
            Status: {shop.status}{" "}
            {shop.is_authorized ? "(Approved)" : "(Awaiting admin approval)"}
          </p>
          <form onSubmit={handleUpdate}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo preview" width="80" />
            )}
            <button type="submit">Save Changes</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
