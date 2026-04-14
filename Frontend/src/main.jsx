import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'
import { InterviewProvider } from './features/interview/interview.context.jsx'

// ✅ import RouterProvider
import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes.jsx"

import { AuthProvider } from './features/auth/auth.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <InterviewProvider>
      <RouterProvider router={router} />  {/* ✅ THIS replaces BrowserRouter */}
      </InterviewProvider>
    </AuthProvider>
  </StrictMode>
)