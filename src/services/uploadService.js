// src/services/uploadService.js

import api from "./api";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

export default { uploadImage };
