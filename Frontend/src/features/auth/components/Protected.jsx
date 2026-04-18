import { Navigate } from "react-router-dom";
/*import { useContext } from "react";
import { AuthContext } from "../auth.context"; */
import { useAuth } from "../hooks/useAuth"
import React from 'react'

const Protected = ({ children }) => {
 /* const { user, loading } = useContext(AuthContext); */
    const {loading, user} = useAuth()

    console.log("PROTECTED STATE:", { user, loading });
  if (loading) {
    return (<main><h1>Loading...</h1></main>)
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;