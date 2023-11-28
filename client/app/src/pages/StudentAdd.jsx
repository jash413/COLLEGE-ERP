import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import network from "../config/network";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
import io from "socket.io-client";

function StudentAdd({ onAdd }) {
  const { token } = useContext(userContext);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    gender: "",
    dob: "",
    batch: "",
    enrollmentNumber: "",
    email: "",
    contactNumber: "",
    fatherName: "",
    motherName: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    year: "",
    section: "",
  });

  // handle form data
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const socket = io(
      "http://localhost:5000",
      {
        transports: ["websocket", "polling", "flashsocket"],
      },
      { path: "/socket.io" },
      { secure: true },
      { rejectUnauthorized: false },
      { cors: { origin: "http://localhost:3000" } },
      { origins: "http://localhost:3000" },
    ); // Replace with your server address
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });
    socket.on("progress", (data) => {
      console.log(data);
      setProgress(data);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${network.server}/api/admin/addstudent`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      onAdd();
      setFormData({
        name: "",
        department: "",
        gender: "",
        dob: "",
        batch: "",
        enrollmentNumber: "",
        email: "",
        contactNumber: "",
        fatherName: "",
        motherName: "",
        fatherContactNumber: "",
        motherContactNumber: "",
        year: "",
        section: "",
      });
    } catch (error) {
      console.log(formData);
      if (error.response.data.emailError) {
        toast.error(error.response.data.emailError);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // handle bulk upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.file.files[0];
    if (!file) {
      toast.error("Please select a file");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `${network.server}/api/admin/addstudentsfromexcel`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setProgress(0);
      onAdd();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // prevent window closing while uploading
  window.onbeforeunload = function (event) {
    // Condition to show the confirmation message based on some logic, e.g., when uploading is in progress
    if (loading) {
      const confirmationMessage = "Are you sure you want to close the window?";
      event.returnValue = confirmationMessage; // For older browsers
      return confirmationMessage; // For modern browsers
    }
  };

  return (
    <>
      {/* add tabs for single and bulk upload */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-sm-12">
                <div className="page-sub-header">
                  <h3 className="page-title">Add Students</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/student/list">Student</Link>
                    </li>
                    <li className="breadcrumb-item active">Add Students</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-white">
              <div className="card-header">
                <h5 className="card-title">Select Upload Type</h5>
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#solid-rounded-justified-tab1"
                      data-bs-toggle="tab"
                    >
                      Single Upload
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#solid-rounded-justified-tab2"
                      data-bs-toggle="tab"
                    >
                      Bulk Upload
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="tab-content">
            <div
              className="tab-pane show active"
              id="solid-rounded-justified-tab1"
            >
              <div className="row">
                <div className="col-sm-12">
                  <div className="card comman-shadow">
                    <div className="card-body">
                      <form onSubmit={handleFormSubmit}>
                        <div className="row">
                          <div className="col-12">
                            <h5 className="form-title student-info">
                              Student Information{" "}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Name <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter First Name"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Department{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="department"
                                value={formData.department}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Department Name"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Gender <span className="login-danger">*</span>
                              </label>
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleFormData}
                                className="form-control select"
                              >
                                <option value="">Select Gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms calendar-icon">
                              <label>
                                Date Of Birth{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control datetimepicker"
                                name="dob"
                                value={formData.dob}
                                onChange={handleFormData}
                                type="text"
                                placeholder="DD-MM-YYYY"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Batch <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="batch"
                                value={formData.batch}
                                onChange={handleFormData}
                                type="text"
                                placeholder="YYYY-YYYY"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Enrollment Number{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="enrollmentNumber"
                                value={formData.enrollmentNumber}
                                onChange={handleFormData}
                                type="number"
                                placeholder="Enter Enrollment Number"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                E-Mail <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Email Address"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Contact Number{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleFormData}
                                type="number"
                                placeholder="Enter Contact Number"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Father Name{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Father Name"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Mother Name{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Mother Name"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Father Contact Number{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="fatherContactNumber"
                                value={formData.fatherContactNumber}
                                onChange={handleFormData}
                                type="number"
                                placeholder="Enter Father Contact Number"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Mother Contact Number{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="motherContactNumber"
                                value={formData.motherContactNumber}
                                onChange={handleFormData}
                                type="number"
                                placeholder="Enter Mother Contact Number"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Section <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="section"
                                value={formData.section}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Section"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Year <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                name="year"
                                value={formData.year}
                                onChange={handleFormData}
                                type="text"
                                placeholder="Enter Year"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="student-submit">
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="solid-rounded-justified-tab2">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card comman-shadow">
                    <div className="card-body">
                      <form onSubmit={handleBulkUpload}>
                        <div className="row">
                          <div className="col-12">
                            <h5 className="form-title student-info">
                              Bulk Upload{" "}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <label>
                                Upload File{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                name="file"
                                accept=".xlsx"
                                placeholder="Upload File"
                                required
                              />
                            </div>
                          </div>
                          <p className="text-danger">
                            Note: Please upload only XLSX file
                          </p>
                          {loading ? (
                            <div className="col-6">
                              <div className="progress progress-md">
                                <div
                                  className="progress-bar progress-bar-striped bg-success"
                                  role="progressbar"
                                  style={{ width: `${progress}%` }}
                                  aria-valuenow={progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div><br />
                              <span className="progress-value">
                                  {progress}% Completed, Please wait do not close the window
                                </span>
                            </div>
                          ) : (
                            <div className="col-12">
                              <div className="student-submit">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <p>Copyright © 2023 Webwise Solutions.</p>
        </footer>
      </div>
    </>
  );
}

export default StudentAdd;
