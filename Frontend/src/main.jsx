import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'
import App from './App.jsx'
import { AuthProvider } from '.features/auth/auth.context.jsx' // ✅ import

console.log("AuthProvider:", AuthProvider);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider>   {/* ✅ WRAP HERE */}
      <App />
    </AuthProvider>
  </StrictMode>
)