const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const currentUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/current_user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Unauthorized");
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || err);
  }
};

export { currentUser };
