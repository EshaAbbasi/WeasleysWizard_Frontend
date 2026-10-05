import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const OwnerDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main>
      <h1>Welcome{user?.username ? `, ${user.username}` : ""}!</h1>
      <p>Welcome to your owner dashboard.</p>
    </main>
  );
};

export default OwnerDashboard;
