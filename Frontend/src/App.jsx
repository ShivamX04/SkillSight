import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'

function App() {
   
  return (
    
    <AuthProvider>
      <InterviewProvider>
     <RouterProvider router={router} />
     </InterviewProvider>
     </AuthProvider>
   
  )
}

export default App

/*       4 layers architecture 
 UI
 => component
 => pages

 Hook
 // used to managing state and api layers //
 => hooks

 State
 // data's state management stage(storing data) //
 => auth.context.jsx 
 => ai.context.jsx 

 API 
 // works for frontend to communicate from backend //
 => services
 => auth.api.js */