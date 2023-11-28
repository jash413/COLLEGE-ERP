import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext,departmentContext } from "../App";
// import { Link } from "react-router-dom";

function UpdateSubject({ onAdd }) {
  const { token } = useContext(userContext);
  const [ department ] = useContext(departmentContext);
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

  const subjestId = window.location.pathname.split("/")[3];

  useEffect(() => {
    document.title = "Update Subject | College ERP";

    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/subjects/${subjestId}`,
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
  }, [subjestId, token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubjectData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};
    if (subjectData.subjectName) data.subjectName = subjectData.subjectName;
    if (subjectData.subjectCode) data.subjectCode = subjectData.subjectCode;
    if (subjectData.year) data.year = subjectData.year;
    if (subjectData.semester) data.semester = subjectData.semester;
    if (subjectData.theoryCredit) data.theoryCredit = subjectData.theoryCredit;
    if (subjectData.practicalCredit)
      data.practicalCredit = subjectData.practicalCredit;
    if (subjectData.ipeWeightage) data.ipeWeightage = subjectData.ipeWeightage;
    if (subjectData.practicalWeightage)
      data.practicalWeightage = subjectData.practicalWeightage;

    try {
      const response = await axios.patch(
        `${network.server}/api/admin/updatesubject/${subjestId}`,
        subjectData
      );

      toast.success("Subject updated successfully");
      onAdd();
      console.log("Subject Updated:", response.data);
      // Redirect or handle success message
    } catch (error) {
      toast.error("Error updating subject");
      console.error("Error updating subject:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Update Subject</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="subjects.html">Subject</a>
                </li>
                <li className="breadcrumb-item active">Update Subject</li>
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
                        <span>Subject Information</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Subject Name <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="SubjectName"
                          value={subjectData.subjectName}
                          onChange={handleInputChange}
                          className="form-control"
                          id="subjectName"
                          placeholder="Enter Subject"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Subject Code <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="SubjectCode"
                          value={subjectData.subjectCode}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Code"
                          placeholder="Enter Code"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Department <span className="login-danger">*</span>
                        </label>
                        <select
                          required
                          name="department"
                          value={subjectData.department}
                          onChange={handleInputChange}
                          className="form-control"
                          id="department"
                        >
                          <option value="">Select Department</option>
                          {department.map((dept) => (
                            <option key={dept._id} value={dept.department}>
                              {dept.department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Total Lectures <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="number"
                          name="totalLectures"
                          value={subjectData.totalLectures}
                          onChange={handleInputChange}
                          className="form-control"
                          id="totalLectures"
                          placeholder="Total No Of Lectures"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Year <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="year"
                          value={subjectData.year}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter The Year"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Semester <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          min={1}
                          max={8}
                          type="number"
                          name="semester"
                          value={subjectData.semester}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter The Semester"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Theory Credit{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          min={0}
                          max={10}
                          type="number"
                          name="theoryCredit"
                          value={subjectData.theoryCredit}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter Theory Credit"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Practical Credit{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          min={0}
                          max={10}
                          type="number"
                          name="practicalCredit"
                          value={subjectData.practicalCredit}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter Practical Credit"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          IPE Weightage{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          min={0}
                          max={100}
                          type="number"
                          name="ipeWeightage"
                          value={subjectData.theoryWeightage}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter IPE Weightage in %"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>
                          Practical Weightage{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          min={0}
                          max={100}
                          type="number"
                          name="practicalWeightage"
                          value={subjectData.practicalWeightage}
                          onChange={handleInputChange}
                          className="form-control"
                          id="Enter Subject"
                          placeholder="Enter Practical Weightage in %"
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

export default UpdateSubject;
