import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        window.alert("Passwords do not match. Please confirm your password.");
        return;
      }

      const response = await fetch(`http://localhost:5050/reset-password/${resetToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        window.alert("Password reset successfully!");
        // maybe redirect the user to a login page?
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert("There was a problem with the password reset request: " + error.message);
    }

    setNewPassword(""); // Clear the password input after submitting
    setConfirmPassword(""); // Clear the confirm password input after submitting
  };

  useEffect(() => {
    // Optionally, you can add logic here to check if the reset token is valid
    // For simplicity, we'll assume the token is valid in this example
  }, [resetToken]);

  return (
    <div className="container text-left">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Reset Password</h1>
      <p>Please enter your new password.</p>
      <form>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
