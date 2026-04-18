import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, setuser, loading, setloading } = context;

  // 🔐 LOGIN
  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
      const data = await login({ email, password });

      if (data?.user) {
        setuser(data.user);
        navigate("/home"); // ✅ proper navigation
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

      if (data?.user) {
        setuser(data.user);
        navigate("/home"); // ✅ fixed
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
      navigate("/login"); // ✅ fixed
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
        const data = await getMe();

        if (data?.user) {
          setuser(data.user);
        } else {
          setuser(null);
        }
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
    handlelogout,
  };
};