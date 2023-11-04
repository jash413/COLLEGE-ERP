import React, { useState } from "react";
import axios from "axios";

function SignIn({ onSignIn }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", formData);

      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem("user", JSON.stringify(data.result));
        localStorage.setItem("token", data.token);
        onSignIn();
      } else {
        console.log("Error in response status");
      }
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="loginbox">
          <div className="login-left">
            <img className="img-fluid" src="assets/img/login.png" alt="Logo" />
          </div>
          <div className="login-right">
            <div className="login-right-wrap">
              <h1>Welcome to Preskool</h1>
              <p className="account-subtitle">Access to our dashboard</p>
              <h2>Sign in</h2>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Username <span className="login-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <span className="profile-views">
                    <i className="fas fa-user-circle" />
                  </span>
                </div>
                <div className="form-group">
                  <label>
                    Password <span className="login-danger">*</span>
                  </label>
                  <input
                    className="form-control pass-input"
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="profile-views feather-eye toggle-password" />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block" type="submit">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
