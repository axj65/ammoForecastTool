import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import Form from "./components/form";
import Table from "./components/table";
 const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
        <Route exact path="/" element={<Form/>} />
        <Route path="/app" element={<Form />} />
        <Route path="/table" element={<Table />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
     </Routes>
   </div>
 );
};
 export default App;