import api from "./api";

// Calls PUT {BACKEND}/api/users/me — change the path if your route differs
const updateMe = (payload) => api.put("/users/me", payload).then((r) => r.data);

export default { updateMe };
