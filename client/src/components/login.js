import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './style.css';

const sha256 = require('sha256');

export default function Login({ onLogin }) {
 const [form, setForm] = useState({
   email: "",
   password: "",
 });
 const navigate = useNavigate();
 
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

async function onSubmit(e) {
  e.preventDefault();
  const hashedPassword = sha256(form.password);

  const loginCredentials = {
    ...form,
    password: hashedPassword,
  };

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginCredentials),
    });

    const data = await response.json(); // Expecting JSON response now

    if (response.ok) {
      localStorage.setItem('userId', data.userId); // Store user ID in local storage
      onLogin(form.email);
      navigate("/app/");
      // window.alert("Logged In Successfully!");
    } else {
      window.alert(data.message); // Adjust based on server response structure
    }
  } catch (error) {
    window.alert("There was a problem with the login request: " + error.message);
  }

  setForm({ email: "", password: "" });
}

 
 // This following section will display the form that takes the input from the user.
 return (
   <div className="container text-left">
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
     <h1>Login</h1>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="email">Email</label>
         <input
           type="text"
           className="form-control"
           id="email"
           value={form.email}
           onChange={(e) => updateForm({ email: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="password">Password</label>
         <input
           type="password"
           className="form-control"
           id="password"
           value={form.password}
           onChange={(e) => updateForm({ password: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Login"
           className="btn btn-submit"
         />
       </div>
     </form>
     
      {/* Add a link to the registration page */}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    
   </div>



 );
}
