import React, { useState, useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { subjectContext,userContext, departmentContext } from "../App";
import network from "../config/network";
import axios from "axios";

function TimeTable() {
  const { token, user } = useContext(userContext);
  const [date, setDate] = useState(new Date());
  const [departments] = useContext(departmentContext);
  const [subjects] = useContext(subjectContext);
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [tableLoading, setTableLoading] = useState(null);
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([
    { name: "", startTime: "", endTime: "" },
  ]);

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    semester: "",
    section: "",
    course: "",
    phase: "",
  });

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleLectureChange = (event, index, field) => {
    const updatedLectures = [...lectures];
    updatedLectures[index][field] = event.target.value;
    setLectures(updatedLectures);
  };

  const handleRemoveLecture = (index) => {
    if (lectures.length > 1) {
      const updatedLectures = [...lectures];
      updatedLectures.splice(index, 1);
      setLectures(updatedLectures);
    }
  };

  const handleChanges = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddLecture = () => {
    if (lectures.length < 5) {
      setLectures([...lectures, { name: "", startTime: "", endTime: "" }]);
    }
  };
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

//   subjects for section 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for your submit logic
    setTimeout(() => {
      // Simulating an API call completion
      toast.success("Form submitted successfully!");
    }, 2000); // Replace this with your actual API call
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Filter Section */}

        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Add Time Table</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/faculty/list">Time Table</Link>
                </li>
                <li className="breadcrumb-item active">Add Time table</li>
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
                    <div className="row mb-3">
                      <div className="col-md-2">
                        {/* Department Input */}
                        {(
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
                        )}
                        
                      </div>
                      <div className="col-md-2">
                        {/* Section Input */}
                        {user.userType === "admin" && (
                          <div className="form-group">
                            <input
                              disabled={user.userType === "faculty"}
                              type="text"
                              className="form-control"
                              placeholder="Enter Section"
                              name="section"
                              value={filters.section}
                              onChange={handleChanges}
                            />
                          </div>
                        )}
                      </div>

                      {/* /Filter Section */}
                    </div>
                    <div className="col-12"></div>
                    <div className="col-12">
                      <div className="form-group local-forms">
                        <label>
                          Lecture <span className="login-danger">*</span>
                        </label>
                        {lectures.map((lecture, index) => (
                          <div className="col-12 col-sm-4">
                            <div key={index} className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`Enter Lecture ${index + 1}`}
                                value={lecture.name}
                                onChange={(event) =>
                                  handleLectureChange(event, index, "name")
                                }
                              />
                              <input
                                type="time"
                                className="form-control"
                                placeholder="Start Time"
                                value={lecture.startTime}
                                onChange={(event) =>
                                  handleLectureChange(event, index, "startTime")
                                }
                              />
                              <input
                                type="time"
                                className="form-control"
                                placeholder="End Time"
                                value={lecture.endTime}
                                onChange={(event) =>
                                  handleLectureChange(event, index, "endTime")
                                }
                              />
                              {index !== lectures.length - 1 && (
                                // Display "-" button for sections other than the last one
                                <button
                                  className="btn btn-danger"
                                  type="button"
                                  onClick={() => handleRemoveLecture(index)}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              )}
                              {index === lectures.length - 1 && (
                                // Display "+" button for the last section
                                <button
                                  className="btn btn-success"
                                  type="button"
                                  onClick={handleAddLecture}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              )}
                            </div>
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
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
    </div>
  );
}

export default TimeTable;
