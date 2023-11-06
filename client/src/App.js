import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Navbar from "./components/navbar";
import Login from "./components/login";
import Home from "./components/home";
import Register from "./components/register";
import Form from "./components/form";
 const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<Form/>} />
       <Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
     </Routes>
   </div>
 );
};
 export default App;