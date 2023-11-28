// ForgotPassword.js

import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await fetch("http://localhost:5050/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        window.alert("Reset password email sent successfully!");
        // Optionally, you can redirect the user to a confirmation page
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert("There was a problem with the reset password request: " + error.message);
    }

    setEmail(""); // Clear the email input after submitting
  };

  return (
    <div className="container text-left">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Forgot Password</h1>
      <p>Please enter your email address to reset your password.</p>
      <form>
        <div className="form-group">
          <label htmlFor="resetEmail">Email</label>
          <input
            type="text"
            className="form-control"
            id="resetEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-submit" onClick={handleResetPassword}>
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
