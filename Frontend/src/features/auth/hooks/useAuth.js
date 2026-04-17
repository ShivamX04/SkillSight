import { useContext, useEffect } from 'react';
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from '../services/auth.api';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, setuser, loading, setloading } = context;

  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
    const data = await login({ email, password });

    console.log("LOGIN RESPONSE:", data);

    if (data?.user) {
      setuser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
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

      // ✅ FIX: only check user
      if (data?.user) {
        setuser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "/home";
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

      // ✅ clear stored user
      localStorage.removeItem("user");

      window.location.href = "/login";
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
        const data = await getMe(); // cookie-based auth
        setuser(data.user);
      } catch (err) {
        console.log("GetMe failed:", err.response?.data);
        setuser(null);
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