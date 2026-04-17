import { useContext, useEffect } from 'react';
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from '../services/auth.api';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, setuser, loading, setloading } = context;

  // 🔐 LOGIN
  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
      const data = await login({ email, password });

      console.log("LOGIN RESPONSE:", data);

      if (data?.user && data?.token) {
        setuser(data.user);

        // ✅ store both
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (err) {
      console.log("Login err:", err.response?.data || err);
      return null;
    } finally {
      setloading(false);
    }
  };

  // 📝 REGISTER
  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    try {
      const data = await register({ username, email, password });

      if (data?.user && data?.token) {
        setuser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  // 🚪 LOGOUT
  const handlelogout = async () => {
    setloading(true);
    try {
      await logout();

      setuser(null);

      // ✅ clear everything
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  // 🔄 CHECK AUTH ON APP LOAD
  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ No token → no user
        if (!token) {
          setuser(null);
          return;
        }

        const data = await getMe();
        setuser(data.user);

      } catch (err) {
        console.log("GetMe failed:", err.response?.data);

        // ❌ invalid token → clear everything
        setuser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

      } finally {
        setloading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handlelogout
  };
};