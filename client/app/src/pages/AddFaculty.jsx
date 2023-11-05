import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext } from "react";
import { userContext } from "../App";

function AddFaculty() {
  const { token } = useContext(userContext);
  const [FacultyData, setFacultyData] = useState({
    // Initialize state for faculty data fields
    name: "",
    email: "",
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
        `${network.server}/api/admin/addfaculty`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Faculty created successfully");
      // Reset the form after successful submission
      setFacultyData({
        // Reset faculty data fields
        name: "",
        email: "",
        gender: "",
        designation: "",
        department: "",
        contactNumber: "",
        dob: "",
        joiningYear: "",
      });

      console.log("Faculty created:", response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error creating faculty:", error.response.data);
      console.log(FacultyData);
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
                <form onSubmit={handleSubmit}>
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
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Gender <span className="login-danger">*</span>
                        </label>
                        <select
                          className="form-control select"
                          value={FacultyData.gender}
                          onChange={handleInputChange}
                          name="gender"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
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
                          name="contactNumber"
                          value={FacultyData.contactNumber}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Contactnumber"
                          placeholder="Enter mobile no"
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
                          type="number"
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
                          placeholder="Enter qualification"
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
                          placeholder="Enter e-mail id"
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
                          placeholder="Enter designation"
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
                          placeholder="Enter department"
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
