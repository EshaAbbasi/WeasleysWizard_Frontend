import api from "./api";

const updateMe = (payload) => api.put("/users/me", payload).then((r) => r.data);

export default { updateMe };
