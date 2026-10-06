const ROOT = (import.meta.env.VITE_BACK_END_SERVER_URL || "").replace(
  /\/$/,
  "",
);
const BASE_URL = `${ROOT}/api`;

const errorMessage = (responseData, fallback) => {
  if (responseData == null) return fallback;
  if (typeof responseData === "string" && responseData.trim())
    return responseData;
  const detail = responseData.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.detail || JSON.stringify(item))
      .join("; ");
  }
  return fallback;
};

const request = async (method, path, data, config = {}) => {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  const params = config.params || {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const headers = new Headers(config.headers);
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isFormData = data instanceof FormData;
  let body;
  if (data !== undefined) {
    if (isFormData) {
      body = data;
      headers.delete("Content-Type");
    } else {
      body = JSON.stringify(data);
      headers.set("Content-Type", "application/json");
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
    cache: config.cache,
  });
  const responseText = await response.text();
  let responseData = responseText;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  } else {
    responseData = null;
  }

  const result = {
    data: responseData,
    status: response.status,
    headers: response.headers,
  };

  if (!response.ok) {
    const error = new Error(
      errorMessage(responseData, response.statusText || "Request failed"),
    );
    error.response = result;
    throw error;
  }

  return result;
};

const api = {
  get: (path, config) => request("GET", path, undefined, config),
  post: (path, data, config) => request("POST", path, data, config),
  put: (path, data, config) => request("PUT", path, data, config),
  delete: (path, config) => request("DELETE", path, undefined, config),
};

export default api;
export { BASE_URL, errorMessage };
