// src/contexts/UserContext.jsx

import { createContext, useState, useEffect, useContext } from "react";
import { signIn, signUp } from "../services/authService";
import { currentUser } from "../services/userService";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    currentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const userData = await signIn(credentials);
    const me = await currentUser();
    setUser(me || userData);
    return userData;
  };

  const register = async (userData) => {
    const newUser = await signUp(userData);
    const me = await currentUser();
    setUser(me || newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
