import React, { useState, useEffect, useContext } from "react";
import network from "../config/network";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";

function UpdateStudent({ studentId }) {
  const { token } = useContext(userContext);
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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/students/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const studentData = response.data; // Replace with your data structure
        setFormData({ ...studentData });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId, token]);

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${network.server}/api/admin/updatestudent/${studentId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      // Handle success
    } catch (error) {
      if (error.response.data.emailError) {
        toast.error(error.response.data.emailError);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <form onSubmit={handleFormSubmit}>
          {/* Your form fields */}
          {/* Example input */}
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleFormData}
            type="text"
            placeholder="Enter Name"
          />
          {/* Add other input fields in a similar manner */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default UpdateStudent;
