import React, { useState, useEffect, useContext } from "react";
import network from "../config/network";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
import { Link } from "react-router-dom";

function UpdateStudent({ onAdd }) {
  const { token } = useContext(userContext);
  const [studentData, setStudentData] = useState({
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

  const studentId = window.location.pathname.split("/")[3];

  useEffect(() => {
    document.title = "Update Student | College ERP";

    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/students/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudentData(response.data); // Set fetched faculty data
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [studentId, token]);

  const handleFormData = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = {};
    if (studentData.name) data.name = studentData.name;
    if (studentData.department) data.department = studentData.department;
    if (studentData.gender) data.gender = studentData.gender;
    if (studentData.dob) data.gender = studentData.dob;
    if (studentData.batch) data.batch = studentData.batch;
    if (studentData.enrollmentNumber) data.enrollmentNumber = studentData.enrollmentNumber;
    if (studentData.email) data.email = studentData.email;
    if (studentData.contactNumber) data.contactNumber = studentData.contactNumber;
    if (studentData.fatherName) data.fatherName = studentData.fatherName;
    if (studentData.motherName) data.motherName = studentData.motherName;
    if (studentData.fatherContactNumber) data.fatherContactNumber = studentData.fatherContactNumber;
    if (studentData.motherContactNumber) data.motherContactNumber = studentData.motherContactNumber;
    if (studentData.year) data.year = studentData.year;
    if (studentData.section) data.section = studentData.section;

    try {
      const response = await axios.patch(
        `${network.server}/api/admin/updatestudent/${studentId}`,
        studentData
      );

      toast.success("Student updated successfully");
      onAdd();
      console.log("Student Updated:", response.data);
      // Redirect or handle success message
    } catch (error) {
      toast.error("Error updating student");
      console.error("Error updating student:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-sm-12">
                <div className="page-sub-header">
                  <h3 className="page-title">Update Students</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/student/list">Student</Link>
                    </li>
                    <li className="breadcrumb-item active">Update Students</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card comman-shadow">
                <div className="card-body">
                  <form onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <h5 className="form-title student-info">
                          Student Information{" "}
                          <span>
                            <a href="javascript:;">
                              <i className="feather-more-vertical" />
                            </a>
                          </span>
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
                            value={studentData.name}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter First Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Department <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="department"
                            value={studentData.department}
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
                          <select name="gender" value={studentData.gender} onChange={handleFormData} className="form-control select">
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
                            value={studentData.dob}
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
                            value={studentData.batch}
                            onChange={handleFormData}
                            type="text"
                            placeholder="YYYY-YYYY"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Enrollment Number <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="enrollmentNumber"
                            value={studentData.enrollmentNumber}
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
                            value={studentData.email}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="contactNumber"
                            value={studentData.contactNumber}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Contact Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Father Name <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="fatherName"
                            value={studentData.fatherName}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Father Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Mother Name <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="motherName"
                            value={studentData.motherName}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Mother Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                           Father Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="fatherContactNumber"
                            value={studentData.fatherContactNumber}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Father Contact Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                           Mother Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="motherContactNumber"
                            value={studentData.motherContactNumber}
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
                            value={studentData.section}
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
                            value={studentData.year}
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
        <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
      </div>
    </>
  );
}

export default UpdateStudent;
