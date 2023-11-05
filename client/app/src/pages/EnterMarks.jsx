import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentContext } from "../App";

function EnterMarks() {
  const [students] = useContext(studentContext);
  const [enrollmentNumber, setEnrollmentNumber] = useState(null);

  const [student, setStudent] = useState({
    name: "",
    department: "",
    batch: "",
    course: [],
  });


  // Get student details
  const getStudentDetails = (enrollmentNumber) => {
        const student = students.find(
          (student) => student.enrollmentNumber === enrollmentNumber
        );
        if (student) {
          setStudent({
            name: student.name,
            department: student.department,
            batch: student.batch,
            course: student.subjects,
          });
      }
    };

  const [marks, setMarks] = useState({
    student: "",
    subject: "",
    t1: "",
    t2: "",
    t3: "",
    t4: "",
    practicalMarksIPE: "",
    practicalMarksProject: "",
  });

  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
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
        {/* /Page Header */}
        <div className="student-group-form">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  placeholder="Search by Enrollment Number ..."
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="search-student-btn">
                <button type="btn" className="btn btn-primary" onClick={getStudentDetails(enrollmentNumber)}>
                  Search
                </button>
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
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Basic Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Name</label>
                        <input
                          readOnly
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          value={student.name ? student.name : "Student Name"}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Department</label>
                        <input
                          readOnly
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          value={student.department ? student.department : "Student Department"}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Batch</label>
                        <input
                          readOnly
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          value={student.batch ? student.batch : "Student Batch"}
                        />
                      </div>
                    </div>
                    {student.course && student.course.length > 0 && (
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Select Course</label>
                        <select className="form-control">
                            <option>Select Course</option>
                            {student.course.map((course) => (
                                <option value={course}>{course}</option>
                            ))
                            }
                        </select>
                      </div>
                    </div>
                    )}
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
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Marks Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T1</label>
                        <input
                          type="text"
                          name="t1"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.t1}
                          placeholder="Enter T1 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T2</label>
                        <input
                          type="text"
                          name="t2"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.t2}
                          placeholder="Enter T2 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T3</label>
                        <input
                          type="text"
                          name="t3"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.t3}
                          placeholder="Enter T3 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T4</label>
                        <input
                          type="text"
                          name="t4"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.t4}
                          placeholder="Enter T4 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>IPE</label>
                        <input
                          type="text"
                          name="practicalMarksIPE"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.practicalMarksIPE}
                          placeholder="Enter IPE Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Practical</label>
                        <input
                          type="text"
                          name="practicalMarksProject"
                          onChange={handleChange}
                          className="form-control"
                          id="name"
                          value={marks.practicalMarksProject}
                          placeholder="Enter Practical Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="student-submit">
                        <button type="submit" className="btn btn-primary">
                          Submit/Update
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

export default EnterMarks;
