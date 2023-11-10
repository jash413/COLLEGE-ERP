import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext } from "react";
import { userContext, departmentContext } from "../App";

function AddSubject({onAdd}) {
  const { token } = useContext(userContext);
  const [ department ] = useContext(departmentContext);
  const [SubjectData, setSubjectData] = useState({
    // Initialize state for subject data fields
    subjectName: "",
    subjectCode: "",
    department: "",
    totalLectures: 10,
    year: "",
    semester: "",
    credit: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const camelCaseName = name.charAt(0).toLowerCase() + name.slice(1);
    setSubjectData((prevState) => ({ ...prevState, [camelCaseName]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      for (const key in SubjectData) {
        formData.append(key, SubjectData[key]);
      }

      const response = await axios.post(
        `${network.server}/api/admin/addsubject`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("subject added successfully");
      onAdd();
      // Reset the form after successful submission
      setSubjectData({
        // Reset faculty data fields
        subjectName: "",
        subjectCode: "",
        department: "",
        totalLectures: 10,
        year: "",
        semester: "",
        credit: "",
      });

      console.log("Faculty created:", response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error creating subject:", error.response.data);
      console.log(SubjectData);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Add Subject</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="subjects.html">Subject</a>
                </li>
                <li className="breadcrumb-item active">Add Subject</li>
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
                          value={SubjectData.subjectName}
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
                          value={SubjectData.subjectCode}
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
                          value={SubjectData.department}
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
                          value={SubjectData.totalLectures}
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
                          value={SubjectData.year}
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
                          type="number"
                          name="semester"
                          value={SubjectData.semester}
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
                          Credit <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="number"
                          name="credit"
                          value={SubjectData.credit}
                          onChange={handleInputChange}
                          className="form-control"
                          id="credit"
                          placeholder="Credit Of This Subject"
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

export default AddSubject;
