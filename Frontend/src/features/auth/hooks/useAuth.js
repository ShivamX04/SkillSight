import { useContext, useState, useEffect } from 'react';
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

  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    try {
      const data = await register({ username, email, password });
      setuser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handlelogout = async () => {
    setloading(true);
    try {
      await logout();
      setuser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setuser(JSON.parse(storedUser));
    }

    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setuser(data.user);
      } catch (err) {
        console.log("GetMe failed:", err.response?.data);
      } finally {
        setloading(false);
      }
    };

    getAndSetUser();
  }, []);

  // ✅ THIS WAS MISSING
  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handlelogout
  };
};