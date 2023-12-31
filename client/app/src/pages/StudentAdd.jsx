import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import network from "../config/network";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
import { facultyContext, socketContext } from "../App";

function StudentAdd({ onAdd }) {
  const { token } = useContext(userContext);
  const { socket } = useContext(socketContext);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faculty] = useContext(facultyContext);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [mentor, setMentor] = useState("");
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
    mentor: "",
  });

  const fetchFaculty = async (inputValue) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${network.server}/api/admin/getfilteredfaculty?shortName=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      return response.data.map((faculty) => ({
        value: faculty._id,
        label: faculty.name,
      }));
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setIsLoading(false);
      return [];
    }
  };

  // handle form data
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "mentor") {
      setMentor(e.target.value);
    }
  };

  // socket connection
  useEffect(() => {
    socket.on("progress", (data) => {
      console.log(data);
      setProgress(data);
    });
  }, []);

  useEffect(() => {
    if (formData.to === "all") {
      setSelectedFaculty(null);
    }
  }, [formData.to]);

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
        mentor: "",
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

  // handle sample file download
  const handleSampleFileDownload = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/downloadstudentexceltemplate",
        {
          responseType: "blob", // Set the response type to 'blob' to handle binary data
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Student_Excel_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
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
        `${network.server}/api/admin/addstudentsfromexcel?socketId=${socket.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      onAdd();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setProgress(0);
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
                          {/* <div className="col-12 col-sm-4">
                            <div className="form-group local-forms">
                              <div className="col-12 col-sm-4">
                                <div className="form-group local-forms">
                                  <label className="form-label">
                                    Select Mentor
                                  </label>
                                  <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    onInputChange={handleInputChange}
                                    onChange={handleChange}
                                  />
                                  
                            </div>
                          </div> */}
                          <div className="form-group local-forms">
                        <label>
                          Mentor <span className="login-danger">*</span>
                        </label>
                        <AsyncSelect
                          value={selectedFaculty}
                          isDisabled={formData.to === "mentor"}
                          cacheOptions
                          defaultOptions
                          loadOptions={(inputValue, callback) => {
                            fetchFaculty(inputValue).then((data) => {
                              callback(data);
                            });
                          }}
                          placeholder="Search By Mentor Short Name"
                          onChange={handleFormData}
                          isLoading={isLoading}
                          noOptionsMessage={() => null}
                        />
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
                          <div className="col-12 col-sm-3">
                            <div className="form-group local-forms">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  handleSampleFileDownload();
                                }}
                              >
                                <i className="fas fa-download" /> Download
                                Sample File
                              </button>
                            </div>
                          </div>
                          <p className="text-danger col-12 col-sm-9">
                            Note: Please download the sample file and fill the
                            details
                          </p>
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
                              </div>
                              <br />
                              <span className="progress-value">
                                {progress}% Completed, Please wait do not close
                                the window
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
