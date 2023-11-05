import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext } from "react";
import { userContext } from "../App";


function AddFaculty() {
  const { token } = useContext(userContext);
  const [FacultyData, setFacultyData] = useState({
    // Initialize state for patient data fields
    name: "",
    email: "",
    password: "",
    username: "",
    gender: "",
    designation: "",
    department: "",
    contactNumber: "",
    dob: "",
    joiningYear: "",
  });


  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFacultyData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      for (const key in FacultyData) {
        formData.append(key, FacultyData[key]);
      }

      const response = await axios.post(
        network.server+"/api/faculty/addfaculty", formData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Faculty created successfully");
        // Reset the form after successful submission
        setFacultyData({
          // Reset patient data fields
          name: "",
          email: "",
          password: "",
          username: "",
          gender: "",
          designation: "",
          department: "",
          contactNumber: "",
          dob: "",
          joiningYear: "",
        });
      }

      console.log("Faculty created:", response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error creating faculty:", error.response.data);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Add Faculties</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="teachers.html">Faculties</a>
                </li>
                <li className="breadcrumb-item active">Add Faculties</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Basic Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Name <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={FacultyData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          id="name"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Gender <span className="login-danger">*</span>
                        </label>
                        <select className="form-control select">
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms calendar-icon">
                        <label>
                          Date Of Birth <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="date"
                          name="dob"
                          value={FacultyData.dob}
                          onChange={handleInputChange}
                          className="form-control"
                          id="dob"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Mobile <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={FacultyData.contactNumber}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Contactnumber"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms calendar-icon">
                        <label>
                          Joining Year <span className="login-danger">*</span>
                        </label>
                        <input
                         required
                         type="date"
                         name="joiningYear"
                         value={FacultyData.joiningYear}
                         onChange={handleInputChange}
                         className="form-control"
                         id="joiningYear"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 local-forms">
                      <div className="form-group">
                        <label>
                          Qualification <span className="login-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Joining Date"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Experience <span className="login-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Experience"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Login Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Username <span className="login-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Username"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Email ID <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={FacultyData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          id="email"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Password <span className="login-danger">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={FacultyData.password}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group local-forms">
                        <label>
                          Username <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="username"
                          value={FacultyData.username}
                          onChange={handleInputChange}
                          className="form-control"
                          id="firstname"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Designation <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="designation"
                          value={FacultyData.designation}
                          onChange={handleInputChange}
                          className="form-control"
                          id="designation"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Department <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="department"
                          value={FacultyData.department}
                          onChange={handleInputChange}
                          className="form-control"
                          id="department"
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
        <p>Copyright © 2022 Webwise Solutions.</p>
      </footer>
    </div>
  );
}
export default AddFaculty;
