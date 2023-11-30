import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

import configData from "../config.json";

//import bcrypt from "bcryptjs"; // Import bcryptjs


const sha256 = require('sha256');

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

    // This function will handle the submission.
    async function onSubmit(e) {
      e.preventDefault();

          // Hash both the password and confirmPassword before sending them to the server
      const hashedPassword = sha256(form.password);
      const hashedConfirmPassword = sha256(form.confirmPassword);

      const newUser = {
        ...form,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      };
      
      try {
        const response = await fetch(configData.SERVER_URL+"/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

      const data = await response.text();

      if (response.ok) {
        window.alert("Registered Successfully!");
        navigate("/login");
      } else {
        window.alert(data);
      }
    } catch (error) {
      window.alert(
        "There was a problem with the registration request: " + error.message
      );
    }

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }


 
 // This following section will display the form that takes the input from the user.
 return (
  <div className="container text-left" style={{ marginTop: "130px" }}>
    <br/>
     <h1>Register</h1>
     <form onSubmit={onSubmit}>
        <div className="form-group">
         <label htmlFor="firstName"> First Name</label>
         <input
           type="firstName"
           className="form-control"
           id="firstName"
           value={form.firstName}
           onChange={(e) => updateForm({ firstName: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="lastName"> Last Name</label>
         <input
           type="lastName"
           className="form-control"
           id="lastName"
           value={form.lastName}
           onChange={(e) => updateForm({ lastName: e.target.value })}
         />
       </div>
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
         <label htmlFor="confirmPassword"> Confirm Password</label>
         <input
           type="password"
           className="form-control"
           id="confirmPassword"
           value={form.confirmPassword}
           onChange={(e) => updateForm({ confirmPassword: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Register"
           className="btn btn-submit"
         />
       </div>
     </form>

     <br />
      <p>Already had an account?     <Link to="/login">Login Here</Link></p>
     <br />


   </div>
 );
}


