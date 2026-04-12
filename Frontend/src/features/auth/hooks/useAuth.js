import {useContext,useState, useEffect} from 'react';
import {AuthContext} from "../auth.context";
import {login, register, logout, getMe} from '../services/auth.api'

// hooks folder used to manage storage (state) and API //

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user, setuser, loading, setloading} = context

const handleLogin = async ({ email, password }) => {
  setloading(true);

  try {
    const data = await login({ email, password });

    if (data?.user && data?.token) {
      setuser(data.user);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // ✅ IMPORTANT
    }

    return data;
  } catch (err) {
    console.log("Login err: ",err.response?.data || err);
    return null;
  } finally {
    setloading(false);
  }
};

    const handleRegister = async ({username, email, password}) =>{
        setloading(true)
        try{
        const data = await register({username,email, password})
         setuser(data.user)
        }catch(err){

        } finally{
        setloading(false)
        }
    }

    const handlelogout = async()=>{
        setloading(true)
        try{
        const data = await logout()
        setuser(null)
        }catch(err){
            
        } finally{
        setloading(false)
        }
    }

   useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setloading(false);
    return;
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

    return { user, loading, handleRegister, handleLogin, handlelogout }
}
