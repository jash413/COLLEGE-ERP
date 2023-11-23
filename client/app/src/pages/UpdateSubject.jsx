import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext } from "../App";

function UpdateSubject({ subjectId }) {
  const { token } = useContext(userContext);
  const [subjectData, setSubjectData] = useState({
    subjectName: "",
    subjectCode: "",
    totalLectures: 10,
    year: "",
    semester: "",
    theoryCredit: "",
    practicalCredit: "",
    ipeWeightage: "",
    practicalWeightage: "",
  });

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/subjects/${subjectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedSubjectData = response.data; // Replace with the correct data structure
        setSubjectData({ ...fetchedSubjectData });
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjectData();
  }, [subjectId, token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubjectData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${network.server}/api/admin/updatedsubject/${subjectId}`,
        subjectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Subject updated successfully");
      console.log("Subject updated:", response.data);
    } catch (error) {
      toast.error("Error updating subject");
      console.error("Error updating subject:", error);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Your form structure */}
      <form onSubmit={handleSubmit}>
        {/* Your form fields */}
        <input
          required
          type="text"
          name="subjectName"
          value={subjectData.subjectName}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Subject Name"
        />
        {/* Add other input fields in a similar manner */}
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateSubject;
