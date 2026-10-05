// src/services/authService.js

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = data.token.split(".")[1];
      const tokenJSON = atob(payload);
      return JSON.parse(tokenJSON);
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    console.log(err);
    throw new Error(err.message || err);
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Login failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = data.token.split(".")[1];
      const tokenJSON = atob(payload);
      return JSON.parse(tokenJSON);
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    console.log(err);
    throw new Error(err.message || err);
  }
};

export { signUp, signIn };
