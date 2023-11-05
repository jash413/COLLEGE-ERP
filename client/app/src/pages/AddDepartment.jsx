import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext } from "react";
import { subjectContext, userContext } from "../App";

function AddDepartment() {
  const { token } = useContext(userContext);
  const [DepartmentData, setDepartmentData] = useState({
    // Initialize state for subject data fields
    department: "",
    hod: "",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      for (const key in DepartmentData) {
        formData.append(key, DepartmentData[key]);
      }

      const response = await axios.post(
        `${network.server}/api/admin/adddepartment`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Department added successfully");
      // Reset the form after successful submission
      setDepartmentData({
        // Reset Department data fields
        department: "",
        hod: "",
      });

      console.log("Department created:", response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error creating Department:", error.response.data);
      console.log(DepartmentData);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Add Department</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="departments.html">Department</a>
                </li>
                <li className="breadcrumb-item active">Add Department</li>
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
                        <span>Department Details</span>
                      </h5>
                    </div>

                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Department Name{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="department"
                          value={DepartmentData.department}
                          onChange={handleInputChange}
                          className="form-control"
                          id="department"
                          placeholder="Enter The Name"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          hod <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="hod"
                          value={DepartmentData.hod}
                          onChange={handleInputChange}
                          className="form-control"
                          id="hod"
                          placeholder="Name of hod"
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
export default AddDepartment;
