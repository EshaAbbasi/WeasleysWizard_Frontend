import api, { errorMessage } from "./api";
import { currentUser } from "./userService";

const persistTokenAndLoadUser = async (data) => {
  if (!data?.token) {
    throw new Error("Invalid response from server");
  }
  localStorage.setItem("token", data.token);
  const me = await currentUser();
  return { ...me, role: me.role || data.role };
};

const signUp = async (formData) => {
  try {
    const res = await api.post("/register", formData);
    return persistTokenAndLoadUser(res.data);
  } catch (err) {
    throw new Error(errorMessage(err.response?.data, err.message || "Registration failed"));
  }
};

const signIn = async (formData) => {
  try {
    const res = await api.post("/login", formData);
    return persistTokenAndLoadUser(res.data);
  } catch (err) {
    throw new Error(errorMessage(err.response?.data, err.message || "Login failed"));
  }
};

export { signUp, signIn };
