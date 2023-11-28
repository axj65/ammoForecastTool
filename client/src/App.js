import React, { useState , useEffect} from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes, Navigate } from "react-router-dom";

import './App.css'; // Import your global styles
import "bootstrap/dist/css/bootstrap.css";


 // We import all the components we need in our app
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Login from "./components/login";
import Register from "./components/register";
import Form from "./components/form";
import Table from "./components/table";
import Myevents from "./components/myevents";
import SaveEvent from "./components/saveEvent";
import Faq from "./components/faq";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check for login state in localStorage on component mount
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserName = localStorage.getItem('userName') || "";

    setLoggedIn(storedIsLoggedIn);
    setUserName(storedUserName);

    // Attach event listener when the component mounts
    window.addEventListener("beforeunload", handleLogoutOnClose);

    // Detach the listener when unmounts
    return () => {
      window.removeEventListener("beforeunload", handleLogoutOnClose);
    };
  }, []);

  const handleLogin = (userName) => {
    setLoggedIn(true);
    setUserName(userName);

    // Save login state and user info in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName("");

    // Clear login state and user info
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
  };

  const handleLogoutOnClose = () => {
    // Perform logout logic when the window is about to close & to remove any sensitive information from local storage
    localStorage.clear();
    sessionStorage.clear();
  };



 return (
   <div>
     <Navbar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <div className="d-flex flex-row">
        <div className="flex-fill">
          <Sidebar onLogout={handleLogout} />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route exact path="/" element={<Form/>} />
            <Route path="/app" element={<Form />} />
            <Route path="/table" element={<Table />} />
            <Route path="/myevents" element={<Myevents />} />
            {/* Navigate component to redirect if already logged in */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/saveEvent" element={<SaveEvent />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        </Routes>
        </div>
     </div>
   </div>
 );
};
 export default App;


