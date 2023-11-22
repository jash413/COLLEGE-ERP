import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useHistory hook for navigation
import network from "../config/network";

function ForgetPassword() {
  const Navigate = useNavigate(); // Navigate function for navigation

  useEffect(() => {
    document.title = "Forget Password | College ERP";
  }, []);

  const [formData, setFormData] = useState({
    userType: "",
    email: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.userType === "" || formData.email === "") {
      toast.error("Please fill all the fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        network.server + `/api/admin/forgotpassword`,
        formData
      );
      if (response.status === 200) {
        const { data } = response;
        toast.success(data.message);
        setFormData({
          userType: "",
          email: "",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const onLoginClick = () => {
    Navigate("/");
  };

  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <img
                className="img-fluid"
                src="assets/img/login.png"
                alt="Logo"
              />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Forgot Password</h1>
                <p className="account-subtitle">Let Us Help You</p>
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
                      Enter your registered email address{" "}
                      <span className="login-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="text"
                      placeholder="Email Address"
                    />
                    <span className="profile-views">
                      <i className="fas fa-envelope" />
                    </span>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block" type="submit">
                      Send Link
                    </button>
                  </div>
                </form>
                <div className="form-group mb-0">
                  <button
                    className="btn btn-primary primary-reset btn-block"
                    type="submit"
                    onClick={() => {
                      onLoginClick();
                    }}
                  >
                    Login
                  </button>
                </div>

                {/* /Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
