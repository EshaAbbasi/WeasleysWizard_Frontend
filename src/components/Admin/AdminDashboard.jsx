import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const AdminDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main>
      <h1>Welcome{user?.username ? `, ${user.username}` : ""}!</h1>
      <p>Welcome to your admin dashboard.</p>
    </main>
  );
};

export default AdminDashboard;
