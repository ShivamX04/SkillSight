import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/*      
                     4 layers architecture 
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