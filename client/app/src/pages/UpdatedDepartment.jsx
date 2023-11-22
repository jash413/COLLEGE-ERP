import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext } from "../App";

function UpdateDepartment({ departmentId }) {
  const { token } = useContext(userContext);
  const [departmentData, setDepartmentData] = useState({
    department: "",
    hod: "",
  });

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/departments/${departmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedDepartmentData = response.data; // Replace with the correct data structure
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

    try {
      const response = await axios.put(
        `${network.server}/api/admin/updatedepartment/${departmentId}`,
        departmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Department updated successfully");
      console.log("Department updated:", response.data);
    } catch (error) {
      toast.error("Error updating department");
      console.error("Error updating department:", error);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Your form structure */}
      <form onSubmit={handleFormSubmit}>
        {/* Your form fields */}
        <input
          required
          type="text"
          name="department"
          value={departmentData.department}
          onChange={handleInputChange}
          className="form-control"
          id="department"
          placeholder="Enter Department Name"
        />
        {/* Add other input fields in a similar manner */}
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateDepartment;
