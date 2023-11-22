import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useHistory hook for navigation
import network from "../config/network";

// import images
import img1 from "../assets/img/login.png";

function ResetPassword() {
  const Navigate = useNavigate(); // Navigate function for navigation

  useEffect(() => {
    document.title = "Reset Password | College ERP";
  }, []);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    token: window.location.pathname.split("/")[2],
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

    if (formData.password === "" || formData.confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }

    console.log(formData);
    try {
      const response = await axios.post(
        network.server + `/api/admin/resetpassword`,
        formData
      );
      if (response.status === 200) {
        const { data } = response;
        toast.success(data.message);
        Navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <img className="img-fluid" src={img1} alt="Logo" />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Reset Password</h1>
                <p className="account-subtitle">Let Us Help You</p>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>
                      New Password <span className="login-danger">*</span>
                    </label>
                    <input
                      required
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      className="form-control"
                      id="password"
                      onChange={handleChange}
                      placeholder="Enter New Password"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Confirm Password <span className="login-danger">*</span>
                    </label>
                    <input
                      required
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      className="form-control"
                      id="password"
                      onChange={handleChange}
                      placeholder="Enter Confirm Password"
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block" type="submit">
                      Reset My Password
                    </button>
                  </div>
                </form>

                {/* /Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
