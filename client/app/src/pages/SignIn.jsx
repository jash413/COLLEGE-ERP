import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import network from "../config/network";

function SignIn({ onSignIn }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "",
    rememberMe: false, // Add a new state for Remember Me
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remember me details from localStorage on component mount
  useEffect(() => {
    const rememberMeData = JSON.parse(localStorage.getItem("rememberMeData"));
    if (rememberMeData) {
      setFormData({ ...formData, ...rememberMeData });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  // handle show password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.username === "" || formData.password === "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        network.server + `/api/${formData.userType}/login`,
        formData
      );
      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem("user", JSON.stringify(data.result));
        localStorage.setItem("token", data.token);

        // Save user login details to localStorage if Remember Me is checked
        if (formData.rememberMe) {
          localStorage.setItem("rememberMeData", JSON.stringify(formData));
        } else {
          localStorage.removeItem("rememberMeData");
        }

        onSignIn();
        toast.success("Login Successful");
        setLoading(false);
      } else {
        console.log("Error in response status");
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Invalid Credentials");
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
                    User Type <span className="login-danger">*</span>
                  </label>
                  <select
                    required
                    name="userType"
                    value={formData.userType}
                    className="form-control"
                    id="department"
                    onChange={handleChange}
                  >
                    <option value="">Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Username <span className="login-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
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
                    required
                    className="form-control pass-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="*********"
                  />
                  <span
                    className="profile-views feather-eye toggle-password"
                    onClick={handleShowPassword}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    Remember Me
                  </label>
                </div><br/>
                <div className="form-group">
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <div className="form-group">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-border text-primary m-2"
                        role="status"
                      />
                    </div>
                  ) : (
                    <button className="btn btn-primary btn-block" type="submit">
                      Login
                    </button>
                  )}
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
