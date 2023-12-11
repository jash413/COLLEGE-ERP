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
  const [tableLoading, setTableLoading] = useState(null);
  const [subjects] = useContext(subjectContext);
  const [buttonLoading, setButtonLoading] = useState(false); // for submit button
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    semester: "",
    phase: "",
    section:""
  });
  const [lectures, setLectures] = useState([
    { name: "", startTime: "", endTime: "" },
  ]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handleChanges = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (
      filters.year &&
      filters.semester &&
      filters.section &&
      filters.phase
    ) {
      setTableLoading(true);
      axios
        .get(
          `${network.server}/api/admin/getallfilteredstudent?year=${filters.year}&section=${filters.section}`,
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

  const [multipleUpdate, setMultipleUpdate] = useState([]);

  useEffect(() => {
    if (
      filters.semester &&
      filters.phase &&
      students.length > 0
    ) {
      const updatedMultipleUpdate = students.map((student) => {
        return {
          studentId: student._id,
          semester: filters.semester,
          updatedAttendance: [
            {
              subject: filters.course,
            },
          ],
        };
      });
      setMultipleUpdate(updatedMultipleUpdate);
    }
  }, [filters.semester, filters.phase, students]);

  const handleMultipleUpdate = (e, studentId) => {
    const updatedMultipleUpdate = multipleUpdate.map((student) => {
      if (student.studentId === studentId) {
        const updatedAttendance = student.updatedAttendance.map((attendance) => {
          if (attendance.subject === filters.course) {
            return {
              ...attendance,
              [filters.phase]: e.target.checked, // Assuming e.target.checked is the attendance status
            };
          }
          return attendance;
        });
        return {
          ...student,
          updatedAttendance,
        };
      }
      return student;
    });
  
    setMultipleUpdate(updatedMultipleUpdate);
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


  const handleAddLecture = () => {
    if (lectures.length < 5) {
      setLectures([...lectures, { name: "", startTime: "", endTime: "" }]);
    }
  };
 



  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {}
    if(multipleUpdate.length === 1) {
      data = multipleUpdate[0]
    } else {
      data = {
        multipleUpdate
      }
    }
    setButtonLoading(true);
    axios
      .post(
        `${network.server}/api/admin/updateattendance`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setButtonLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setButtonLoading(false);
      });
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
                    <div className="col-sm-12">
                      <div className=""></div>
                    </div>
                    <div className="row mb-3">
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
                      <div
                      className={`col-md-${
                        user.userType === "faculty" ? 3 : 2
                      }`}
                    >
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

                    <div
                      className={`col-md-${
                        user.userType === "faculty" ? 3 : 2
                      }`}
                    >
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

                    <div className="col-md-3">
                        <div className="form-group">
                          <select
                            className="form-control"
                            name="section"
                            value={filters.section}
                            onChange={handleChanges}
                          >
                            <option value="">Select Section</option>
                            {sections.map((section) => (
                              <option key={section} value={section}>
                                {section}
                              </option>
                            ))}
                          </select>
                        </div>
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
