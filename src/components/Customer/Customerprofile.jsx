import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: Customer</p>
    </div>
  );
};

export default Profile;
