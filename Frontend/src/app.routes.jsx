import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from './features/auth/pages/Login';
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from './features/interview/pages/Home.jsx';
import Interview from './features/interview/pages/interview.jsx';
import { useAuth } from "./features/auth/hooks/useAuth";

// 🔥 ROOT DECISION COMPONENT
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // ⛔ block everything

  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect /> // ✅ FIXED ROOT
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/home',
    element: (
      <Protected>
        <Home />
      </Protected>
    )
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    )
  }
]);