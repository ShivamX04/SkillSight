import React,{useState} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const Register = () => {

  const navigate = useNavigate()
  const [username, setusername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    console.log("SUBMIT FIRED");
    const data = await handleRegister({username,email,password})
    console.log(data)
    navigate('/')
  }

  if(loading){
    return (<main><h1>loading...</h1></main>)
  }

  return (
     <main>

        <form onSubmit={handleSubmit}
        className='form-container'>
            <h1> Register </h1>

        <div className='input-group'>
         <label htmlFor='Username'>Username</label>
         <input
         onChange={(e) =>{
          setusername(e.target.value)
         }}
         type='username' name='username' placeholder='Enter the Username'/>
        </div>
        <div className='input-group'>
         <label htmlFor='email'>Email</label>
         <input
         onChange={(e) =>{
          setEmail(e.target.value)
         }}
          type='email' name='email' placeholder='Enter email address'/>
        </div>

        <div className='input-group'>
          <label htmlFor='password'>Password</label>
          <input
          onChange={(e) =>{
            setpassword(e.target.value)
          }}
          type='password' name='password' placeholder='Enter password'/>
        </div>

       <button className='button primary-button'>Register</button>
        

        <p>Already have an Account? <Link to={"/"}>Login</Link></p>
        </form>
     </main>
  )
}

export default Register

