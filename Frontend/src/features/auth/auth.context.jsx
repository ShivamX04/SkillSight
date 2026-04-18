import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true); // ✅ keep true initially

  return (
    <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
      {children}
    </AuthContext.Provider>
  );
};