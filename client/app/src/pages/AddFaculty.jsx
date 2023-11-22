import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext } from "react";
import { userContext, departmentContext } from "../App";
import { Link } from "react-router-dom";

function AddFaculty({ onAdd }) {
  const { token } = useContext(userContext);
  const [departments] = useContext(departmentContext);
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
    userType: "faculty",
    sections: [""], // Change to an array for multiple sections
    joiningDate: "",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFacultyData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSectionChange = (event, index) => {
    const newSections = [...FacultyData.sections];
    newSections[index] = event.target.value;
    setFacultyData((prevData) => ({
      ...prevData,
      sections: newSections,
    }));
  };

  const addSection = () => {
    setFacultyData((prevData) => ({
      ...prevData,
      sections: [...prevData.sections, ""],
    }));
  };

  const removeSection = (index) => {
    const newSections = [...FacultyData.sections];
    newSections.splice(index, 1);
    setFacultyData((prevData) => ({
      ...prevData,
      sections: newSections,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("Faculty created:", FacultyData);
      const response = await axios.post(
        `${network.server}/api/admin/addfaculty`,
        FacultyData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Faculty created successfully");
      onAdd();
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
        userType: "faculty",
        sections: [""],
        joiningDate: "",
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
                  <Link to="/faculty/list">Faculties</Link>
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
                          placeholder="Enter Name"
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
                          <option value="">Select Gender</option>
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
                          placeholder="Enter Mobile Number"
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
                          placeholder="Enter Joining Year"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms calendar-icon">
                        <label>
                          Joining Date <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="date"
                          name="joiningDate"
                          value={FacultyData.joiningDate}
                          onChange={handleInputChange}
                          className="form-control"
                          id="joiningDate"
                          placeholder="Enter Joining Date"
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
                          placeholder="Enter Email ID"
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
                          placeholder="Enter Designation"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Department <span className="login-danger">*</span>
                        </label>
                        <select
                          className="form-control select"
                          value={FacultyData.department}
                          onChange={handleInputChange}
                          name="department"
                        >
                          <option value="">Select Department</option>
                          {departments.map((department) => (
                            <option value={department.department}>
                              {department.department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Section <span className="login-danger">*</span>
                        </label>
                        {FacultyData.sections.map((section, index) => (
                          <div key={index} className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Section"
                              value={section}
                              onChange={(event) =>
                                handleSectionChange(event, index)
                              }
                            />
                            {index !== FacultyData.sections.length - 1 && ( // Display "-" button for sections other than the last one
                              <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => removeSection(index)}
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                            )}
                            {index === FacultyData.sections.length - 1 && ( // Display "+" button for the last section
                              <button
                                className="btn btn-success"
                                type="button"
                                onClick={addSection}
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            )}
                          </div>
                        ))}
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
