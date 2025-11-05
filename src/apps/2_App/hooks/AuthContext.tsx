// AuthContext.js – Like a shared family notebook saying "Who's home?"
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // Hook to check "Am I in?"

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Starts as "nope"

  const login = () => setIsLoggedIn(true); // Fake login: Get the key!
  const logout = () => setIsLoggedIn(false); // Lose the key!

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
