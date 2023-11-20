import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { subjectContext, userContext, departmentContext } from "../App";
import { toast } from "react-hot-toast";
import network from "../config/network";
import axios from "axios";

function EnterMarks() {
  const { token, user } = useContext(userContext);
  const [subjects] = useContext(subjectContext);
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [departments] = useContext(departmentContext);
  const [students, setStudents] = useState([]);
  const [tableLoading, setTableLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(true); // for submit button
  const [sections, setSections] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    year: "",
    semester: "",
    section: "",
    course: "",
    phase: "",
  });

  useEffect(() => {
    if (user.userType === "faculty") {
      filters.department = user.department;
      filters.section = user.section;
    }
  }, [user]);

  const handleChanges = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // filter subjects based on selected department
  useEffect(() => {
    if (filters.department && filters.semester) {
      const subject = subjects.filter((subject) => {
        if (
          subject.department === filters.department &&
          subject.semester === parseInt(filters.semester)
        ) {
          return subject;
        }
      });
      setDepartmentSubjects(subject);
    }
  }, [filters.department, filters.semester, subjects]);

  // get students based on selected filters
  useEffect(() => {
    if (
      filters.department &&
      filters.year &&
      filters.semester &&
      filters.section &&
      filters.course &&
      filters.phase
    ) {
      setTableLoading(true);
      axios
        .get(
          `${network.server}/api/admin/getallfilteredstudent?department=${filters.department}&year=${filters.year}&section=${filters.section}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setStudents(res.data);
          setTableLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }, [filters, token]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="page-sub-header">
                <h3 className="page-title">Enter Marks</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/student/list">Marks</Link>
                  </li>
                  <li className="breadcrumb-item active">Enter Marks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row">
                    {user.userType === "admin" && (
                    <div className="col-md-2">
                      <div className="form-group">
                        <select
                          disabled={user.userType === "faculty" ? true : false}
                          className="form-control"
                          name="department"
                          value={filters.department}
                          onChange={handleChanges}
                        >
                          <option value="">Select Department</option>
                          {departments.map((department) => (
                            <option
                              key={department._id}
                              value={department.department}
                            >
                              {department.department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    )}
                    {user.userType === "admin" && (
                    <div className="col-md-2">
                      <div className="form-group">
                        <input
                          disabled={user.userType === "faculty" ? true : false}
                          type="text"
                          className="form-control"
                          placeholder="Enter Section"
                          name="section"
                          value={filters.section}
                          onChange={handleChanges}
                        />
                      </div>
                    </div>
                    )}
                    <div className={`col-md-${user.userType === "faculty" ? 3 : 2}`}>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="year"
                          value={filters.year}
                          onChange={handleChanges}
                        >
                          <option value="">Select Year</option>
                          <option value="FY">FY</option>
                          <option value="SY">SY</option>
                          <option value="TY">TY</option>
                          <option value="FINAL">FINAL YEAR</option>
                        </select>
                      </div>
                    </div>
                    <div className={`col-md-${user.userType === "faculty" ? 3 : 2}`}>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="semester"
                          value={filters.semester}
                          onChange={handleChanges}
                        >
                          <option value="">Select Semester</option>
                          <option value="1">Semester 1</option>
                          <option value="2">Semester 2</option>
                          <option value="3">Semester 3</option>
                          <option value="4">Semester 4</option>
                          <option value="5">Semester 5</option>
                          <option value="6">Semester 6</option>
                          <option value="7">Semester 7</option>
                          <option value="8">Semester 8</option>
                        </select>
                      </div>
                    </div>
                    <div className={`col-md-${user.userType === "faculty" ? 3 : 2}`}>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="course"
                          value={filters.course}
                          onChange={handleChanges}
                        >
                          <option value="">Select Course</option>
                          {departmentSubjects.map((subject) => (
                            <option
                              key={subject._id}
                              value={subject.subjectName}
                            >
                              {subject.subjectName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={`col-md-${user.userType === "faculty" ? 3 : 2}`}>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="phase"
                          value={filters.phase}
                          onChange={handleChanges}
                        >
                          <option value="">Select Phase</option>
                          <option value="T1">T1</option>
                          <option value="T2">T2</option>
                          <option value="T3">T3</option>
                          <option value="T4">T4</option>
                          <option value="ipe">IPE</option>
                          <option value="project">Practical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Enrollment Number</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Batch</th>
                        <th>Enter Marks (Out Of 25)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableLoading && students.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                          </td>
                        </tr>
                      )}
                      {students.length === 0 &&
                        !tableLoading &&
                        tableLoading !== null && (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No Students Found
                            </td>
                          </tr>
                        )}
                      {!tableLoading &&
                        students.map((student) => (
                          <tr key={student._id}>
                            <td>{student.enrollmentNumber}</td>
                            <td>{student.name}</td>
                            <td>{student.department}</td>
                            <td>{student.batch}</td>
                            <td>
                              <input type="number" min={0} max={25} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="submit-section">
                    {!buttonLoading && (
                      <button className="btn btn-primary submit-btn">
                        Submit
                      </button>
                    )}
                    {buttonLoading && (
                      <button className="btn btn-primary submit-btn" disabled>
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
    </div>
  );
}

export default EnterMarks;
