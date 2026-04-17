import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);

  // ✅ FIX: stop loading on app start
  useEffect(() => {
    setloading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
      {children}
    </AuthContext.Provider>
  );
};