import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'

// ✅ import RouterProvider
import { RouterProvider } from "react-router-dom"
import { router } from "./router" // your file

import { AuthProvider } from './features/auth/auth.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />  {/* ✅ THIS replaces BrowserRouter */}
    </AuthProvider>
  </StrictMode>
)