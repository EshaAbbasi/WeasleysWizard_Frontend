import api from "./api";

const BACKEND_ROOT = (import.meta.env.VITE_BACK_END_SERVER_URL || "").replace(
  /\/$/,
);

export const resolveImageUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const imageUrl = value.trim();
  if (imageUrl.startsWith("//"))
    return `${window.location.protocol}${imageUrl}`;
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl.replace(
      /^http:\/\/res\.cloudinary\.com\//i,
      "https://res.cloudinary.com/",
    );
  }

  const base = BACKEND_ROOT || window.location.origin;
  return new URL(imageUrl, `${base}/`).href;
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload-image", formData);
  const url =
    res.data?.url ||
    res.data?.secure_url ||
    res.data?.image_url ||
    res.data?.path ||
    (typeof res.data === "string" ? res.data : "");
  if (!url) throw new Error("The image upload did not return an image URL.");
  return resolveImageUrl(url);
};

export default { uploadImage };
