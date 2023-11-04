import React, { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import network from "../config/network";


function SignIn({ onSignIn }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [userType, setUserType] = useState("admin");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const response = await axios.post(
        network.server+`/api/${userType}/login`,
        formData
      );
      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem("user", JSON.stringify(data.result));
        localStorage.setItem("token", data.token);
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
                    Username <span className="login-danger">*</span>
                  </label>
                  <input
                    required
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
                    required
                    className="form-control pass-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="profile-views feather-eye toggle-password" />
                </div>
                <div classname="form-group">
                  <label>User Type</label>
                  <div className="radio">
                    <label>
                      <input
                        required
                        type="radio"
                        name="userType"
                        value="admin"
                        onChange={(e) => {
                          setUserType(e.target.value);
                        }}
                      />{" "}
                      Admin
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        required
                        type="radio"
                        name="userType"
                        value="faculty"
                        onChange={(e) => {
                          setUserType(e.target.value);
                        }}
                      />{" "}
                      Faculty
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary m-2" role="status" />
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
