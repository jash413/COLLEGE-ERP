import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext } from "../App";
import { Link } from "react-router-dom";

function UpdateDepartment({ onAdd }) {
  const { token } = useContext(userContext);
  const [departmentData, setDepartmentData] = useState({
    department: "",
    hod: "",
  });

  const departmentId = window.location.pathname.split("/")[3];

  useEffect(() => {
    document.title = "Update Department | College ERP";

    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/getdepartmentbyid/${departmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedDepartmentData = response.data.department; // Replace with the correct data structure
        setDepartmentData({ ...fetchedDepartmentData });
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartmentData();
  }, [departmentId, token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    const data = {};
    if (departmentData.department) data.department = departmentData.department;
    if (departmentData.hod) data.hod = departmentData.hod;
    

    try {
      const response = await axios.patch(
        `${network.server}/updatedepartment/${departmentId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Department updated successfully");
      onAdd();
      console.log("Department updated:", response.data);
    } catch (error) {
      toast.error("Error updating department");
      console.error("Error updating department:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Update Department</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={"/department/list"}>Department</Link>
                </li>
                <li className="breadcrumb-item active">Update Department</li>
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
                          type="text"
                          name="department"
                          value={departmentData.department}
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
                          type="text"
                          name="hod"
                          value={departmentData.hod}
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
                          Update
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

export default UpdateDepartment;
