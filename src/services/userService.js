import api from "./api";

const currentUser = async () => {
  const res = await api.get("/current_user");
  return res.data;
};

export { currentUser };
