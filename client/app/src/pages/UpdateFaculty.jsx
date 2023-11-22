import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import network from "../config/network";

function UpdateFaculty() {
  const { facultyId } = useParams();
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
    section: "",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/faculty/${facultyId}`
        );
        setFacultyData(response.data); // Set fetched faculty data
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };
    fetchFaculty();
  }, [facultyId]);

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
      await axios.put(
        `${network.server}/api/admin/updatefaculty/${facultyId}`,
        facultyData
      );

      toast.success("Faculty updated successfully");
      // Redirect or handle success message
    } catch (error) {
      toast.error("Error updating faculty");
      console.error("Error updating faculty:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit}>
        {/* Input fields for faculty data */}
        <input
          type="text"
          name="name"
          value={facultyData.name}
          onChange={handleInputChange}
          placeholder="Enter Name"
        />
        {/* Other input fields for faculty details */}
        <button type="submit">Update Faculty</button>
      </form>
    </div>
  );
}

export default UpdateFaculty;
