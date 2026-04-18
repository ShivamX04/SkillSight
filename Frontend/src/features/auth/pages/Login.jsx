import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../auth.form.scss'
// importing hook
import { useAuth } from '../hooks/useAuth'

const Login = () => {

  const { loading, handleLogin, user } = useAuth();
  const navigate = useNavigate();

  console.log("LOGIN PAGE STATE:", { user, loading });

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

   useEffect(() => {
  if (!loading && user) {
    navigate("/home"); // ✅ go directly to home
  }
}, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await handleLogin({ email, password });

    if (!data?.user) {
      alert("Login failed");
    }
  };

  if (loading) {
  return null; // 🔥 prevents flicker
}

  return (
    <main>

      <form onSubmit={handleSubmit}
        className='form-container'>

        <h1>Login</h1>

        <div className='input-group'>
          <label htmlFor='email'>Email</label>
          <input
            value={email}
            onChange={(e) => {
              setemail(e.target.value)
            }}
            type='email'
            name='email'
            placeholder='Enter email address'
          />
        </div>

        <div className='input-group'>
          <label htmlFor='password'>Password</label>
          <input
            value={password}
            onChange={(e) => {
              setpassword(e.target.value)
            }}
            type='password'
            name='password'
            placeholder='Enter password'
          />
        </div>

        <button className='button primary-button'>Login</button>

        <p>
          Don't have an Account? <Link to='/register'> Register</Link>
        </p>

      </form>
    </main>
  )
}

export default Login
