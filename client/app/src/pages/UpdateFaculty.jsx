import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useContext,departmentContext } from "../App";
import network from "../config/network";
import { Link } from "react-router-dom";

function UpdateFaculty({ onAdd }) {
  const { token } = useParams();
  const [departments] = useContext(departmentContext);
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    gender: "",
    designation: "",
    department: "",
    contactNumber: "",
    dob: "",
    joiningYear: "",
    userType: "faculty",
    joiningDate : "",
    section: "",
  });

  const facultyId = window.location.pathname.split("/")[3];

  useEffect(() => {
    document.title = "Update Faculty | College ERP";

    const fetchFaculty = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/faculty/${facultyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFacultyData(response.data); // Set fetched faculty data
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };
    fetchFaculty();
  }, [facultyId, token]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFacultyData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSectionChange = (event, index) => {
    const newSections = [...facultyData.sections];
    newSections[index] = event.target.value;
    setFacultyData((prevData) => ({
      ...prevData,
      sections: newSections,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const data = {};
    if (facultyData.email) data.email = facultyData.email;
    if (facultyData.gender) data.gender = facultyData.gender;
    if (facultyData.name) data.name = facultyData.name;
    if (facultyData.designation) data.designation = facultyData.designation;
    if (facultyData.department) data.department = facultyData.department;
    if (facultyData.contactNumber) data.contactNumber = facultyData.contactNumber;
    if (facultyData.dob) data.gender = facultyData.dob;
    if (facultyData.joiningYear) data.joiningYear = facultyData.joiningYear;
    if (facultyData.joiningDate) data.joiningDate = facultyData.joiningDate;
    if (facultyData.section) data.section = facultyData.section;


    try {
      const response = await axios.put(
        `${network.server}/api/admin/updatefaculty/${facultyId}`,
        facultyData
      );

      toast.success("Faculty updated successfully");
      onAdd();
      console.log("Faculty Updated:", response.data);
      // Redirect or handle success message
    } catch (error) {
      toast.error("Error updating faculty");
      console.error("Error updating faculty:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Update Faculties</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/faculty/list">Faculties</Link>
                </li>
                <li className="breadcrumb-item active">Update Faculties</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
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
                          value={facultyData.name}
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
                          value={facultyData.gender}
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
                          value={facultyData.dob}
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
                          value={facultyData.contactNumber}
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
                          value={facultyData.joiningYear}
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
                          value={facultyData.joiningDate}
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
                          value={facultyData.email}
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
                          value={facultyData.designation}
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
                          value={facultyData.department}
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
                        {facultyData.sections.map((section, index) => (
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

export default UpdateFaculty;
